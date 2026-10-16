// First-party analytics tracker. Records page views, scroll depth, section
// visibility, clicks, rage clicks, JS errors and Web Vitals, and ships them in
// batches (see types.ts) to the collector.
//
// Where it goes depends on the host (BACKENDS below): the local collector on
// the perkeo test domain, Firestore (REST API, no SDK) on calicapitalfest.com.
// Other hosts send nothing.
//
// The team can tag their own browsers with ?interno=1 (?interno=0 undoes it);
// the dashboard can then leave that traffic out.

import { SCHEMA_VERSION } from "./types";
import type { Batch, ClientInfo, Geo, PageInfo, Perf, TrackEvent, Utm } from "./types";
import { firebaseWebConfig } from "$lib/firebaseWebConfig";

type Backend = "local" | "firestore";
const BACKENDS: Record<string, Backend> = {
	"calicapitalfest.figarofigaro.org": "local",
	"perkeo.local": "local",
	localhost: "local",
	"calicapitalfest.com": "firestore",
	"www.calicapitalfest.com": "firestore",
	"calicapitalfest.github.io": "firestore"
};
const LOCAL_ENDPOINT = "/api/analytics/collect";
export const FIRESTORE_COLLECTION = "analytics_pageviews";

const SESSION_IDLE_MS = 30 * 60_000;
const ACTIVE_WINDOW_MS = 60_000;
// Firestore bills per write, so it flushes less often
const FLUSH_EVERY_MS: Record<Backend, number> = { local: 15_000, firestore: 30_000 };
const FIRST_FLUSH_MS = 2_000;
const MAX_EVENTS_PER_PAGE = 400;
const MAX_ERRORS_PER_PAGE = 5;
const SCROLL_MARKS = [25, 50, 75, 90, 100];
const BOT_UA = /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|preview|facebookexternalhit|whatsapp\/|embedly|monitor/i;

const K_VISITOR = "cc_a_vid";
const K_SESSION = "cc_a_sid";
const K_INTERNAL = "cc_a_internal";
const K_GEO = "cc_a_geo";

// ---------------------------------------------------------------- storage

function read(store: Storage | undefined, key: string): string | null {
	try {
		return store?.getItem(key) ?? null;
	} catch {
		return null;
	}
}
function write(store: Storage | undefined, key: string, value: string) {
	try {
		store?.setItem(key, value);
	} catch {
		/* private mode / blocked storage: ids just won't persist */
	}
}

function uid(): string {
	if (crypto?.randomUUID) return crypto.randomUUID();
	return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

interface VisitorState {
	id: string;
	firstSeen: number;
	visits: number;
}
interface SessionState {
	id: string;
	last: number;
	pages: number;
	/** referrer/utm of the landing page, kept for the whole session */
	ref: string;
	utm: Utm;
}

// ---------------------------------------------------------------- client info

function parseUa(ua: string): Pick<ClientInfo, "os" | "browser" | "inApp" | "device"> {
	const inApp =
		/Instagram/i.test(ua) ? "Instagram"
		: /FBAN|FBAV|FB_IAB/i.test(ua) ? "Facebook"
		: /musical_ly|TikTok|BytedanceWebview/i.test(ua) ? "TikTok"
		: /WhatsApp/i.test(ua) ? "WhatsApp"
		: /Twitter/i.test(ua) ? "X/Twitter"
		: /LinkedInApp/i.test(ua) ? "LinkedIn"
		: /Snapchat/i.test(ua) ? "Snapchat"
		: "";
	const os =
		/Windows/i.test(ua) ? "Windows"
		: /iPhone|iPad|iPod/i.test(ua) ? "iOS"
		: /Android/i.test(ua) ? "Android"
		: /CrOS/i.test(ua) ? "ChromeOS"
		: /Mac OS X|Macintosh/i.test(ua) ? (navigator.maxTouchPoints > 1 ? "iOS" : "macOS")
		: /Linux/i.test(ua) ? "Linux"
		: "Otro";
	const browser =
		inApp ? inApp
		: /SamsungBrowser/i.test(ua) ? "Samsung Internet"
		: /OPR\/|Opera/i.test(ua) ? "Opera"
		: /Edg\//i.test(ua) ? "Edge"
		: /Firefox|FxiOS/i.test(ua) ? "Firefox"
		: /CriOS|Chrome/i.test(ua) ? "Chrome"
		: /Safari/i.test(ua) ? "Safari"
		: "Otro";
	const short = Math.min(screen.width, screen.height);
	const device =
		/iPad|Tablet/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua)) || (os === "iOS" && short >= 700)
			? "tablet"
			: /Mobi|iPhone|Android/i.test(ua) || (navigator.maxTouchPoints > 0 && short < 600)
				? "mobile"
				: "desktop";
	return { os, browser, inApp, device };
}

