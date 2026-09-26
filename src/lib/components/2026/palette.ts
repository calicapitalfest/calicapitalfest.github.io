/**
 * Brand manual colours (principales + secundarios), each paired with the
 * text colour that reads on it. Flashcards take their fill from here.
 */
export const BRAND = {
	pink: { bg: "#ff1f5f", fg: "#000101" },
	yellow: { bg: "#fed000", fg: "#000101" },
	cyan: { bg: "#00e7ff", fg: "#000101" },
	purple: { bg: "#a544ff", fg: "#ffffe9" },
	magenta: { bg: "#ff46d4", fg: "#000101" },
	lime: { bg: "#acff00", fg: "#000101" }
} as const;

export type BrandColor = keyof typeof BRAND;

/** Card i of a section cycles through that section's colour list. */
export function pick(colors: BrandColor[], i: number) {
	return BRAND[colors[i % colors.length]];
}

/** Small deterministic PRNG, so "random" decoration is identical on the
 *  server render and on hydration (no layout jump, no mismatch). */
export function seeded(seed: string) {
	let h = 2166136261;
	for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
	return () => {
		h += 0x6d2b79f5;
		let t = h;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}
