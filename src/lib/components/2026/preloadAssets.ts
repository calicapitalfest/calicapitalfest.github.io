/**
 * Images the intro overlay waits on before it reveals the page, so nothing
 * visible above the fold (hero art, section icons) pops in after the fade.
 * Keep this in sync with the icon/iconBg props used in +page.svelte and the
 * art referenced by Hero.svelte.
 */
export const PRELOAD_ASSETS = [
	"/assets/brand/logo.png",
	"/assets/brand/deco-star.png",
	"/assets/podio3.png",
	"/assets/brand/sun-dancing.png",
	"/assets/brand/sun-handstand.png",
	"/assets/brand/sun-pointing.png",
	"/assets/brand/icon-mic.png",
	"/assets/brand/flat-flower.svg",
	"/assets/brand/flat-blob-purple.svg",
	"/assets/brand/icon-calendar.png",
	"/assets/brand/flat-circle.svg",
	"/assets/brand/deco-asterisk.png",
	"/assets/brand/flat-blob.svg",
	"/assets/brand/icon-notes.png",
	"/assets/brand/flat-cross.svg",
	"/assets/brand/icon-location.png",
	"/assets/brand/flat-asterisk.svg",
	"/assets/brand/deco-splat.png",
	// flashcard decorations (CardDeco.svelte)
	"/assets/brand/flat-star.svg",
	"/assets/brand/flat-spiral.svg",
	"/assets/brand/flat-zigzag.svg",
	"/assets/brand/flat-squiggle.svg"
];
