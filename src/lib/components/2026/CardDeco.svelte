<!--
	Flat brand shapes scattered on a flashcard's corners. The parent card must
	be `position: relative; overflow: hidden; isolation: isolate` — the shapes
	sit at z-index -1, above the card's fill but under its text.

	Placement is seeded from `seed`, so each card gets its own layout and it
	stays the same between the server render and the browser.
-->
<script lang="ts">
	import { base } from "$app/paths";
	import { BRAND, seeded } from "./palette";

	type Corner = "tr" | "bl" | "br";

	let {
		seed,
		bg,
		// which corners may get a shape (top-left always stays free for the title)
		corners = ["tr", "bl", "br"],
		// shape size range in px
		min = 58,
		max = 100
	}: { seed: string; bg: string; corners?: Corner[]; min?: number; max?: number } = $props();

	const SHAPES = [
		"flat-star.svg",
		"flat-asterisk.svg",
		"flat-flower.svg",
		"flat-spiral.svg",
		"flat-zigzag.svg",
		"flat-squiggle.svg",
		"flat-cross.svg",
		"flat-circle.svg"
	];

	let items = $derived.by(() => {
		const rnd = seeded(seed);
		const colors = Object.values(BRAND)
			.map((c) => c.bg)
			.filter((c) => c !== bg);
		const picked = [...corners].sort(() => rnd() - 0.5).slice(0, 2);
		return picked.map((corner) => {
			const size = min + Math.round(rnd() * (max - min));
			// centre lands just outside the card edge, so each shape reads as
			// peeking in rather than covering the text
			const inset = -size * (0.25 + rnd() * 0.25);
			return {
				shape: SHAPES[Math.floor(rnd() * SHAPES.length)],
				color: colors[Math.floor(rnd() * colors.length)],
				size,
				rotate: Math.round(rnd() * 360),
				x: corner.endsWith("l") ? { left: inset } : { right: inset },
				y: corner.startsWith("t") ? { top: inset } : { bottom: inset }
			};
		});
	});
</script>

{#each items as it}
	<span
		class="card-deco"
		aria-hidden="true"
		style:--src="url({base}/assets/brand/{it.shape})"
		style:background-color={it.color}
		style:width="{it.size}px"
		style:height="{it.size}px"
		style:rotate="{it.rotate}deg"
		style:left={"left" in it.x ? `${it.x.left}px` : null}
		style:right={"right" in it.x ? `${it.x.right}px` : null}
		style:top={"top" in it.y ? `${it.y.top}px` : null}
		style:bottom={"bottom" in it.y ? `${it.y.bottom}px` : null}
	></span>
{/each}

<style>
	.card-deco {
		position: absolute;
		z-index: -1;
		pointer-events: none;
		-webkit-mask: var(--src) center / contain no-repeat;
		mask: var(--src) center / contain no-repeat;
	}
</style>
