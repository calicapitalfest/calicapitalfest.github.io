// Wire format shared by the tracker (tracker.ts), the collector
// (analytics-server/collector.mjs) and the dashboard (aggregate.ts).
//
// The tracker sends one Batch per flush. A page view is spread over several
// batches (same pvid, increasing seq): each carries the events since the
// previous flush plus a cumulative summary, so a lost final beacon only costs
// the last few seconds.
//
// The local collector stores every batch as a JSON line. On Firebase each
// page view is one Firestore document (id = pvid) that every batch updates:
// the summary is overwritten, events are appended, rt0 is set by the first
// batch and rt by every one (see tracker.ts and firestore.rules).

export const SCHEMA_VERSION = 1;

export interface Utm {
	source?: string;
	medium?: string;
	campaign?: string;
	content?: string;
	term?: string;
}

export interface PageInfo {
	/** pathname, without query or hash */
	path: string;
	title: string;
	/** document.referrer for the first page of a visit, the previous path afterwards */
	ref: string;
	utm: Utm;
	host: string;
	/** client epoch ms when this page view started */
	st: number;
	/** first page view of the session */
	land: boolean;
}

export interface ClientInfo {
	lang: string;
	tz: string;
	/** screen and viewport, CSS px */
	sw: number;
	sh: number;
	vw: number;
	vh: number;
	dpr: number;
	device: "mobile" | "tablet" | "desktop";
	os: string;
	browser: string;
	/** in-app browser (Instagram, Facebook, TikTok, WhatsApp…), "" when none */
	inApp: string;
	touch: boolean;
	/** navigator.connection.effectiveType when available */
	net: string;
	ua: string;
	/** visit number for this browser (1 = first visit) */
	visitN: number;
	/** first time this browser was seen, epoch ms */
	firstSeen: number;
	/** flagged as the team's own traffic (?interno=1) */
	internal: boolean;
}

export interface Perf {
	ttfb?: number;
	fcp?: number;
	lcp?: number;
	cls?: number;
	/** slowest interaction seen (an INP approximation), ms */
	inp?: number;
	load?: number;
}

export interface Summary {
	/** time the tab was visible and the visitor active in the last minute, ms */
	engagedMs: number;
	/** deepest point reached, % of page height (0–100) */
	maxScroll: number;
	/** visible time per section id, ms */
	sections: Record<string, number>;
	perf: Perf;
}

/** t = ms since the page view started; i = index within the page view */
export type TrackEvent = { i?: number } & (
	| {
			k: "click";
			t: number;
			/** label: data-track, aria-label, text or alt */
			l: string;
			/** section id the element sits in */
			s: string;
			/** enclosing card title, if any */
			c?: string;
			/** element tag */
			e: string;
			h?: string;
			/** leaves the site (other host, mailto:, tel:) */
			out?: boolean;
			/** click position, % of page width / height */
			x: number;
			y: number;
	  }
	| { k: "rage"; t: number; l: string; s: string; n: number }
	| { k: "scroll"; t: number; p: number }
	| { k: "section"; t: number; s: string }
	| { k: "error"; t: number; m: string; src?: string }
	| { k: "hidden"; t: number }
	| { k: "visible"; t: number }
);

export interface Geo {
	country?: string;
	cc?: string;
	region?: string;
	city?: string;
	lat?: number;
	lon?: number;
	/** where it came from: cloudflare headers, ip lookup, or a LAN address */
	src: "cf" | "lookup" | "local" | "none";
}

export interface Batch {
	v: number;
	/** visitor (localStorage), session (30 min idle), page view */
	vid: string;
	sid: string;
	pvid: string;
	seq: number;
	/** client send time, epoch ms */
	ts: number;
	page: PageInfo;
	client: ClientInfo;
	summary: Summary;
	events: TrackEvent[];
	/** added by the collector: receive time, geo, salted daily ip hash */
	rt?: number;
	/** Firestore page-view documents: server time of the latest update (rt is the first) */
	rtLast?: number;
	geo?: Geo;
	ih?: string;
}