function readUtm(params: URLSearchParams): Utm {
	const utm: Utm = {};
	for (const k of ["source", "medium", "campaign", "content", "term"] as const) {
		const v = params.get(`utm_${k}`);
		if (v) utm[k] = v.slice(0, 100);
	}
	// Meta and Google click ids imply the source even without utm_ tags
	if (!utm.source && params.has("fbclid")) utm.source = "facebook/instagram (fbclid)";
	if (!utm.source && params.has("gclid")) utm.source = "google ads (gclid)";
	if (!utm.source && params.has("ttclid")) utm.source = "tiktok (ttclid)";
	return utm;
}

// ---------------------------------------------------------------- helpers

// ---------------------------------------------------------------- firestore

type FsValue = Record<string, unknown>;

/** JSON → Firestore REST "Value" */
function fsValue(v: unknown): FsValue {
	if (v === null || v === undefined) return { nullValue: null };
	if (typeof v === "boolean") return { booleanValue: v };
	if (typeof v === "number") return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
	if (typeof v === "string") return { stringValue: v };
	if (Array.isArray(v)) return { arrayValue: v.length ? { values: v.map(fsValue) } : {} };
	return { mapValue: { fields: fsFields(v as Record<string, unknown>) } };
}
function fsFields(o: Record<string, unknown>): Record<string, FsValue> {
	const out: Record<string, FsValue> = {};
	for (const [k, v] of Object.entries(o)) if (v !== undefined) out[k] = fsValue(v);
	return out;
}

/**
 * One commit per flush on the page view's document: overwrite the summary,
 * append the new events, stamp rt (and rt0 on the first batch) with the
 * server's clock.
 */
function firestoreCommit(batch: Batch): string {
	const { projectId } = firebaseWebConfig;
	const name = `projects/${projectId}/databases/(default)/documents/${FIRESTORE_COLLECTION}/${batch.pvid}`;
	const { events, ...rest } = batch;
	const fields = fsFields(rest as unknown as Record<string, unknown>);
	const transforms: Record<string, unknown>[] = [
		{ fieldPath: "rt", setToServerValue: "REQUEST_TIME" }
	];
	if (batch.seq === 0) transforms.push({ fieldPath: "rt0", setToServerValue: "REQUEST_TIME" });
	if (events.length) transforms.push({ fieldPath: "events", appendMissingElements: { values: events.map(fsValue) } });
	return JSON.stringify({
		writes: [
			{
				update: { name, fields },
				updateMask: { fieldPaths: Object.keys(fields) },
				updateTransforms: transforms
			}
		]
	});
}

/** City-level location from the visitor's IP; the local collector does this server-side. */
async function lookupGeo(): Promise<Geo | undefined> {
	try {
		const cached = JSON.parse(sessionStorage.getItem(K_GEO) ?? "null");
		if (cached) return cached;
	} catch {}
	try {
		const r = await fetch("https://get.geojs.io/v1/ip/geo.json", { signal: AbortSignal.timeout(5000) });
		const j = await r.json();
		const num = (v: unknown) => (v === undefined || v === "" || isNaN(Number(v)) ? undefined : Number(v));
		const geo: Geo = {
			cc: j.country_code,
			country: j.country,
			region: j.region,
			city: j.city,
			lat: num(j.latitude),
			lon: num(j.longitude),
			src: "lookup"
		};
		write(sessionStorage, K_GEO, JSON.stringify(geo));
		return geo;
	} catch {
		return undefined;
	}
}

function clean(s: string | null | undefined, max = 80): string {
	return (s ?? "").replace(/\s+/g, " ").trim().slice(0, max);
}

