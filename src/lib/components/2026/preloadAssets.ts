/**
 * Images the intro overlay waits on before it reveals the page, so nothing
 * visible above the fold (hero art, section icons) pops in after the fade.
 * Keep this in sync with the icon props used in +page.svelte (served from
 * assets/brand/trimmed), the Line Up characters and the art in Hero.svelte.
 */
export const PRELOAD_ASSETS = [
	"/assets/brand/logo.png",
	"/assets/brand/deco-star.png",
	"/assets/podio3.png",
	"/assets/brand/sun-dancing.png",
	"/assets/brand/sun-handstand.png",
	"/assets/brand/sun-pointing.png",
	"/assets/brand/trimmed/icon-mic.png",
	"/assets/brand/trimmed/icon-calendar.png",
	"/assets/brand/trimmed/deco-asterisk.png",
	"/assets/brand/trimmed/icon-notes.png",
	"/assets/brand/trimmed/deco-splat.png",
	"/assets/brand/trimmed/deco-star.png",
	"/assets/brand/trimmed/deco-squiggle.png",
	// hero random deco (Hero.svelte picks one)
	"/assets/brand/deco-asterisk.png",
	"/assets/brand/deco-splat.png",
	// Line Up characters
	"/assets/brand/trimmed/sun-dancing.png",
	"/assets/brand/trimmed/sun-pointing.png",
	"/assets/brand/trimmed/sun-standing.png",
	// flashcard decorations (CardDeco.svelte)
	"/assets/brand/flat-star.svg",
	"/assets/brand/flat-spiral.svg",
	"/assets/brand/flat-zigzag.svg",
	"/assets/brand/flat-squiggle.svg",
	"/assets/brand/flat-asterisk.svg",
	"/assets/brand/flat-flower.svg",
	"/assets/brand/flat-cross.svg",
	"/assets/brand/flat-circle.svg"
];
