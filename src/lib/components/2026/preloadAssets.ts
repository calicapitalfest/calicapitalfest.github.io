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
	// hero line-up stickers (lineup.ts): the international artists, and the first national one
	"/assets/lineup/latrice-kabamba.webp",
	"/assets/lineup/josh-price.webp",
	"/assets/lineup/clay-boonthanakit.webp",
	"/assets/lineup/erwin-peinado.webp",
	// hero random deco (Hero.svelte picks one)
	"/assets/brand/deco-asterisk.webp",
	"/assets/brand/deco-splat.webp"
];