function sectionOf(el: Element): string {
	const named = el.closest<HTMLElement>("[data-track-section], section[id]");
	if (named) return named.dataset.trackSection || named.id;
	if (el.closest(".nav__menu, nav")) return "menu";
	if (el.closest("header")) return "header";
	if (el.closest("footer")) return "footer";
	if (el.closest(".hero")) return "hero";
	return "";
}

function labelOf(el: Element): string {
	const h = el as HTMLElement;
	return (
		clean(h.dataset?.track) ||
		clean(el.getAttribute("aria-label")) ||
		clean(h.innerText || el.textContent) ||
		clean(el.querySelector("img")?.getAttribute("alt")) ||
		clean(el.getAttribute("title")) ||
		clean(el.getAttribute("href")) ||
		el.tagName.toLowerCase()
	);
}

function cardOf(el: Element): string | undefined {
	const card = el.closest<HTMLElement>("[data-track-card], .dc, article");
	if (!card) return undefined;
	if (card.dataset.trackCard) return clean(card.dataset.trackCard, 60);
	// card titles are one <span> per word, with no spaces between them
	const title = card.querySelector(".dc__title, h3, h2");
	if (!title) return undefined;
	const words = title.children.length ? [...title.children].map((c) => c.textContent) : [title.textContent];
	return clean(words.join(" "), 60) || undefined;
}

/**
 * The element the page scrolls in. On this site it is <body>, not the
 * window: app.css gives html and body height: 100% with overflow-x: hidden,
 * which makes body the scroll container and leaves window.scrollY at 0.
 */
function scroller(): { top: number; height: number; view: number } {
	const body = document.body;
	if (body && body.scrollHeight > body.clientHeight + 1 && getComputedStyle(body).overflowY !== "visible") {
		return { top: body.scrollTop, height: body.scrollHeight, view: body.clientHeight };
	}
	const doc = document.documentElement;
	return { top: window.scrollY || doc.scrollTop, height: doc.scrollHeight, view: window.innerHeight };
}

function scrollPct(): number {
	const { top, height, view } = scroller();
	if (height <= 0) return 0;
	return Math.min(100, Math.round(((top + view) / height) * 100));
}

// ---------------------------------------------------------------- tracker

class Tracker {
	private backend: Backend;
	private geo?: Geo;
	private visitor!: VisitorState;
	private session!: SessionState;
	private client!: ClientInfo;

	private pvid = "";
	private seq = 0;
	private page!: PageInfo;
	private pageStart = 0;
	private events: TrackEvent[] = [];
	private eventCount = 0;
	private errors = 0;
	private engagedMs = 0;
	private maxScroll = 0;
	private marks = new Set<number>();
	private sections: Record<string, number> = {};
	private seenSections = new Set<string>();
	private visibleSections = new Set<string>();
	private perf: Perf = {};
	private dirty = false;
	private lastActivity = Date.now();
	private lastTick = Date.now();
	private lastPath = "";
	private recentClicks: { t: number; x: number; y: number; l: string; s: string }[] = [];
	private io?: IntersectionObserver;
	private observed = new WeakSet<Element>();
	private timers: number[] = [];

	constructor(backend: Backend) {
		this.backend = backend;
	}

	start() {
		if (this.backend === "firestore") lookupGeo().then((g) => (this.geo = g));
		this.loadIdentity();
		this.listen();
		this.observePerf();
	}

	private loadIdentity() {
		const params = new URLSearchParams(location.search);
		if (params.get("interno") === "1") write(localStorage, K_INTERNAL, "1");
		if (params.get("interno") === "0") write(localStorage, K_INTERNAL, "0");

		const now = Date.now();
		let v: VisitorState | null = null;
		try {
			v = JSON.parse(read(localStorage, K_VISITOR) ?? "null");
		} catch {}
		let s: SessionState | null = null;
		try {
			s = JSON.parse(read(localStorage, K_SESSION) ?? "null");
		} catch {}

		if (!v?.id) v = { id: uid(), firstSeen: now, visits: 0 };
		if (!s?.id || now - s.last > SESSION_IDLE_MS) {
			v.visits += 1;
			s = { id: uid(), last: now, pages: 0, ref: document.referrer, utm: readUtm(params) };
		} else {
			// a tagged link opened mid-session still counts for that campaign
			const utm = readUtm(params);
			if (Object.keys(utm).length) s.utm = utm;
		}
		this.visitor = v;
		this.session = s;
		this.saveIdentity();

		const ua = navigator.userAgent;
		const conn = (navigator as Navigator & { connection?: { effectiveType?: string } }).connection;
		this.client = {
			lang: navigator.language,
			tz: Intl.DateTimeFormat().resolvedOptions().timeZone ?? "",
			sw: screen.width,
			sh: screen.height,
			vw: window.innerWidth,
			vh: window.innerHeight,
			dpr: window.devicePixelRatio || 1,
			...parseUa(ua),
			touch: navigator.maxTouchPoints > 0,
			net: conn?.effectiveType ?? "",
			ua: ua.slice(0, 300),
			visitN: v.visits,
			firstSeen: v.firstSeen,
			internal: read(localStorage, K_INTERNAL) === "1"
		};
	}

