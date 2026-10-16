// Turns raw batches (types.ts) into the numbers on /stats. Runs in the
// browser, so the same code works whether the batches come from the local
// collector or, later, from Firestore.

import type { Batch, ClientInfo, Geo, PageInfo, Perf, TrackEvent } from "./types";

const TZ = "America/Bogota";
const BOUNCE_MS = 10_000;

export interface PageView {
	pvid: string;
	sid: string;
	vid: string;
	/** server receive time of the first batch */
	at: number;
	/** server receive time of the latest batch */
	last: number;
	page: PageInfo;
	client: ClientInfo;
	geo: Geo;
	engagedMs: number;
	maxScroll: number;
	sections: Record<string, number>;
	perf: Perf;
	events: TrackEvent[];
}

export interface Session {
	sid: string;
	vid: string;
	at: number;
	last: number;
	pvs: PageView[];
	engagedMs: number;
	bounced: boolean;
	landing: PageView;
}

export interface Row {
	key: string;
	label: string;
	n: number;
	/** distinct sessions behind n */
	sessions?: number;
	extra?: string;
}

export interface Filters {
	from: number;
	to: number;
	path: string; // "" = all
	excludeInternal: boolean;
}

export function mergePageViews(batches: Batch[]): PageView[] {
	const byPv = new Map<string, PageView>();
	const sorted = [...batches].sort((a, b) => a.seq - b.seq || (a.rt ?? 0) - (b.rt ?? 0));
	for (const b of sorted) {
		const rt = b.rt ?? b.ts;
		let pv = byPv.get(b.pvid);
		if (!pv) {
			pv = {
				pvid: b.pvid,
				sid: b.sid,
				vid: b.vid,
				at: rt,
				last: rt,
				page: b.page,
				client: b.client,
				geo: b.geo ?? { src: "none" },
				engagedMs: 0,
				maxScroll: 0,
				sections: {},
				perf: {},
				events: []
			};
			byPv.set(b.pvid, pv);
		}
		pv.at = Math.min(pv.at, rt);
		pv.last = Math.max(pv.last, b.rtLast ?? rt);
		// the summary is cumulative, so keep the largest value seen
		pv.engagedMs = Math.max(pv.engagedMs, b.summary.engagedMs ?? 0);
		pv.maxScroll = Math.max(pv.maxScroll, b.summary.maxScroll ?? 0);
		for (const [s, ms] of Object.entries(b.summary.sections ?? {})) {
			pv.sections[s] = Math.max(pv.sections[s] ?? 0, ms);
		}
		pv.perf = { ...pv.perf, ...b.summary.perf };
		if ((!pv.geo || pv.geo.src === "none") && b.geo) pv.geo = b.geo;
		pv.events.push(...b.events);
	}
	return [...byPv.values()];
}

export function filterPageViews(pvs: PageView[], f: Filters): PageView[] {
	return pvs.filter(
		(pv) =>
			pv.at >= f.from &&
			pv.at <= f.to &&
			(!f.path || pv.page.path === f.path) &&
			!(f.excludeInternal && pv.client.internal)
	);
}

export function sessionsOf(pvs: PageView[]): Session[] {
	const by = new Map<string, PageView[]>();
	for (const pv of pvs) {
		const list = by.get(pv.sid);
		if (list) list.push(pv);
		else by.set(pv.sid, [pv]);
	}
	return [...by.entries()].map(([sid, list]) => {
		list.sort((a, b) => a.at - b.at);
		const engagedMs = list.reduce((s, p) => s + p.engagedMs, 0);
		const clicked = list.some((p) => p.events.some((e) => e.k === "click"));
		return {
			sid,
			vid: list[0].vid,
			at: list[0].at,
			last: Math.max(...list.map((p) => p.last)),
			pvs: list,
			engagedMs,
			bounced: list.length === 1 && engagedMs < BOUNCE_MS && !clicked,
			landing: list[0]
		};
	});
}

// ------------------------------------------------------------------ helpers

export function countBy<T>(
	items: T[],
	key: (x: T) => string | undefined | null,
	opts: { label?: (k: string) => string; sessionOf?: (x: T) => string } = {}
): Row[] {
	const m = new Map<string, { n: number; s: Set<string> }>();
	for (const x of items) {
		const k = key(x);
		if (k === undefined || k === null || k === "") continue;
		let r = m.get(k);
		if (!r) m.set(k, (r = { n: 0, s: new Set() }));
		r.n += 1;
		if (opts.sessionOf) r.s.add(opts.sessionOf(x));
	}
	return [...m.entries()]
		.map(([k, r]) => ({
			key: k,
			label: opts.label ? opts.label(k) : k,
			n: r.n,
			sessions: opts.sessionOf ? r.s.size : undefined
		}))
		.sort((a, b) => b.n - a.n);
}

export function quantile(values: number[], q: number): number | undefined {
	const v = values.filter((x) => Number.isFinite(x)).sort((a, b) => a - b);
	if (!v.length) return undefined;
	const i = (v.length - 1) * q;
	const lo = Math.floor(i);
	const hi = Math.ceil(i);
	return v[lo] + (v[hi] - v[lo]) * (i - lo);
}

const dayFmt = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" });
const hourFmt = new Intl.DateTimeFormat("en-US", { timeZone: TZ, hour: "numeric", hourCycle: "h23" });
const wdFmt = new Intl.DateTimeFormat("en-US", { timeZone: TZ, weekday: "short" });
const WD = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** YYYY-MM-DD in Bogotá time */
export const bogotaDay = (ms: number) => dayFmt.format(ms);
export const bogotaHour = (ms: number) => Number(hourFmt.format(ms)) % 24;
/** 0 = Monday */
export const bogotaWeekday = (ms: number) => WD.indexOf(wdFmt.format(ms));

export function referrerOf(pv: PageView): string {
	const r = pv.page.ref;
	if (!r) return "(directo)";
	if (r.startsWith("internal:")) return "(interno)";
	try {
		const h = new URL(r).hostname.replace(/^www\./, "");
		if (/(^|\.)instagram\.com$/.test(h)) return "instagram.com";
		if (/(^|\.)facebook\.com$|^fb\.me$|^m\.facebook\.com$|^l\.facebook\.com$/.test(h)) return "facebook.com";
		if (/(^|\.)google\./.test(h)) return "google";
		if (/(^|\.)tiktok\.com$/.test(h)) return "tiktok.com";
		if (/(^|\.)whatsapp\.com$|^wa\.me$/.test(h)) return "whatsapp";
		if (/^t\.co$|(^|\.)x\.com$|(^|\.)twitter\.com$/.test(h)) return "x.com";
		return h;
	} catch {
		return r.slice(0, 60);
	}
}

/** Where a session came from: utm source, else referrer, else in-app browser. */
export function channelOf(s: Session): string {
	const pv = s.landing;
	if (pv.page.utm?.source) return pv.page.utm.source.toLowerCase();
	const ref = referrerOf(pv);
	if (ref === "(directo)" && pv.client.inApp) return `${pv.client.inApp.toLowerCase()} (app)`;
	return ref;
}

export function screenBucket(w: number): string {
	if (w < 400) return "< 400 px";
	if (w < 768) return "400–767 px";
	if (w < 1024) return "768–1023 px";
	if (w < 1440) return "1024–1439 px";
	return "≥ 1440 px";
}
