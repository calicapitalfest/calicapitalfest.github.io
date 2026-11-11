/**
 * Images the intro overlay waits on before it reveals the page: only what is
 * visible on the first screen (hero logo, deco, line-up stickers). Everything
 * further down (section icons, flashcard decorations) is lazy-loaded by the
 * browser as the visitor scrolls, so the intro doesn't wait for it.
 * Keep this in sync with the art in Hero.svelte and lineup.ts.
 */
export const PRELOAD_ASSETS = [
	"/assets/brand/logo.webp",
	"/assets/brand/deco-star.webp",
	// hero line-up (LineupSphere): the international clump it opens on
	"/assets/lineup/trim/latrice-kabamba.webp",
	"/assets/lineup/trim/josh-price.webp",
	"/assets/lineup/trim/clay-boonthanakit.webp",
	// hero random deco (Hero.svelte picks one)
	"/assets/brand/deco-asterisk.webp",
	"/assets/brand/deco-splat.webp"
];