	private saveIdentity() {
		write(localStorage, K_VISITOR, JSON.stringify(this.visitor));
		write(localStorage, K_SESSION, JSON.stringify(this.session));
	}

	/** Called on every SvelteKit navigation (and the first load). */
	pageview(url: URL) {
		if (url.pathname === this.lastPath) return; // hash jumps within a page
		const prevPath = this.lastPath;
		if (this.pvid) this.flush(true);
		this.lastPath = url.pathname;

		const now = Date.now();
		if (now - this.session.last > SESSION_IDLE_MS) {
			// came back to an old tab: new session
			this.visitor.visits += 1;
			this.client.visitN = this.visitor.visits;
			this.session = { id: uid(), last: now, pages: 0, ref: document.referrer, utm: readUtm(url.searchParams) };
		}
		this.session.pages += 1;
		this.session.last = now;
		this.saveIdentity();

		this.pvid = uid();
		this.seq = 0;
		this.pageStart = now;
		this.page = {
			path: url.pathname,
			title: clean(document.title, 120),
			ref: prevPath ? `internal:${prevPath}` : clean(this.session.ref, 300),
			utm: this.session.utm,
			host: location.host,
			st: now,
			land: this.session.pages === 1
		};
		this.events = [];
		this.eventCount = 0;
		this.errors = 0;
		this.engagedMs = 0;
		this.maxScroll = 0;
		this.marks.clear();
		this.sections = {};
		this.seenSections.clear();
		this.visibleSections.clear();
		this.lastActivity = now;
		this.lastTick = now;
		this.dirty = true;
		if (prevPath) this.perf = {}; // vitals only describe the hard load

		this.observeSections();
		this.onScroll();
		this.timers.forEach(clearTimeout);
		this.timers = [
			window.setTimeout(() => this.flush(), FIRST_FLUSH_MS),
			// content below the preloader / carousels may mount late
			window.setTimeout(() => this.observeSections(), 1500),
			window.setTimeout(() => this.observeSections(), 5000)
		];
	}

	private push(e: TrackEvent) {
		if (this.eventCount >= MAX_EVENTS_PER_PAGE) return;
		e.i = this.eventCount;
		this.eventCount += 1;
		this.events.push(e);
		this.dirty = true;
	}

	private t() {
		return Date.now() - this.pageStart;
	}

	// -------------------------------------------------------------- listeners

	private listen() {
		const active = () => {
			this.lastActivity = Date.now();
		};
		let moveThrottle = 0;
		addEventListener("pointerdown", active, { passive: true, capture: true });
		addEventListener("keydown", active, { passive: true, capture: true });
		addEventListener("touchstart", active, { passive: true, capture: true });
		addEventListener(
			"pointermove",
			() => {
				const n = Date.now();
				if (n - moveThrottle > 1000) {
					moveThrottle = n;
					active();
				}
			},
			{ passive: true }
		);
		// capture on document: scroll events don't bubble, and here it's body that scrolls
		document.addEventListener(
			"scroll",
			() => {
				active();
				this.onScroll();
			},
			{ passive: true, capture: true }
		);
		addEventListener("resize", () => this.onScroll(), { passive: true });

		document.addEventListener("click", (e) => this.onClick(e), { capture: true });

		addEventListener("error", (e) => {
			this.onError(e.message || String(e.error ?? "error"), e.filename ? `${e.filename}:${e.lineno}` : undefined);
		});
		addEventListener("unhandledrejection", (e) => {
			const r = e.reason;
			this.onError(`unhandledrejection: ${r?.message ?? String(r)}`);
		});

		document.addEventListener("visibilitychange", () => {
			if (!this.pvid) return;
			this.tick();
			if (document.visibilityState === "hidden") {
				this.push({ k: "hidden", t: this.t() });
				this.flush(true);
			} else {
				this.lastActivity = Date.now();
				this.lastTick = Date.now();
				this.push({ k: "visible", t: this.t() });
			}
		});
		addEventListener("pagehide", () => this.flush(true));

		setInterval(() => this.tick(), 1000);
		setInterval(() => this.flush(), FLUSH_EVERY_MS[this.backend]);
	}

