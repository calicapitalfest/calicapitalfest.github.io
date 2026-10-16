import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type Plugin } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import { createCollector } from './analytics-server/collector.mjs';

const ANALYTICS_DATA_DIR = process.env.ANALYTICS_DATA_DIR || path.resolve('.analytics-data');

// Mounts the local analytics collector (/api/analytics/*) into the dev and
// preview servers, so calicapitalfest.figarofigaro.org records visits with
// no extra process. The static build for GitHub Pages doesn't include it.
function analytics(): Plugin {
	let handler: ReturnType<typeof createCollector> | undefined;
	const get = () =>
		(handler ??= createCollector({
			dataDir: ANALYTICS_DATA_DIR,
			token: process.env.ANALYTICS_TOKEN,
			allowOrigins: (process.env.ANALYTICS_ALLOW_ORIGINS || '').split(',').filter(Boolean)
		}));
	return {
		name: 'cc-analytics',
		configureServer(server) {
			server.middlewares.use(get());
		},
		configurePreviewServer(server) {
			server.middlewares.use(get());
		}
	};
}

export default defineConfig({
	plugins: [analytics(), sveltekit(), tailwindcss()],
	server: {
		host: true,
		allowedHosts: ['perkeo.local', 'calicapitalfest.figarofigaro.org'],
		watch: { ignored: ['**/.analytics-data/**'] }
	},
	preview: {
		allowedHosts: ['perkeo.local', 'calicapitalfest.figarofigaro.org']
	}
});
