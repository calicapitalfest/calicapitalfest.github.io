import type { IncomingMessage, ServerResponse } from "node:http";

export function createCollector(opts: {
	dataDir: string;
	token?: string;
	allowOrigins?: string[];
	log?: (msg: string) => void;
}): (req: IncomingMessage, res: ServerResponse, next?: () => void) => Promise<void>;