	/** Accumulates engaged time and per-section time once a second. */
	private tick() {
		const now = Date.now();
		const dt = Math.min(now - this.lastTick, 5000);
		this.lastTick = now;
		if (!this.pvid || document.visibilityState !== "visible") return;
		if (now - this.lastActivity > ACTIVE_WINDOW_MS) return;
		this.engagedMs += dt;
		for (const s of this.visibleSections) this.sections[s] = (this.sections[s] ?? 0) + dt;
		this.session.last = now;
		this.dirty = true;
	}

	private onScroll() {
		if (!this.pvid) return;
		const p = scrollPct();
		if (p > this.maxScroll) {
			this.maxScroll = p;
			this.dirty = true;
		}
		for (const m of SCROLL_MARKS) {
			if (p >= m && !this.marks.has(m)) {
				this.marks.add(m);
				this.push({ k: "scroll", t: this.t(), p: m });
			}
		}
	}

	private onClick(e: MouseEvent) {
		if (!this.pvid || !(e.target instanceof Element)) return;
		const sc = scroller();
		const x = Math.round((e.clientX / Math.max(window.innerWidth, 1)) * 1000) / 10;
		const y = Math.round(((sc.top + e.clientY) / Math.max(sc.height, 1)) * 1000) / 10;

		const el = e.target.closest(
			"a, button, [role=button], [data-track], input[type=submit], input[type=button], summary, label, select"
		);
		const label = el ? labelOf(el) : "(fuera de un botón)";
		const section = sectionOf(el ?? e.target);

		// rage click: 3+ clicks within 1s and 40px of each other
		const now = Date.now();
		this.recentClicks = this.recentClicks.filter((c) => now - c.t < 1000);
		this.recentClicks.push({ t: now, x: e.clientX, y: e.clientY, l: label, s: section });
		const near = this.recentClicks.filter(
			(c) => Math.abs(c.x - e.clientX) < 40 && Math.abs(c.y - e.clientY) < 40
		);
		if (near.length === 3) this.push({ k: "rage", t: this.t(), l: label, s: section, n: 3 });

		if (!el) return;
		const a = el.closest("a");
		const href = a?.getAttribute("href") ?? undefined;
		let out: boolean | undefined;
		if (a && href) {
			try {
				const u = new URL(href, location.href);
				out = u.protocol === "mailto:" || u.protocol === "tel:" || u.host !== location.host || undefined;
			} catch {}
		}
		this.push({
			k: "click",
			t: this.t(),
			l: label,
			s: section,
			c: cardOf(el),
			e: el.tagName.toLowerCase(),
			h: href ? clean(href, 200) : undefined,
			out,
			x,
			y
		});
		// leaving the site: send now, the tab may not come back
		if (out) this.flush(true);
	}

	private onError(message: string, src?: string) {
		if (!this.pvid || this.errors >= MAX_ERRORS_PER_PAGE) return;
		this.errors += 1;
		this.push({ k: "error", t: this.t(), m: clean(message, 200), src: src ? clean(src, 200) : undefined });
	}

	// -------------------------------------------------------------- sections

