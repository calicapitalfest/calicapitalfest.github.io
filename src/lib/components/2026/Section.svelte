<script lang="ts">
	import { base } from "$app/paths";
	import ComingSoon from "./ComingSoon.svelte";
	import DisplayText from "./DisplayText.svelte";

	let {
		id,
		kicker = "",
		title,
		icon = "",
		bgColor = "var(--c-pink)",
		// Placement knobs. The icon is absolutely positioned on the centre of a
		// fixed square box (the same box in every section):
		//   iconSize    icon width as a fraction of the box width
		//   iconX/iconY offset of the icon's centre, in % of the box
		//   iconRotate  degrees, around the icon's own centre
		iconSize = 1,
		iconRotate = 0,
		iconX = 0,
		iconY = 0,
		// Exposed as --accent/--accent-fg on the section root, so the kicker,
		// tables, buttons and flashcards inside it (see +page.svelte) all pick
		// up this section's brand colour without repeating it everywhere.
		accentFg = "var(--c-text)",
		children
	}: {
		id: string;
		kicker?: string;
		title: string;
		icon?: string;
		bgColor?: string;
		iconSize?: number;
		iconRotate?: number;
		iconX?: number;
		iconY?: number;
		accentFg?: string;
		children?: import("svelte").Snippet;
	} = $props();
</script>

<section {id} class="sec" style:--accent={bgColor} style:--accent-fg={accentFg}>
	<div class="sec__head">
		{#if icon}
			<span class="sec__icon-wrap">
				<img
					class="sec__icon"
					src="{base}/assets/brand/trimmed/{icon}"
					alt=""
					style:--icon-size={iconSize}
					style:--icon-rotate="{iconRotate}deg"
					style:--icon-x="{iconX}%"
					style:--icon-y="{iconY}%"
				/>
			</span>
		{/if}
		<div>
			{#if kicker}<p class="u-kicker">{kicker}</p>{/if}
			<h2 class="font-display sec__title"><DisplayText text={title} /></h2>
		</div>
	</div>

	<div class="sec__body">
		{#if children}
			{@render children()}
		{:else}
			<ComingSoon />
		{/if}
	</div>
</section>

<style>
	.sec {
		max-width: 1100px;
		margin: 0 auto;
		padding: clamp(3.5rem, 9vw, 7rem) clamp(1.25rem, 5vw, 3rem);
		scroll-margin-top: calc(var(--nav-h) + 12px);
	}

	/* Icon column has a fixed width, so every section's icon shares the same
	   centre line and every title starts at the same x, whatever the icon's
	   shape. The title column is minmax(0, 1fr), so it wraps instead of
	   running under the icon. */
	.sec__head {
		--icon-box: clamp(122px, 22.95vw, 194px); /* 170% of 72px / 13.5vw / 114px */
		--title-size: clamp(2.4rem, 7vw, 4.5rem);
		display: grid;
		grid-template-columns: var(--icon-box) minmax(0, 1fr);
		align-items: center;
		gap: 1.4rem;
		margin-bottom: 2rem;
	}
	.sec__head > :only-child {
		grid-column: 1 / -1;
	}
	.sec__icon-wrap {
		position: relative;
		display: block;
		width: var(--icon-box);
		height: var(--icon-box);
	}
	/* Absolutely positioned on the box centre; its size comes from iconSize
	   rather than the file's proportions, so a tall icon (the mic) no longer
	   fills the whole box height. The files are trimmed to their visible
	   pixels (assets/brand/trimmed), so the centre is the artwork's centre. */
	.sec__icon {
		position: absolute;
		left: calc(50% + var(--icon-x, 0%));
		top: calc(50% + var(--icon-y, 0%));
		z-index: 1;
		width: calc(var(--icon-box) * var(--icon-size, 1));
		height: auto;
		max-width: none;
		translate: -50% -50%;
		rotate: var(--icon-rotate, 0deg);
	}
	/* the kicker ("El Festival", "Artistas"…) sits indented under the title's
	   first letter rather than flush with it */
	/* Sized as a fixed ratio of the title (1.92rem at the 4.5rem desktop
	   title), so zooming the page scales both together. Zooming out widens
	   the viewport, which grows the vw-based title; a fixed rem kicker would
	   shrink against it. The 1.44rem floor only applies on phones (<~770px). */
	.sec__head .u-kicker {
		font-size: max(1.44rem, calc(var(--title-size) * 0.4267));
		padding-left: calc(var(--title-size) * 0.2444);
	}
	.sec__title {
		font-size: var(--title-size);
		color: var(--c-text);
	}

	.sec__body {
		color: var(--c-muted);
		font-size: var(--body-text);
	}
</style>
