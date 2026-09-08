import { writable } from "svelte/store";

/**
 * Bumped every time the intro overlay should replay (e.g. the hero logo is
 * clicked). The Preloader component watches this and fades itself in and out.
 */
export const overlayReplay = writable(0);

export function playOverlay() {
	overlayReplay.update((n) => n + 1);
}