	private observeSections() {
		if (!("IntersectionObserver" in window)) return;
		this.io ??= new IntersectionObserver(
			(entries) => {
				for (const en of entries) {
					const el = en.target as HTMLElement;
					const id = el.dataset.trackSection || el.id;
					// "seen" = half the section on screen, or it fills half the screen
					const covers = en.intersectionRect.height / Math.max(window.innerHeight, 1);
					const on = en.isIntersecting && (en.intersectionRatio >= 0.5 || covers >= 0.5);
					if (on) {
						this.visibleSections.add(id);
						if (!this.seenSections.has(id)) {
							this.seenSections.add(id);
							this.push({ k: "section", t: this.t(), s: id });
						}
					} else {
						this.visibleSections.delete(id);
					}
				}
			},
			{ threshold: [0, 0.1, 0.25, 0.4, 0.5, 0.6, 0.75, 1] }
		);
		for (const el of document.querySelectorAll("section[id], [data-track-section]")) {
			if (this.observed.has(el)) continue;
			this.observed.add(el);
			this.io.observe(el);
		}
	}

	// -------------------------------------------------------------- vitals

	private observePerf() {
		const nav = performance.getEntriesByType?.("navigation")[0] as PerformanceNavigationTiming | undefined;
		if (nav) {
			this.perf.ttfb = Math.round(nav.responseStart);
			const setLoad = () => {
				if (nav.loadEventEnd > 0) this.perf.load = Math.round(nav.loadEventEnd);
			};
			if (document.readyState === "complete") setLoad();
			else addEventListener("load", () => setTimeout(setLoad, 0), { once: true });
		}
		const po = (type: string, cb: (list: PerformanceEntryList) => void, extra: object = {}) => {
			try {
				new PerformanceObserver((l) => cb(l.getEntries())).observe({ type, buffered: true, ...extra });
			} catch {
				/* entry type not supported by this browser */
			}
		};
		po("paint", (es) => {
			for (const e of es) if (e.name === "first-contentful-paint") this.perf.fcp = Math.round(e.startTime);
		});
		po("largest-contentful-paint", (es) => {
			const last = es[es.length - 1];
			if (last) this.perf.lcp = Math.round(last.startTime);
		});
		let cls = 0;
		po("layout-shift", (es) => {
			for (const e of es as (PerformanceEntry & { value: number; hadRecentInput: boolean })[]) {
				if (!e.hadRecentInput) cls += e.value;
			}
			this.perf.cls = Math.round(cls * 1000) / 1000;
		});
		po(
			"event",
			(es) => {
				for (const e of es) {
					if (e.duration > (this.perf.inp ?? 0)) this.perf.inp = Math.round(e.duration);
				}
			},
			{ durationThreshold: 40 }
		);
	}

	// -------------------------------------------------------------- transport

	private flush(final = false) {
		if (!this.pvid || !this.dirty) return;
		this.dirty = false;
		this.client.vw = window.innerWidth;
		this.client.vh = window.innerHeight;
		const batch: Batch = {
			v: SCHEMA_VERSION,
			vid: this.visitor.id,
			sid: this.session.id,
			pvid: this.pvid,
			seq: this.seq++,
			ts: Date.now(),
			page: this.page,
			client: this.client,
			summary: {
				engagedMs: this.engagedMs,
				maxScroll: this.maxScroll,
				sections: { ...this.sections },
				perf: { ...this.perf }
			},
			events: this.events
		};
		if (this.geo) batch.geo = this.geo;
		this.events = [];
		if (this.backend === "firestore") {
			const { projectId, apiKey } = firebaseWebConfig;
			const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:commit?key=${apiKey}`;
			const body = firestoreCommit(batch);
			fetch(url, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body,
				keepalive: body.length < 60_000
			}).catch(() => {});
			return;
		}
		const body = JSON.stringify(batch);
		// text/plain keeps it a "simple" request: no CORS preflight
		const blob = new Blob([body], { type: "text/plain" });
		if (final && navigator.sendBeacon?.(LOCAL_ENDPOINT, blob)) return;
		fetch(LOCAL_ENDPOINT, { method: "POST", body: blob, keepalive: body.length < 60_000 }).catch(() => {});
	}
}

let tracker: Tracker | null = null;

/** Starts tracking (once) and records a page view for `url`. Browser only. */
export function trackPageview(url: URL) {
	if (typeof window === "undefined") return;
	if (!tracker) {
		const backend = BACKENDS[location.hostname];
		if (!backend) return;
		if (backend === "firestore" && !firebaseWebConfig.apiKey) return;
		if (navigator.webdriver || BOT_UA.test(navigator.userAgent)) return;
		tracker = new Tracker(backend);
		tracker.start();
	}
	tracker.pageview(url);
}
