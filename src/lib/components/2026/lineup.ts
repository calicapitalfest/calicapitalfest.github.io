// Confirmed international artists: stickers with the name printed on them
// (static/assets/lineup). Shown on the hero podium.
// `tilt` is each sticker's resting angle, in deg; `size` scales it
// (1 = full stage height).
export const invitados = [
	{ name: "Latrice Kabamba", src: "latrice-kabamba.webp", tilt: -2, size: 1 },
	{ name: "Josh Price", src: "josh-price.webp", tilt: 2.5, size: 1 },
	{ name: "Clay Boonthanakit", src: "clay-boonthanakit.webp", tilt: -3, size: 1 }
];

// Confirmed national artists, in billing order (Erwin, Diego, La Casas, Nai).
// Diego is also a Regional artist; the Regional line-up is not published yet.
export const nacionales = [
	{ name: "Erwin Peinado", src: "erwin-peinado.webp", tilt: -2, size: 0.8 },
	{ name: "Diego Casas", src: "diego-casas.webp", tilt: 2, size: 0.8 },
	{ name: "La Casas", src: "la-casas.webp", tilt: -2.5, size: 0.8 },
	{ name: "Nai Garcia", src: "nai-garcia.webp", tilt: 2.5, size: 0.8 }
];
