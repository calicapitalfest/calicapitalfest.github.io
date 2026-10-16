// Runs the collector on its own, without Vite:
//   node analytics-server/server.mjs
// Env: PORT (5181), ANALYTICS_DATA_DIR (./.analytics-data), ANALYTICS_TOKEN,
//      ANALYTICS_ALLOW_ORIGINS (comma-separated, for cross-origin tracking)

import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createCollector } from "./collector.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const handler = createCollector({
	dataDir: process.env.ANALYTICS_DATA_DIR || path.join(root, ".analytics-data"),
	token: process.env.ANALYTICS_TOKEN,
	allowOrigins: (process.env.ANALYTICS_ALLOW_ORIGINS || "").split(",").filter(Boolean)
});

const port = Number(process.env.PORT) || 5181;
http
	.createServer((req, res) =>
		handler(req, res, () => {
			res.statusCode = 404;
			res.end();
		})
	)
	.listen(port, () => console.log(`[analytics] listening on :${port}`));
