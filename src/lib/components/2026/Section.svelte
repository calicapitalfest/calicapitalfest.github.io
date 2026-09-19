<script lang="ts">
	import { base } from "$app/paths";
	import ComingSoon from "./ComingSoon.svelte";

	let {
		id,
		kicker = "",
		title,
		icon = "",
		iconBg = "",
		// The background shape is drawn as a mask, so any of the flat-*.svg
		// files can be tinted to any colour here.
		bgColor = "var(--c-pink)",
		// Placement knobs. Both the icon and its background pivot on the same
		// fixed centre, so rotation never drifts and x/y are offsets from it.
		// x/y are percentages of the element's own size; rotate is degrees.
		iconRotate = 0,
		iconX = 0,
		iconY = 0,
		iconScale = 1,
		bgRotate = 0,
		bgX = 0,
		bgY = 0,
		bgScale = 1,
		children
	}: {
		id: string;
		kicker?: string;
		title: string;
		icon?: string;
		iconBg?: string;
		bgColor?: string;
		iconRotate?: number;
		iconX?: number;
		iconY?: number;
		iconScale?: number;
		bgRotate?: number;
		bgX?: number;
		bgY?: number;
		bgScale?: number;
		children?: import("svelte").Snippet;
	} = $props();
</script>

<section {id} class="sec">
	<div class="sec__head">
		{#if icon}
			<span class="sec__icon-wrap">
				{#if iconBg}
					<span
						class="sec__icon-bg"
						style:--bg-src="url({base}/assets/brand/{iconBg})"
						style:--bg-color={bgColor}
						style:--bg-rotate="{bgRotate}deg"
						style:--bg-x="{bgX}%"
						style:--bg-y="{bgY}%"
						style:--bg-scale={bgScale}
					></span>
				{/if}
				<img
					class="sec__icon"
					src="{base}/assets/brand/{icon}"
					alt=""
					style:--icon-rotate="{iconRotate}deg"
					style:--icon-x="{iconX}%"
					style:--icon-y="{iconY}%"
					style:--icon-scale={iconScale}
				/>
			</span>
		{/if}
		<div>
			{#if kicker}<p class="u-kicker">{kicker}</p>{/if}
			<h2 class="font-display sec__title">{title}</h2>
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

	.sec__head {
		display: flex;
		align-items: center;
		gap: 1.4rem;
		margin-bottom: 2rem;
	}
	.sec__icon-wrap {
		position: relative;
		display: inline-grid;
		place-items: center;
		flex-shrink: 0;
	}
	/* Both layers share the wrapper's centre as their pivot, so rotate/scale
	   stay put and x/y read as offsets from that one fixed point. */
	.sec__icon {
		position: relative;
		z-index: 1;
		height: clamp(72px, 13.5vw, 114px);
		width: auto;
		transform-origin: 50% 50%;
		translate: var(--icon-x, 0%) var(--icon-y, 0%);
		rotate: var(--icon-rotate, 0deg);
		scale: var(--icon-scale, 1);
	}
	.sec__icon-bg {
		position: absolute;
		z-index: 0;
		/* square box + contain, so the varying shape ratios all read the same size */
		width: clamp(52px, 9.33vw, 79px);
		height: clamp(52px, 9.33vw, 79px);
		/* masked rather than drawn, so one file works in any brand colour */
		background-color: var(--bg-color, var(--c-pink));
		-webkit-mask-image: var(--bg-src);
		mask-image: var(--bg-src);
		-webkit-mask-repeat: no-repeat;
		mask-repeat: no-repeat;
		-webkit-mask-position: center;
		mask-position: center;
		-webkit-mask-size: contain;
		mask-size: contain;
		transform-origin: 50% 50%;
		translate: var(--bg-x, 0%) var(--bg-y, 0%);
		rotate: var(--bg-rotate, 0deg);
		scale: var(--bg-scale, 1);
		opacity: 0.85;
		pointer-events: none;
	}
	.sec__title {
		font-size: clamp(2.4rem, 7vw, 4.5rem);
		color: var(--c-text);
	}

	.sec__body {
		color: var(--c-muted);
		font-size: 1.05rem;
		max-width: 60ch;
	}
</style>
