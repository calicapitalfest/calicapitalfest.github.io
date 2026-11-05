// Confirmed international artists: stickers with the name printed on them
// (static/assets/lineup). Shown on the hero podium.
// `tilt` is each sticker's resting angle, in deg; `size` scales it
// (1 = full stage height).
export const invitados = [
	{ name: "Latrice Kabamba", src: "latrice-kabamba.png", tilt: -2, size: 1 },
	{ name: "Josh Price", src: "josh-price.png", tilt: 2.5, size: 1 },
	{ name: "Clay Boonthanakit", src: "clay-boonthanakit.png", tilt: -3, size: 1 }
];

// Confirmed national artists, in billing order (Erwin, Diego, La Casas, Nai).
// Diego is also a Regional artist; the Regional line-up is not published yet.
export const nacionales = [
	{ name: "Erwin Peinado", src: "erwin-peinado.png", tilt: -2, size: 0.8 },
	{ name: "Diego Casas", src: "diego-casas.png", tilt: 2, size: 0.8 },
	{ name: "La Casas", src: "la-casas.png", tilt: -2.5, size: 0.8 },
	{ name: "Nai Garcia", src: "nai-garcia.png", tilt: 2.5, size: 0.8 }
];
