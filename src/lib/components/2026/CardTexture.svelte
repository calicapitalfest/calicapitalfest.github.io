<!--
	Brand-manual texture (texture-*.svg, from the manual's pattern pages) laid
	over a flashcard's fill, one shade darker than the card colour.

	The textures are landscape, so on a portrait card (e.g. the cronograma
	days) the texture is turned 90°, which lets it map the same way. It's
	scaled to cover the card on both sides and then 20% more. The outer span
	measures the card, so this follows layout changes (e.g. on mobile).

	Same parent requirements as CardDeco: `position: relative; overflow: hidden;
	isolation: isolate`. Place it before CardDeco so the corner shapes paint on top.
-->
<script lang="ts">
	import { base } from "$app/paths";

	// file + its viewBox size, needed to work out the scale below
	const TEXTURES = [
		{ file: "texture-blobs.svg", w: 502.664, h: 363.92 },
		{ file: "texture-maze.svg", w: 502.668, h: 365.333 }
	];
	const OVERSIZE = 1.2; // texture runs 20% past the card on its tightest side

	let { index = 0 }: { index?: number } = $props();

	let w = $state(0);
	let h = $state(0);
	let tex = $derived(TEXTURES[index % TEXTURES.length]);
	let portrait = $derived(h > w);
	// the texture's own box: the card's size, with the sides swapped when rotated
	let boxW = $derived(portrait ? h : w);
	let boxH = $derived(portrait ? w : h);
	// scale so the texture covers that box both ways, then 20% more
	let size = $derived(Math.ceil(tex.w * OVERSIZE * Math.max(boxW / tex.w, boxH / tex.h)));
</script>

<span class="card-texture" aria-hidden="true" bind:clientWidth={w} bind:clientHeight={h}>
	{#if w > 0}
		<span
			class="card-texture__fill"
			style:width="{boxW}px"
			style:height="{boxH}px"
			style:rotate={portrait ? "90deg" : null}
			style:--src="url({base}/assets/brand/{tex.file})"
			style:--size="{size}px"
		></span>
	{/if}
</span>

<style>
	.card-texture {
		position: absolute;
		inset: 0;
		z-index: -1;
		pointer-events: none;
	}
	.card-texture__fill {
		position: absolute;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
		/* a light step darker than the card fill */
		background: color-mix(in srgb, var(--accent) 90%, #000);
		/* ratio kept, centred, edges bleed off — width set from script */
		-webkit-mask: var(--src) center / var(--size) auto no-repeat;
		mask: var(--src) center / var(--size) auto no-repeat;
	}
</style>
