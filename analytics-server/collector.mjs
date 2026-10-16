// Local analytics collector: receives the tracker's batches
// (src/lib/analytics/types.ts) and appends them, one JSON line each, to
// <dataDir>/YYYY-MM-DD.jsonl (UTC day of receipt). Mounted into the Vite
// dev/preview server by vite.config.ts, or run on its own with server.mjs.
//
//   POST /api/analytics/collect    one batch (text/plain JSON body)
//   GET  /api/analytics/batches    ?from=&to= (epoch ms), needs the token
//   GET  /api/analytics/health
//
// Geo comes from Cloudflare's visitor-location headers when the tunnel adds
// them, otherwise from a lookup of the visitor's IP (get.geojs.io, cached in
// memory). The IP itself is never stored, only a hash salted per day, which
// is enough to count distinct connections without being reversible later.

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import zlib from "node:zlib";

const PREFIX = "/api/analytics/";
const MAX_BODY = 256 * 1024;
const MAX_EVENTS = 500;
const GEO_TTL_MS = 12 * 3600_000;
const BOT_UA = /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|facebookexternalhit|embedly|monitor|curl|wget|python|go-http/i;

/**
 * @param {{ dataDir: string, token?: string, allowOrigins?: string[], log?: (msg: string) => void }} opts
 */
