<script lang="ts">
	// Analytics dashboard. Aggregates in the browser ($lib/analytics/aggregate.ts)
	// whatever the data source returns:
	// - on the perkeo test domain, the local collector's batches
	//   (analytics-server/collector.mjs), behind the token printed in the
	//   dev-server log and kept in .analytics-data/.token;
	// - everywhere else (calicapitalfest.com), the Firestore page-view
	//   documents ($lib/analytics/firestoreSource.ts), behind Google sign-in.
	//   ?source=firebase forces this one on the test domain.
	import { onMount, onDestroy } from "svelte";
	import type { Batch } from "$lib/analytics/types";
	import {
		mergePageViews,
		filterPageViews,
		sessionsOf,
		countBy,
		quantile,
		bogotaDay,
		bogotaHour,
		bogotaWeekday,
		referrerOf,
		channelOf,
		screenBucket,
		type PageView,
		type Row
	} from "$lib/analytics/aggregate";

	const API = "/api/analytics/batches";
	const K_TOKEN = "cc_stats_token";
	const K_PREFS = "cc_stats_prefs";
	const DAY = 86_400_000;

	const SECTIONS: [string, string][] = [
		["top", "Portada"],
		["acerca", "El Festival"],
		["lineup", "Line Up"],
		["paquetes", "Paquetes"],
		["league", "League of Giants"],
		["battles", "Battles of Giants"],
		["cronograma", "Agenda"],
		["apoyan", "Apoyan"]
	];
	const SECTION_LABEL: Record<string, string> = {
		...Object.fromEntries(SECTIONS),
		menu: "Menú",
		header: "Barra superior",
		footer: "Pie de página",
		hero: "Portada"
	};
	const RANGES = [
		{ id: "today", label: "Hoy" },
		{ id: "7d", label: "7 días" },
		{ id: "30d", label: "30 días" },
		{ id: "all", label: "Todo" }
	] as const;
	type RangeId = (typeof RANGES)[number]["id"];

	const LOCAL_HOSTS = ["calicapitalfest.figarofigaro.org", "perkeo.local", "localhost"];
	type FsModule = typeof import("$lib/analytics/firestoreSource");
	let source = $state<"local" | "firestore">("local");
	let fs: FsModule | undefined;
	let user = $state<{ email: string | null } | null>(null);
	let authReady = $state(false);

	let token = $state("");
	let tokenInput = $state("");
	let needToken = $state(false);
	let loading = $state(false);
	let error = $state("");
	let batches = $state<Batch[]>([]);
	let serverNow = $state(Date.now());
	let lastLoad = $state(0);

	let range = $state<RangeId>("7d");
	let pathFilter = $state("");
	let excludeInternal = $state(true);
	let autoRefresh = $state(true);
	let mapMode = $state<"heat" | "bubbles">("heat");

	function storage(): Storage | undefined {
		try {
			return localStorage;
		} catch {
			return undefined;
		}
	}

	function rangeFrom(id: RangeId, now: number): number {
		if (id === "all") return 0;
		if (id === "today") {
			// midnight in Bogotá (UTC-5, no DST)
			const d = new Date(now - 5 * 3600_000);
			return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) + 5 * 3600_000;
		}
		return now - (id === "7d" ? 7 : 30) * DAY;
	}

	async function load(full = false) {
		if (source === "firestore") return loadFirestore(full);
		if (!token) {
			needToken = true;
			return;
		}
		loading = true;
		error = "";
		try {
			// always fetch at least 30 days so "live now" and range switches don't refetch
			const from = range === "all" ? 0 : Math.min(rangeFrom(range, Date.now()), Date.now() - 30 * DAY);
			const r = await fetch(`${API}?from=${from}`, { headers: { Authorization: `Bearer ${token}` } });
			if (r.status === 401) {
				needToken = true;
				storage()?.removeItem(K_TOKEN);
				return;
			}
			if (!r.ok) throw new Error(`HTTP ${r.status}`);
			const j = await r.json();
			batches = j.batches;
			serverNow = j.now;
			lastLoad = Date.now();
			needToken = false;
		} catch (e) {
			error = `No se pudieron cargar los datos (${(e as Error).message}). ¿Está corriendo el colector?`;
		} finally {
			loading = false;
		}
	}

	async function loadFirestore(full: boolean) {
		if (!fs || !user) {
			needToken = true;
			return;
		}
		loading = true;
		error = "";
		try {
			const from = range === "all" ? 0 : Math.min(rangeFrom(range, Date.now()), Date.now() - 30 * DAY);
			const r = await fs.loadPageviews(from, full);
			batches = r.batches;
			serverNow = r.now;
			lastLoad = Date.now();
			needToken = false;
		} catch (e) {
			const code = (e as { code?: string }).code;
			error =
				code === "permission-denied"
					? `La cuenta ${user.email} no tiene acceso a las estadísticas.`
					: `No se pudieron cargar los datos (${(e as Error).message}).`;
		} finally {
			loading = false;
		}
	}

	async function googleSignIn() {
		error = "";
		try {
			await fs?.signIn();
		} catch (e) {
			error = `No se pudo iniciar sesión (${(e as Error).message}).`;
		}
	}

	function saveToken(e: SubmitEvent) {
		e.preventDefault();
		token = tokenInput.trim();
		try {
			storage()?.setItem(K_TOKEN, token);
		} catch {}
		load();
	}

	let timer: number | undefined;
	onMount(() => {
		token = storage()?.getItem(K_TOKEN) ?? "";
		try {
			const p = JSON.parse(storage()?.getItem(K_PREFS) ?? "{}");
			if (p.range) range = p.range;
			if (typeof p.excludeInternal === "boolean") excludeInternal = p.excludeInternal;
			if (p.mapMode) mapMode = p.mapMode;
		} catch {}
		const forced = new URLSearchParams(location.search).get("source");
		source = forced === "firebase" || !LOCAL_HOSTS.includes(location.hostname) ? "firestore" : "local";
		if (source === "firestore") {
			needToken = true;
			import("$lib/analytics/firestoreSource").then((m) => {
				fs = m;
				m.watchUser((u) => {
					user = u ? { email: u.email } : null;
					authReady = true;
					batches = [];
					if (u) load();
					else needToken = true;
				});
			});
		} else load();
		timer = window.setInterval(() => {
			if (autoRefresh && !needToken && document.visibilityState === "visible") load();
		}, 30_000);
	});
	onDestroy(() => clearInterval(timer));

	$effect(() => {
		const prefs = JSON.stringify({ range, excludeInternal, mapMode });
		try {
			storage()?.setItem(K_PREFS, prefs);
		} catch {}
	});

	// ------------------------------------------------------------ aggregates

	const allPvs = $derived(mergePageViews(batches));
	const paths = $derived(countBy(allPvs, (p) => p.page.path));
	const pvs = $derived(
		filterPageViews(allPvs, {
			from: rangeFrom(range, serverNow),
			to: serverNow + 60_000,
			path: pathFilter,
			excludeInternal
		})
	);
	const sessions = $derived(sessionsOf(pvs));
	const visitors = $derived(new Set(pvs.map((p) => p.vid)).size);
	const live = $derived(
		new Set(
			allPvs
				.filter((p) => serverNow - p.last < 2 * 60_000 && !(excludeInternal && p.client.internal))
				.map((p) => p.sid)
		).size
	);
	const bounceRate = $derived(sessions.length ? sessions.filter((s) => s.bounced).length / sessions.length : 0);
	const newShare = $derived(
		sessions.length ? sessions.filter((s) => s.landing.client.visitN === 1).length / sessions.length : 0
	);
	const medianEngaged = $derived(quantile(sessions.map((s) => s.engagedMs), 0.5) ?? 0);
	const avgScroll = $derived(pvs.length ? pvs.reduce((s, p) => s + p.maxScroll, 0) / pvs.length : 0);
	const pagesPerSession = $derived(sessions.length ? pvs.length / sessions.length : 0);

	// geo
	const sessionGeo = $derived(sessions.map((s) => ({ s, g: s.landing.geo })));
	const cities = $derived.by(() => {
		const m = new Map<string, { city: string; region: string; cc: string; lat: number; lon: number; n: number }>();
		for (const { g } of sessionGeo) {
			if (g.lat === undefined || g.lon === undefined || !g.city) continue;
			const k = `${g.city}|${g.region ?? ""}|${g.cc ?? ""}`;
			const r = m.get(k);
			if (r) r.n += 1;
			else m.set(k, { city: g.city, region: g.region ?? "", cc: g.cc ?? "", lat: g.lat, lon: g.lon, n: 1 });
		}
		return [...m.values()].sort((a, b) => b.n - a.n);
	});
	const cityRows = $derived<Row[]>(
		cities.map((c) => ({ key: `${c.city}|${c.region}`, label: c.city, extra: c.cc === "CO" ? c.region : `${c.region}, ${c.cc}`, n: c.n }))
	);
	const regionRows = $derived(
		countBy(sessionGeo.filter((x) => x.g.cc === "CO"), (x) => x.g.region)
	);
	const countryRows = $derived(
		countBy(sessionGeo, (x) => (x.g.src === "local" ? "(red local)" : x.g.country || x.g.cc || "(desconocido)"))
	);

	// time
	const daily = $derived.by(() => {
		if (!sessions.length) return [] as { day: string; n: number }[];
		const start = range === "all" ? Math.min(...sessions.map((s) => s.at)) : rangeFrom(range, serverNow);
		const counts = new Map<string, number>();
		for (const s of sessions) counts.set(bogotaDay(s.at), (counts.get(bogotaDay(s.at)) ?? 0) + 1);
		const out: { day: string; n: number }[] = [];
		const seen = new Set<string>();
		for (let t = start; t <= serverNow + DAY; t += 3600_000) {
			const d = bogotaDay(t);
			if (seen.has(d) || t > serverNow) continue;
			seen.add(d);
			out.push({ day: d, n: counts.get(d) ?? 0 });
		}
		return out.slice(-120);
	});
	const dailyMax = $derived(Math.max(1, ...daily.map((d) => d.n)));
	const hourGrid = $derived.by(() => {
		const g = Array.from({ length: 7 }, () => Array(24).fill(0) as number[]);
		for (const s of sessions) g[bogotaWeekday(s.at)][bogotaHour(s.at)] += 1;
		return g;
	});
	const hourMax = $derived(Math.max(1, ...hourGrid.flat()));

	// scroll + sections (sections only exist on the home page)
	const homePvs = $derived(pvs.filter((p) => Object.keys(p.sections).length || p.page.path === "/"));
	const scrollMarks = $derived(
		[25, 50, 75, 90, 100].map((m) => ({
			m,
			share: pvs.length ? pvs.filter((p) => p.maxScroll >= m).length / pvs.length : 0
		}))
	);
	const sectionStats = $derived.by(() => {
		const ids = new Set<string>(SECTIONS.map(([id]) => id));
		for (const p of homePvs) for (const id of Object.keys(p.sections)) ids.add(id);
		return [...ids].map((id) => {
			const reached = homePvs.filter(
				(p) => (p.sections[id] ?? 0) > 0 || p.events.some((e) => e.k === "section" && e.s === id)
			);
			const times = reached.map((p) => p.sections[id] ?? 0);
			return {
				id,
				label: SECTION_LABEL[id] ?? id,
				share: homePvs.length ? reached.length / homePvs.length : 0,
				median: quantile(times, 0.5) ?? 0,
				total: times.reduce((a, b) => a + b, 0)
			};
		});
	});
	const engagedBuckets = $derived.by(() => {
		const edges: [number, string][] = [
			[10_000, "< 10 s"],
			[30_000, "10–30 s"],
			[60_000, "30 s – 1 min"],
			[180_000, "1–3 min"],
			[600_000, "3–10 min"],
			[Infinity, "> 10 min"]
		];
		return edges.map(([max, label], i) => {
			const min = i ? edges[i - 1][0] : -1;
			return { key: label, label, n: sessions.filter((s) => s.engagedMs > min && s.engagedMs <= max).length };
		});
	});

	// clicks
	type Click = Extract<PageView["events"][number], { k: "click" }> & { sid: string };
	type Rage = Extract<PageView["events"][number], { k: "rage" }> & { sid: string };
	const clicks = $derived<Click[]>(
		pvs.flatMap((p) => p.events.filter((e) => e.k === "click").map((e) => ({ ...(e as Click), sid: p.sid })))
	);
	const rages = $derived<Rage[]>(
		pvs.flatMap((p) => p.events.filter((e) => e.k === "rage").map((e) => ({ ...(e as Rage), sid: p.sid })))
	);
	const clickRows = $derived(
		countBy(clicks, (c) => `${c.l}\u0000${c.c ?? ""}\u0000${c.s}`, { sessionOf: (c) => c.sid }).map((r) => {
			const [l, card, s] = r.key.split("\u0000");
			return { ...r, label: l, extra: [card, SECTION_LABEL[s] ?? s].filter(Boolean).join(" · ") };
		})
	);
	const intent = $derived.by(() => {
		const by = (label: string) =>
			countBy(
				clicks.filter((c) => c.l === label),
				(c) => c.c || "(sin tarjeta)",
				{ sessionOf: (c) => c.sid }
			);
		return { buy: by("Comprar"), blocked: by("Comprar (no disponible)"), reveal: by("Revelar precio") };
	});
	const outbound = $derived(
		countBy(
			clicks.filter((c) => c.out),
			(c) => {
				try {
					const u = new URL(c.h ?? "");
					return u.protocol === "mailto:" ? `correo · ${u.pathname}` : `${u.hostname.replace(/^www\./, "")} · ${c.l}`;
				} catch {
					return c.h ?? c.l;
				}
			},
			{ sessionOf: (c) => c.sid }
		)
	);
	const rageRows = $derived(
		countBy(rages, (r) => `${r.l}\u0000${r.s}`, { sessionOf: (r) => r.sid }).map((r) => {
			const [l, s] = r.key.split("\u0000");
			return { ...r, label: l, extra: SECTION_LABEL[s] ?? s };
		})
	);
	const sectionClicks = $derived(
		countBy(clicks, (c) => c.s || "(otro)", { label: (k) => SECTION_LABEL[k] ?? k, sessionOf: (c) => c.sid })
	);

	// acquisition + tech (per session, from the landing page)
	const landings = $derived(sessions.map((s) => s.landing));
	const channels = $derived(countBy(sessions, (s) => channelOf(s)));
	const referrers = $derived(countBy(landings, (p) => referrerOf(p)));
	const campaigns = $derived(
		countBy(landings, (p) =>
			p.page.utm?.campaign ? `${p.page.utm.campaign} (${p.page.utm.source ?? "?"} / ${p.page.utm.medium ?? "?"})` : null
		)
	);
	const inApp = $derived(countBy(landings, (p) => p.client.inApp || "Navegador normal"));
	const devices = $derived(
		countBy(landings, (p) => p.client.device, {
			label: (k) => ({ mobile: "Celular", tablet: "Tablet", desktop: "Computador" })[k] ?? k
		})
	);
	const oses = $derived(countBy(landings, (p) => p.client.os));
	const browsers = $derived(countBy(landings, (p) => p.client.browser));
	const langs = $derived(countBy(landings, (p) => p.client.lang?.split("-")[0]));
	const screens = $derived(countBy(landings, (p) => screenBucket(p.client.vw)));
	const nets = $derived(countBy(landings, (p) => p.client.net || null));
	const pageRows = $derived(countBy(pvs, (p) => p.page.path, { sessionOf: (p) => p.sid }));

	// performance (hard loads only carry vitals)
	const vitals = $derived.by(() => {
		const v = (k: keyof PageView["perf"]) => pvs.map((p) => p.perf[k]).filter((x): x is number => x !== undefined);
		const rate = (val: number | undefined, good: number, poor: number) =>
			val === undefined ? "na" : val <= good ? "good" : val <= poor ? "warn" : "poor";
		const lcp = quantile(v("lcp"), 0.75);
		const cls = quantile(v("cls"), 0.75);
		const inp = quantile(v("inp"), 0.75);
		const ttfb = quantile(v("ttfb"), 0.75);
		const fcp = quantile(v("fcp"), 0.75);
		const load = quantile(v("load"), 0.75);
		return [
			{ k: "LCP", desc: "Carga del contenido principal", val: lcp, fmt: ms(lcp), st: rate(lcp, 2500, 4000), n: v("lcp").length },
			{ k: "INP", desc: "Respuesta a toques y clics", val: inp, fmt: ms(inp), st: rate(inp, 200, 500), n: v("inp").length },
			{ k: "CLS", desc: "Saltos de diseño", val: cls, fmt: cls?.toFixed(3) ?? "—", st: rate(cls, 0.1, 0.25), n: v("cls").length },
			{ k: "FCP", desc: "Primer contenido visible", val: fcp, fmt: ms(fcp), st: rate(fcp, 1800, 3000), n: v("fcp").length },
			{ k: "TTFB", desc: "Respuesta del servidor", val: ttfb, fmt: ms(ttfb), st: rate(ttfb, 800, 1800), n: v("ttfb").length },
			{ k: "Load", desc: "Carga completa", val: load, fmt: ms(load), st: "na", n: v("load").length }
		];
	});
	const errors = $derived(
		countBy(
			pvs.flatMap((p) => p.events.filter((e) => e.k === "error").map((e) => ({ e, sid: p.sid }))),
			(x) => (x.e as { m: string }).m,
			{ sessionOf: (x) => x.sid }
		)
	);
	const geoCoverage = $derived(
		sessions.length ? sessionGeo.filter((x) => x.g.city).length / sessions.length : 0
	);

	// ------------------------------------------------------------ format

	function ms(v: number | undefined): string {
		if (v === undefined) return "—";
		return v >= 1000 ? `${(v / 1000).toFixed(1)} s` : `${Math.round(v)} ms`;
	}
	function dur(v: number): string {
		if (v < 60_000) return `${Math.round(v / 1000)} s`;
		const m = Math.floor(v / 60_000);
		const s = Math.round((v % 60_000) / 1000);
		return `${m} min ${s.toString().padStart(2, "0")} s`;
	}
	const pct = (v: number) => `${Math.round(v * 100)}%`;
	const num = (v: number) => v.toLocaleString("es-CO");
	const dayLabel = (d: string) => {
		const [y, m, dd] = d.split("-").map(Number);
		return new Date(Date.UTC(y, m - 1, dd, 12)).toLocaleDateString("es-CO", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
	};
	const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

	// ------------------------------------------------------------ tooltip

	let tip = $state<{ x: number; y: number; value: string; label: string } | null>(null);
	function showTip(e: PointerEvent | FocusEvent, value: string, label: string) {
		const el = e.currentTarget as HTMLElement;
		const r = el.getBoundingClientRect();
		tip = { x: r.left + r.width / 2, y: r.top, value, label };
	}
	const hideTip = () => (tip = null);

	// ------------------------------------------------------------ export

	function download(name: string, text: string, type: string) {
		const a = document.createElement("a");
		a.href = URL.createObjectURL(new Blob([text], { type }));
		a.download = name;
		a.click();
		setTimeout(() => URL.revokeObjectURL(a.href), 1000);
	}
	function exportCsv() {
		const cols = [
			"fecha_bogota", "hora", "ruta", "sesion", "visitante", "visita_n", "interno", "ciudad", "region", "pais",
			"canal", "utm_campaign", "dispositivo", "so", "navegador", "app", "tiempo_activo_s", "scroll_max", "clics",
			"lcp_ms", "inp_ms", "cls"
		];
		const bySid = new Map(sessions.map((s) => [s.sid, s]));
		const esc = (v: unknown) => {
			const s = String(v ?? "");
			return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
		};
		const rows = pvs.map((p) => {
			const s = bySid.get(p.sid);
			return [
				bogotaDay(p.at), bogotaHour(p.at), p.page.path, p.sid, p.vid, p.client.visitN, p.client.internal ? 1 : 0,
				p.geo.city, p.geo.region, p.geo.country ?? p.geo.cc, s ? channelOf(s) : "", p.page.utm?.campaign,
				p.client.device, p.client.os, p.client.browser, p.client.inApp, Math.round(p.engagedMs / 1000), p.maxScroll,
				p.events.filter((e) => e.k === "click").length, p.perf.lcp, p.perf.inp, p.perf.cls
			].map(esc).join(",");
		});
		download(`calicapital-visitas-${bogotaDay(serverNow)}.csv`, [cols.join(","), ...rows].join("\n"), "text/csv");
	}
	function exportJson() {
		const keep = new Set(pvs.map((p) => p.pvid));
		download(
			`calicapital-raw-${bogotaDay(serverNow)}.json`,
			JSON.stringify(batches.filter((b) => keep.has(b.pvid))),
			"application/json"
		);
	}

	// ------------------------------------------------------------ map

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	type Leaflet = any;
	let mapEl = $state<HTMLDivElement>();
	let L: Leaflet;
	let map: Leaflet;
	let layer: Leaflet;

	function loadScript(src: string): Promise<void> {
		return new Promise((resolve, reject) => {
			const s = document.createElement("script");
			s.src = src;
			s.crossOrigin = "anonymous";
			s.onload = () => resolve();
			s.onerror = () => reject(new Error(`no se pudo cargar ${src}`));
			document.head.appendChild(s);
		});
	}

	async function initMap() {
		if (map || !mapEl) return;
		const css = document.createElement("link");
		css.rel = "stylesheet";
		css.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
		document.head.appendChild(css);
		await loadScript("https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js");
		await loadScript("https://cdnjs.cloudflare.com/ajax/libs/leaflet.heat/0.2.0/leaflet-heat.js");
		L = (window as unknown as { L: Leaflet }).L;
		map = L.map(mapEl, { zoomSnap: 0.5, worldCopyJump: true, scrollWheelZoom: false }).setView([4.3, -74.3], 5.5);
		const esri = "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas";
		const attribution = "Tiles &copy; Esri &mdash; Esri, HERE, Garmin, &copy; OpenStreetMap contributors";
		L.tileLayer(`${esri}/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}`, { attribution, maxZoom: 16 }).addTo(map);
		// place names above the heat layer
		map.createPane("labels");
		map.getPane("labels").style.zIndex = 650;
		map.getPane("labels").style.pointerEvents = "none";
		L.tileLayer(`${esri}/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}`, { pane: "labels", maxZoom: 16 }).addTo(map);
		map.on("focus", () => map.scrollWheelZoom.enable());
		map.on("blur", () => map.scrollWheelZoom.disable());
		drawMap();
	}

	function drawMap() {
		if (!map) return;
		if (layer) map.removeLayer(layer);
		const max = Math.max(1, ...cities.map((c) => c.n));
		if (mapMode === "heat") {
			layer = L.heatLayer(
				cities.map((c) => [c.lat, c.lon, 0.25 + 0.75 * (c.n / max)]),
				{
					radius: 32,
					blur: 24,
					maxZoom: 9,
					minOpacity: 0.35,
					gradient: { 0.2: "#a544ff", 0.45: "#ff46d4", 0.7: "#ff1f5f", 0.9: "#fed000", 1: "#ffffe9" }
				}
			);
			// heat has no hover; invisible markers carry the tooltips
			const group = L.layerGroup([layer]);
			for (const c of cities) {
				L.circleMarker([c.lat, c.lon], { radius: 14, opacity: 0, fillOpacity: 0 })
					.bindTooltip(`<strong>${num(c.n)}</strong> sesiones<br>${esc(c.city)}, ${esc(c.region)}`)
					.addTo(group);
			}
			layer = group;
		} else {
			layer = L.layerGroup(
				cities.map((c) =>
					L.circleMarker([c.lat, c.lon], {
						radius: 5 + 22 * Math.sqrt(c.n / max),
						color: "#000101",
						weight: 2,
						fillColor: "#ff1f5f",
						fillOpacity: 0.75
					}).bindTooltip(`<strong>${num(c.n)}</strong> sesiones<br>${esc(c.city)}, ${esc(c.region)}`)
				)
			);
		}
		layer.addTo(map);
	}

	function esc(s: string) {
		return s.replace(/[&<>"']/g, (ch) => `&#${ch.charCodeAt(0)};`);
	}

	$effect(() => {
		if (mapEl && !needToken) initMap().catch((e) => (error = e.message));
	});
	$effect(() => {
		void cities;
		void mapMode;
		drawMap();
	});
</script>

<svelte:window onscrollcapture={hideTip} />

<svelte:head>
	<title>Estadísticas · Cali Capital Fest</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

{#snippet bars(rows: Row[], opts: { total?: number; limit?: number; unit?: string; showSessions?: boolean } = {})}
	{@const list = rows.slice(0, opts.limit ?? 10)}
	{@const max = Math.max(1, ...list.map((r) => r.n))}
	{@const total = opts.total ?? rows.reduce((s, r) => s + r.n, 0)}
	{#if list.length}
		<ul class="bars">
			{#each list as r (r.key)}
				<li>
					<span class="bars__label" title={r.label}>
						{r.label}
						{#if r.extra}<small>{r.extra}</small>{/if}
					</span>
					<span class="bars__track"><span class="bars__fill" style:width="{(r.n / max) * 100}%"></span></span>
					<span class="bars__val">
						{num(r.n)}
						{#if opts.showSessions && r.sessions !== undefined}
							<small>{num(r.sessions)} ses.</small>
						{:else if total}
							<small>{pct(r.n / total)}</small>
						{/if}
					</span>
				</li>
			{/each}
		</ul>
		{#if rows.length > list.length}<p class="more">+{rows.length - list.length} más</p>{/if}
	{:else}
		<p class="empty">Sin datos en este periodo.</p>
	{/if}
{/snippet}

<main class="stats">
	<header class="top">
		<div>
			<p class="kicker">Cali Capital Fest 2026</p>
			<h1>Estadísticas</h1>
		</div>
		{#if !needToken}
			<p class="live" title="Sesiones con actividad en los últimos 2 minutos">
				<span class="live__dot" class:is-on={live > 0}></span>
				<strong>{num(live)}</strong> en vivo
			</p>
		{/if}
	</header>

	{#if needToken && source === "firestore"}
		<div class="card token">
			<h2>Acceso</h2>
			{#if !authReady}
				<p>Cargando…</p>
			{:else if user}
				<p>Cargando datos de {user.email}…</p>
			{:else}
				<p>Entra con la cuenta de Google autorizada para ver las estadísticas.</p>
				<button type="button" onclick={googleSignIn}>Entrar con Google</button>
			{/if}
			{#if error}<p class="error">{error}</p>{/if}
		</div>
	{:else if needToken}
		<form class="card token" onsubmit={saveToken}>
			<h2>Acceso</h2>
			<p>
				Escribe el token del colector. Está en <code>.analytics-data/.token</code> en perkeo y en el
				log del servidor de desarrollo.
			</p>
			<input type="password" bind:value={tokenInput} placeholder="token" autocomplete="off" />
			<button type="submit">Entrar</button>
		</form>
	{:else}
		<div class="filters">
			<div class="seg" role="group" aria-label="Periodo">
				{#each RANGES as r}
					<button type="button" class:is-on={range === r.id} aria-pressed={range === r.id} onclick={() => {
						range = r.id;
						if (r.id === "all") load();
					}}>
						{r.label}
					</button>
				{/each}
			</div>
			<label class="sel">
				<span>Página</span>
				<select bind:value={pathFilter}>
					<option value="">Todas</option>
					{#each paths as p}<option value={p.key}>{p.key}</option>{/each}
				</select>
			</label>
			<label class="chk"><input type="checkbox" bind:checked={excludeInternal} /> Excluir tráfico interno</label>
			<label class="chk"><input type="checkbox" bind:checked={autoRefresh} /> Actualizar cada 30 s</label>
			<span class="filters__spacer"></span>
			<button type="button" class="ghost" onclick={() => load()} disabled={loading}>{loading ? "Cargando…" : "Actualizar"}</button>
			{#if source === "firestore"}
				<button
					type="button"
					class="ghost"
					title="Vuelve a leer todo desde Firestore en vez de la copia guardada en este navegador"
					onclick={() => load(true)}
					disabled={loading}>Recargar todo</button
				>
				<button type="button" class="ghost" title={user?.email ?? ""} onclick={() => fs?.signOutUser()}>Salir</button>
			{/if}
			<button type="button" class="ghost" onclick={exportCsv} disabled={!pvs.length}>CSV</button>
			<button type="button" class="ghost" onclick={exportJson} disabled={!pvs.length}>JSON</button>
		</div>
		{#if error}<p class="error">{error}</p>{/if}

		<div class="body" class:is-loading={loading && lastLoad > 0}>
			<section class="kpis" aria-label="Resumen">
				<div class="kpi"><span>Visitantes únicos</span><strong>{num(visitors)}</strong></div>
				<div class="kpi"><span>Sesiones</span><strong>{num(sessions.length)}</strong></div>
				<div class="kpi"><span>Páginas vistas</span><strong>{num(pvs.length)}</strong><small>{pagesPerSession.toFixed(2)} por sesión</small></div>
				<div class="kpi"><span>Tiempo activo (mediana)</span><strong>{dur(medianEngaged)}</strong><small>por sesión</small></div>
				<div class="kpi"><span>Scroll promedio</span><strong>{Math.round(avgScroll)}%</strong><small>de la página</small></div>
				<div class="kpi"><span>Rebote</span><strong>{pct(bounceRate)}</strong><small>1 página, &lt; 10 s, sin clics</small></div>
				<div class="kpi"><span>Nuevos</span><strong>{pct(newShare)}</strong><small>{pct(1 - newShare)} regresan</small></div>
				<div class="kpi"><span>Clics</span><strong>{num(clicks.length)}</strong><small>{num(rages.length)} clics de frustración</small></div>
			</section>

			<section class="card span-2">
				<div class="card__head">
					<h2>¿Desde dónde nos visitan?</h2>
					<div class="seg seg--sm" role="group" aria-label="Tipo de mapa">
						<button type="button" class:is-on={mapMode === "heat"} aria-pressed={mapMode === "heat"} onclick={() => (mapMode = "heat")}>Calor</button>
						<button type="button" class:is-on={mapMode === "bubbles"} aria-pressed={mapMode === "bubbles"} onclick={() => (mapMode = "bubbles")}>Burbujas</button>
					</div>
				</div>
				<p class="note">Sesiones por ciudad (ubicación aproximada por IP; {pct(geoCoverage)} de las sesiones con ciudad). Haz clic en el mapa para hacer zoom con la rueda.</p>
				<div class="geo">
					<div class="map" bind:this={mapEl}></div>
					<div class="geo__lists">
						<h3>Ciudades</h3>
						{@render bars(cityRows, { limit: 8 })}
						<h3>Departamentos</h3>
						{@render bars(regionRows, { limit: 6 })}
						<h3>Países</h3>
						{@render bars(countryRows, { limit: 5 })}
					</div>
				</div>
			</section>

			<section class="card span-2">
				<h2>Sesiones por día</h2>
				<p class="note">Hora de Colombia.</p>
				{#if daily.length}
					<div class="cols" role="list">
						{#each daily as d}
							<button
								type="button"
								class="cols__bar"
								role="listitem"
								aria-label="{dayLabel(d.day)}: {d.n} sesiones"
								onpointerenter={(e) => showTip(e, `${num(d.n)} sesiones`, dayLabel(d.day))}
								onpointerleave={hideTip}
								onfocus={(e) => showTip(e, `${num(d.n)} sesiones`, dayLabel(d.day))}
								onblur={hideTip}
							>
								<span style:height="{(d.n / dailyMax) * 100}%"></span>
							</button>
						{/each}
					</div>
					<div class="cols__axis">
						<span>{dayLabel(daily[0].day)}</span>
						<span>máx. {num(dailyMax)}</span>
						<span>{dayLabel(daily[daily.length - 1].day)}</span>
					</div>
				{:else}
					<p class="empty">Sin datos en este periodo.</p>
				{/if}
			</section>

			<section class="card">
				<h2>¿Hasta dónde bajan?</h2>
				<p class="note">Porcentaje de páginas vistas que llegaron a cada profundidad.</p>
				<ul class="funnel">
					{#each scrollMarks as s}
						<li>
							<span class="funnel__label">{s.m}%</span>
							<span class="bars__track"><span class="bars__fill" style:width="{s.share * 100}%"></span></span>
							<span class="bars__val">{pct(s.share)}</span>
						</li>
					{/each}
				</ul>
			</section>

			<section class="card">
				<h2>Secciones vistas</h2>
				<p class="note">Qué parte de las visitas a la portada vio cada sección, y cuánto tiempo (mediana).</p>
				<ul class="funnel">
					{#each sectionStats as s}
						<li>
							<span class="funnel__label">{s.label}</span>
							<span class="bars__track"><span class="bars__fill bars__fill--alt" style:width="{s.share * 100}%"></span></span>
							<span class="bars__val">{pct(s.share)}<small>{dur(s.median)}</small></span>
						</li>
					{/each}
				</ul>
			</section>

			<section class="card">
				<h2>Interés en boletería</h2>
				<p class="note">Clics por tarjeta. "Bloqueado" = intentó comprar cuando el pase aún no estaba a la venta.</p>
				<h3>Comprar</h3>
				{@render bars(intent.buy, { showSessions: true })}
				<h3>Comprar bloqueado</h3>
				{@render bars(intent.blocked, { showSessions: true })}
				<h3>Revelar precio</h3>
				{@render bars(intent.reveal, { showSessions: true })}
			</section>

			<section class="card">
				<h2>Clics por sección</h2>
				{@render bars(sectionClicks, { showSessions: true })}
				<h3>Enlaces externos</h3>
				{@render bars(outbound, { showSessions: true, limit: 8 })}
			</section>

			<section class="card span-2">
				<h2>Botones y enlaces más clicados</h2>
				{@render bars(clickRows, { showSessions: true, limit: 20 })}
			</section>

			<section class="card">
				<h2>Tiempo activo por sesión</h2>
				{@render bars(engagedBuckets, { total: sessions.length })}
			</section>

			<section class="card">
				<h2>Día y hora</h2>
				<p class="note">Sesiones por día de la semana y hora (Colombia).</p>
				<div class="hours">
					{#each hourGrid as row, d}
						<span class="hours__day">{WEEKDAYS[d]}</span>
						{#each row as n, h}
							<button
								type="button"
								class="hours__cell"
								style:--a={n / hourMax}
								aria-label="{WEEKDAYS[d]} {h}:00: {n} sesiones"
								onpointerenter={(e) => showTip(e, `${num(n)} sesiones`, `${WEEKDAYS[d]} ${h}:00–${h}:59`)}
								onpointerleave={hideTip}
								onfocus={(e) => showTip(e, `${num(n)} sesiones`, `${WEEKDAYS[d]} ${h}:00–${h}:59`)}
								onblur={hideTip}
							></button>
						{/each}
					{/each}
					<span></span>
					{#each Array(24) as _, h}<span class="hours__h">{h % 6 === 0 ? h : ""}</span>{/each}
				</div>
			</section>

			<section class="card">
				<h2>Canales</h2>
				<p class="note">De dónde llegó cada sesión (UTM, referente o app).</p>
				{@render bars(channels, { limit: 10 })}
				<h3>Campañas (UTM)</h3>
				{@render bars(campaigns, { limit: 8 })}
			</section>

			<section class="card">
				<h2>Navegador dentro de apps</h2>
				<p class="note">Visitas abiertas desde Instagram, TikTok, WhatsApp…</p>
				{@render bars(inApp)}
				<h3>Referentes</h3>
				{@render bars(referrers, { limit: 8 })}
			</section>

			<section class="card">
				<h2>Dispositivos</h2>
				{@render bars(devices)}
				<h3>Ancho de pantalla</h3>
				{@render bars(screens)}
				<h3>Red</h3>
				{@render bars(nets)}
			</section>

			<section class="card">
				<h2>Sistema y navegador</h2>
				{@render bars(oses, { limit: 6 })}
				<h3>Navegador</h3>
				{@render bars(browsers, { limit: 6 })}
				<h3>Idioma</h3>
				{@render bars(langs, { limit: 6 })}
			</section>

			<section class="card">
				<h2>Páginas</h2>
				{@render bars(pageRows, { showSessions: true })}
				<h3>Clics de frustración</h3>
				<p class="note">3 clics rápidos en el mismo punto: algo no respondió como esperaban.</p>
				{@render bars(rageRows, { showSessions: true })}
			</section>

			<section class="card">
				<h2>Velocidad (p75)</h2>
				<p class="note">Core Web Vitals reales de los visitantes.</p>
				<ul class="vitals">
					{#each vitals as v}
						<li>
							<span class="vitals__k">{v.k}<small>{v.desc}</small></span>
							<strong>{v.fmt}</strong>
							{#if v.st !== "na"}
								<span class="badge badge--{v.st}">
									{v.st === "good" ? "✓ Bien" : v.st === "warn" ? "! Mejorable" : "✕ Lento"}
								</span>
							{:else}<span></span>{/if}
						</li>
					{/each}
				</ul>
				<h3>Errores de JavaScript</h3>
				{@render bars(errors, { showSessions: true, limit: 6 })}
			</section>
		</div>
	{/if}

	{#if tip}
		<div class="tip" style:left="{tip.x}px" style:top="{tip.y}px" role="tooltip">
			<strong>{tip.value}</strong><span>{tip.label}</span>
		</div>
	{/if}
</main>

<style>
	@font-face {
		font-family: "CC Sans";
		src: url("/fonts/dmsans-variable.woff2") format("woff2");
		font-weight: 100 1000;
	}
	@font-face {
		font-family: "CC Display";
		src: url("/fonts/polymath-super.otf") format("opentype");
	}

	.stats {
		--bg: #000101;
		--card: #121212;
		--line: #2a2a28;
		--text: #ffffe9;
		--muted: #b8b8a6;
		--faint: #7c7c70;
		--yellow: #fed000;
		--pink: #ff1f5f;
		--cyan: #00e7ff;
		--lime: #acff00;
		--track: #222220;
		min-height: 100vh;
		background: var(--bg);
		color: var(--text);
		font-family: "CC Sans", system-ui, sans-serif;
		padding: 24px clamp(16px, 3vw, 40px) 64px;
		max-width: 1400px;
		margin: 0 auto;
	}
	:global(body:has(.stats)) {
		background: #000101;
	}

	.top {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: 16px;
		margin-bottom: 20px;
	}
	.kicker {
		color: var(--pink);
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		font-size: 0.8rem;
	}
	h1 {
		font-family: "CC Display", "CC Sans", sans-serif;
		font-size: clamp(2rem, 5vw, 3.2rem);
		line-height: 1;
		color: var(--yellow);
	}
	h2 {
		font-size: 1.05rem;
		font-weight: 700;
		margin-bottom: 12px;
	}
	h2:has(+ .note),
	.card__head h2 {
		margin-bottom: 0;
	}
	h3 {
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--muted);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin: 18px 0 8px;
	}
	.note {
		color: var(--faint);
		font-size: 0.82rem;
		margin: 4px 0 12px;
	}
	.empty,
	.more {
		color: var(--faint);
		font-size: 0.85rem;
	}
	.more {
		margin-top: 4px;
	}

	.live {
		display: flex;
		align-items: center;
		gap: 8px;
		color: var(--muted);
	}
	.live strong {
		color: var(--text);
		font-size: 1.3rem;
	}
	.live__dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: var(--faint);
	}
	.live__dot.is-on {
		background: var(--lime);
		box-shadow: 0 0 0 0 rgb(172 255 0 / 0.6);
		animation: pulse 1.6s infinite;
	}
	@keyframes pulse {
		to {
			box-shadow: 0 0 0 10px rgb(172 255 0 / 0);
		}
	}

	/* filters: one row above everything they scope */
	.filters {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 10px 16px;
		margin-bottom: 20px;
	}
	.filters__spacer {
		flex: 1;
	}
	.seg {
		display: inline-flex;
		border: 1px solid var(--line);
		border-radius: 999px;
		padding: 3px;
		background: var(--card);
	}
	.seg button {
		padding: 6px 14px;
		border-radius: 999px;
		color: var(--muted);
		font-weight: 600;
		font-size: 0.88rem;
	}
	.seg button.is-on {
		background: var(--yellow);
		color: #000101;
	}
	.seg--sm button {
		padding: 4px 10px;
		font-size: 0.8rem;
	}
	.sel {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		color: var(--muted);
		font-size: 0.88rem;
	}
	select,
	input[type="password"] {
		background: var(--card);
		color: var(--text);
		border: 1px solid var(--line);
		border-radius: 8px;
		padding: 6px 10px;
	}
	.chk {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		color: var(--muted);
		font-size: 0.88rem;
	}
	.chk input {
		accent-color: var(--yellow);
	}
	.ghost,
	.token button {
		border: 1px solid var(--line);
		border-radius: 8px;
		padding: 6px 12px;
		color: var(--text);
		font-weight: 600;
		font-size: 0.85rem;
	}
	.ghost:hover:not(:disabled) {
		border-color: var(--yellow);
	}
	.ghost:disabled {
		opacity: 0.5;
	}
	.error {
		color: var(--pink);
		margin-bottom: 16px;
	}

	.body {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 380px), 1fr));
		gap: 16px;
		transition: opacity 0.2s;
	}
	.body.is-loading {
		opacity: 0.6;
	}
	.card {
		background: var(--card);
		border: 1px solid var(--line);
		border-radius: 14px;
		padding: 18px;
		min-width: 0;
	}
	.span-2 {
		grid-column: 1 / -1;
	}
	.card__head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
	}

	.kpis {
		grid-column: 1 / -1;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		gap: 12px;
	}
	.kpi {
		background: var(--card);
		border: 1px solid var(--line);
		border-radius: 14px;
		padding: 14px 16px;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.kpi span {
		color: var(--muted);
		font-size: 0.8rem;
	}
	.kpi strong {
		font-size: 1.7rem;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
	}
	.kpi small {
		color: var(--faint);
		font-size: 0.75rem;
	}

	.geo {
		display: grid;
		grid-template-columns: minmax(0, 1.7fr) minmax(260px, 1fr);
		gap: 20px;
	}
	.map {
		height: 520px;
		border-radius: 10px;
		overflow: hidden;
		background: #111;
		z-index: 0;
	}
	.geo__lists h3:first-child {
		margin-top: 0;
	}
	@media (max-width: 860px) {
		.geo {
			grid-template-columns: 1fr;
		}
		.map {
			height: 380px;
		}
	}

	/* horizontal bar lists: thin bars, value + share in text ink */
	.bars,
	.funnel {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.bars li,
	.funnel li {
		display: grid;
		grid-template-columns: minmax(0, 1.2fr) minmax(60px, 1fr) auto;
		align-items: center;
		gap: 10px;
		font-size: 0.88rem;
	}
	.funnel li {
		grid-template-columns: 9.5rem minmax(60px, 1fr) 4.5rem;
	}
	.bars__label,
	.funnel__label {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.bars__label small {
		color: var(--faint);
		margin-left: 6px;
	}
	.bars__track {
		height: 10px;
		background: var(--track);
		border-radius: 4px;
		overflow: hidden;
	}
	.bars__fill {
		display: block;
		height: 100%;
		background: var(--yellow);
		border-radius: 0 4px 4px 0;
		min-width: 2px;
	}
	.bars__fill--alt {
		background: var(--cyan);
	}
	.bars__val {
		text-align: right;
		font-variant-numeric: tabular-nums;
		font-weight: 600;
		white-space: nowrap;
	}
	.bars__val small {
		color: var(--faint);
		font-weight: 400;
		margin-left: 6px;
	}

	/* daily columns */
	.cols {
		display: flex;
		align-items: flex-end;
		gap: 2px;
		height: 180px;
		border-bottom: 1px solid var(--line);
	}
	.cols__bar {
		flex: 1;
		height: 100%;
		display: flex;
		align-items: flex-end;
		min-width: 3px;
	}
	.cols__bar span {
		display: block;
		width: 100%;
		background: var(--yellow);
		border-radius: 4px 4px 0 0;
		min-height: 1px;
	}
	.cols__bar:hover span,
	.cols__bar:focus-visible span {
		background: #fff3a6;
	}
	.cols__axis {
		display: flex;
		justify-content: space-between;
		color: var(--faint);
		font-size: 0.75rem;
		margin-top: 6px;
	}

	/* weekday × hour grid, one hue light→strong */
	.hours {
		display: grid;
		grid-template-columns: 2.4rem repeat(24, minmax(0, 1fr));
		gap: 2px;
		align-items: center;
	}
	.hours__day,
	.hours__h {
		color: var(--faint);
		font-size: 0.7rem;
	}
	.hours__cell {
		aspect-ratio: 1;
		border-radius: 3px;
		background: color-mix(in oklab, var(--yellow) calc(var(--a) * 100%), var(--track));
	}
	.hours__cell:hover,
	.hours__cell:focus-visible {
		outline: 2px solid var(--text);
		outline-offset: -1px;
	}

	.vitals {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.vitals li {
		display: grid;
		grid-template-columns: 1fr auto 6.5rem;
		align-items: center;
		gap: 10px;
	}
	.vitals__k {
		font-weight: 700;
	}
	.vitals__k small {
		display: block;
		color: var(--faint);
		font-weight: 400;
		font-size: 0.75rem;
	}
	.vitals strong {
		font-variant-numeric: tabular-nums;
	}
	.badge {
		font-size: 0.75rem;
		font-weight: 700;
		padding: 3px 8px;
		border-radius: 999px;
		text-align: center;
		color: #000101;
	}
	.badge--good {
		background: var(--lime);
	}
	.badge--warn {
		background: var(--yellow);
	}
	.badge--poor {
		background: var(--pink);
		color: #ffffe9;
	}

	.token {
		max-width: 420px;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	.token p {
		color: var(--muted);
		font-size: 0.9rem;
	}
	code {
		color: var(--yellow);
	}

	.tip {
		position: fixed;
		z-index: 1000;
		transform: translate(-50%, calc(-100% - 8px));
		background: #ffffe9;
		color: #000101;
		border-radius: 8px;
		padding: 6px 10px;
		pointer-events: none;
		display: flex;
		flex-direction: column;
		font-size: 0.8rem;
		white-space: nowrap;
		box-shadow: 0 4px 16px rgb(0 0 0 / 0.5);
	}
	.tip strong {
		font-size: 0.95rem;
	}

	.stats :global(.leaflet-tooltip) {
		font-family: "CC Sans", system-ui, sans-serif;
	}
</style>
