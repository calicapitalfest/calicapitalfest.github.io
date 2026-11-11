// `size` is set per image so every sticker's artwork (not its transparent
// canvas) comes out the same height.
// Confirmed international artists: stickers with the name printed on them
// (static/assets/lineup). Shown on the hero podium.
// `tilt` is each sticker's resting angle, in deg; `size` scales it
// (1 = full stage height).
export const invitados = [
	{ name: "Latrice Kabamba", src: "latrice-kabamba.webp", tilt: -2, size: 1.04 },
	{ name: "Josh Price", src: "josh-price.webp", tilt: 2.5, size: 1.14 },
	{ name: "Clay Boonthanakit", src: "clay-boonthanakit.webp", tilt: -3, size: 1.03 }
];

// Regional duos, in billing order (Esteban, Killah, Andrea, Tían, Alex).
export const regionales = [
	{ name: "Esteban R & Gekko", src: "esteban-gekko.webp", tilt: -2, size: 1.18 },
	{ name: "Valen Killa & Valoyes", src: "valen-killa-valoyes.webp", tilt: 2, size: 1.11 },
	{ name: "Andrea Acevedo & Andhiyes", src: "andrea-andhiyes.webp", tilt: -2.5, size: 1.21 },
	{ name: "Tian Viveros & JuanKa", src: "tian-juanka.webp", tilt: 2.5, size: 1.18 },
	{ name: "Luppy & AlexX", src: "luppy-alexx.webp", tilt: -2, size: 1.14 }
];

// Confirmed national artists, in billing order (Erwin, Diego, La Casas, Nai).
export const nacionales = [
	{ name: "Erwin Peinado", src: "erwin-peinado.webp", tilt: -2, size: 0.95 },
	{ name: "Diego Casas", src: "diego-casas.webp", tilt: 2, size: 0.95 },
	{ name: "La Casas", src: "la-casas.webp", tilt: -2.5, size: 0.92 },
	{ name: "Nai Garcia", src: "nai-garcia.webp", tilt: 2.5, size: 0.95 }
];

// Second row of the hero: staff of the competitions. Each group is one stage;
// groups with more than one person take turns like the line-up stickers.
export const staff = [
	{
		title: "Juez",
		sub: "League of Giants",
		list: [{ name: "Arnold Taborda", src: "arnold-taborda.webp", tilt: -2, size: 0.96 }]
	},
	{
		title: "Juez",
		sub: "Battle of Giants",
		list: [
			{ name: "Geiker", src: "geiker.webp", tilt: 2, size: 0.94 },
			{ name: "Blady", src: "blady.webp", tilt: -2, size: 0.97 },
			{ name: "Sad69", src: "sad69.webp", tilt: 2.5, size: 0.97 }
		]
	},
	{
		title: "DJ",
		sub: "Battle of Giants",
		list: [
			{ name: "Boneless", src: "boneless.webp", tilt: -2.5, size: 0.98 },
			{ name: "DFOUR", src: "dfour.webp", tilt: 2, size: 0.95 },
			{ name: "BRAHH", src: "brahh.webp", tilt: -2, size: 0.98 }
		]
	},
	{
		title: "Hosts",
		sub: "Battle of Giants",
		list: [{ name: "Kid Lord & Scarly", src: "kid-lord-scarly.webp", tilt: 2, size: 1.0 }]
	}
];