export function createCollector({ dataDir, token, allowOrigins = [], log = console.log }) {
	fs.mkdirSync(dataDir, { recursive: true });

	// The dashboard token: ANALYTICS_TOKEN, else one generated on first run
	// and kept in <dataDir>/.token.
	const tokenFile = path.join(dataDir, ".token");
	if (!token) {
		try {
			token = fs.readFileSync(tokenFile, "utf8").trim();
		} catch {
			token = crypto.randomBytes(18).toString("base64url");
			fs.writeFileSync(tokenFile, token + "\n", { mode: 0o600 });
		}
	}
	log(`[analytics] storing in ${dataDir}; dashboard token: ${token}`);

	/** @type {Map<string, { at: number, geo: object }>} */
	const geoCache = new Map();
	let writeChain = Promise.resolve();

	const saltFor = (day) =>
		crypto.createHash("sha256").update(`${token}:${day}`).digest("hex").slice(0, 16);

	function clientIp(req) {
		const h = req.headers;
		const ip =
			h["cf-connecting-ip"] ||
			(typeof h["x-forwarded-for"] === "string" ? h["x-forwarded-for"].split(",")[0] : "") ||
			req.socket?.remoteAddress ||
			"";
		return String(ip).trim().replace(/^::ffff:/, "");
	}

	function isPrivate(ip) {
		return (
			!ip ||
			ip === "::1" ||
			/^(127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.)/.test(ip) ||
			/^(fc|fd|fe80)/i.test(ip)
		);
	}

	async function geoFor(req, ip) {
		const h = req.headers;
		const num = (v) => (v === undefined || v === "" || isNaN(Number(v)) ? undefined : Number(v));
		if (h["cf-ipcity"] || h["cf-iplatitude"]) {
			return {
				cc: h["cf-ipcountry"],
				country: h["cf-ipcountry"],
				region: h["cf-region"] ? decodeURIComponent(String(h["cf-region"])) : undefined,
				city: h["cf-ipcity"] ? decodeURIComponent(String(h["cf-ipcity"])) : undefined,
				lat: num(h["cf-iplatitude"]),
				lon: num(h["cf-iplongitude"]),
				src: "cf"
			};
		}
		if (isPrivate(ip)) return { src: "local" };
		const hit = geoCache.get(ip);
		if (hit && Date.now() - hit.at < GEO_TTL_MS) return hit.geo;
		try {
			const r = await fetch(`https://get.geojs.io/v1/ip/geo/${encodeURIComponent(ip)}.json`, {
				signal: AbortSignal.timeout(4000)
			});
			const j = await r.json();
			const geo = {
				cc: j.country_code || h["cf-ipcountry"],
				country: j.country,
				region: j.region,
				city: j.city,
				lat: num(j.latitude),
				lon: num(j.longitude),
				src: "lookup"
			};
			geoCache.set(ip, { at: Date.now(), geo });
			if (geoCache.size > 20_000) geoCache.delete(geoCache.keys().next().value);
			return geo;
		} catch {
			const cc = h["cf-ipcountry"];
			return cc ? { cc, country: cc, src: "cf" } : { src: "none" };
		}
	}

	const str = (v, max) => (typeof v === "string" ? v.slice(0, max) : "");

	function validate(b) {
		if (!b || typeof b !== "object") return "not an object";
		if (b.v !== 1) return "bad version";
		for (const k of ["vid", "sid", "pvid"]) {
			if (typeof b[k] !== "string" || !b[k] || b[k].length > 64) return `bad ${k}`;
		}
		if (!Number.isInteger(b.seq) || b.seq < 0) return "bad seq";
		if (!b.page || typeof b.page.path !== "string") return "bad page";
		if (!b.client || typeof b.client !== "object") return "bad client";
		if (!b.summary || typeof b.summary !== "object") return "bad summary";
		if (!Array.isArray(b.events) || b.events.length > MAX_EVENTS) return "bad events";
		return null;
	}

	function readBody(req) {
		return new Promise((resolve, reject) => {
			let size = 0;
			const chunks = [];
			req.on("data", (c) => {
				size += c.length;
				if (size > MAX_BODY) {
					reject(new Error("too large"));
					req.destroy();
				} else chunks.push(c);
			});
			req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
			req.on("error", reject);
		});
	}

	function dayOf(ms) {
		return new Date(ms).toISOString().slice(0, 10);
	}

	function append(batch) {
		const file = path.join(dataDir, `${dayOf(batch.rt)}.jsonl`);
		const line = JSON.stringify(batch) + "\n";
		writeChain = writeChain
			.then(() => fs.promises.appendFile(file, line))
			.catch((e) => log(`[analytics] write failed: ${e.message}`));
	}

	async function collect(req, res) {
		const origin = req.headers.origin;
		if (origin && allowOrigins.includes(origin)) res.setHeader("Access-Control-Allow-Origin", origin);
		const ua = String(req.headers["user-agent"] ?? "");
		let batch;
		try {
			batch = JSON.parse(await readBody(req));
		} catch {
			res.statusCode = 400;
			return res.end();
		}
		const bad = validate(batch);
		// answer straight away; geo lookup and the write happen after
		res.statusCode = bad ? 400 : 204;
		res.end();
		if (bad || BOT_UA.test(ua)) return;

		const ip = clientIp(req);
		const rt = Date.now();
		batch.rt = rt;
		batch.ih = crypto.createHash("sha256").update(saltFor(dayOf(rt)) + ip).digest("hex").slice(0, 12);
		batch.page.path = str(batch.page.path, 200);
		batch.client.ua = str(batch.client.ua || ua, 300);
		try {
			batch.geo = await geoFor(req, ip);
		} catch {
			batch.geo = { src: "none" };
		}
		append(batch);
	}

	function authorized(req, url) {
		const auth = String(req.headers.authorization ?? "");
		const given = auth.startsWith("Bearer ") ? auth.slice(7) : url.searchParams.get("token") ?? "";
		const a = Buffer.from(given);
		const b = Buffer.from(token);
		return a.length === b.length && crypto.timingSafeEqual(a, b);
	}

	async function batches(req, res, url) {
		if (!authorized(req, url)) {
			res.statusCode = 401;
			return res.end();
		}
		const now = Date.now();
		const from = Number(url.searchParams.get("from")) || 0;
		const to = Number(url.searchParams.get("to")) || now + 60_000;
		const days = (await fs.promises.readdir(dataDir))
			.filter((f) => /^\d{4}-\d{2}-\d{2}\.jsonl$/.test(f))
			.filter((f) => {
				const start = Date.parse(f.slice(0, 10) + "T00:00:00Z");
				return start + 86_400_000 > from && start <= to;
			})
			.sort();
		const out = [];
		for (const f of days) {
			const text = await fs.promises.readFile(path.join(dataDir, f), "utf8");
			for (const line of text.split("\n")) {
				if (!line) continue;
				try {
					const b = JSON.parse(line);
					if (b.rt >= from && b.rt <= to) out.push(b);
				} catch {
					/* a torn line from a crash: skip it */
				}
			}
		}
		const json = JSON.stringify({ now, batches: out });
		res.setHeader("Content-Type", "application/json");
		res.setHeader("Cache-Control", "no-store");
		if (/\bgzip\b/.test(String(req.headers["accept-encoding"] ?? ""))) {
			res.setHeader("Content-Encoding", "gzip");
			res.end(zlib.gzipSync(json));
		} else res.end(json);
	}

	/** Connect-style middleware: handles /api/analytics/*, passes the rest on. */
	return async function handler(req, res, next) {
		if (!req.url?.startsWith(PREFIX)) return next?.();
		const url = new URL(req.url, "http://local");
		const route = url.pathname.slice(PREFIX.length);
		try {
			if (route === "collect" && req.method === "POST") return await collect(req, res);
			if (route === "collect" && req.method === "OPTIONS") {
				const origin = req.headers.origin;
				if (origin && allowOrigins.includes(origin)) {
					res.setHeader("Access-Control-Allow-Origin", origin);
					res.setHeader("Access-Control-Allow-Methods", "POST");
					res.setHeader("Access-Control-Allow-Headers", "Content-Type");
				}
				res.statusCode = 204;
				return res.end();
			}
			if (route === "batches" && req.method === "GET") return await batches(req, res, url);
			if (route === "health") {
				res.setHeader("Content-Type", "application/json");
				return res.end(JSON.stringify({ ok: true }));
			}
			res.statusCode = 404;
			res.end();
		} catch (e) {
			log(`[analytics] ${e.message}`);
			if (!res.headersSent) res.statusCode = 500;
			res.end();
		}
	};
}
