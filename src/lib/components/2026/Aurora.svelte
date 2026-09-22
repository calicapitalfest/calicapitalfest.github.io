<!--
	Decorative background: three brand-colour blobs whose radius pulses
	between 0 and its max (the old static gradient size). Each blob has its
	own duration and a negative delay, so they never line up.

	This glow is a hero-only flourish — the rest of the page follows the
	brand manual's flat style, so the blobs fade out once the hero's ticket
	button (.hero__cta) scrolls past the top of the viewport, and fade back
	in if the visitor scrolls back up to it.
-->
<script lang="ts">
	import { onMount } from "svelte";

	let faded = $state(false);

	onMount(() => {
		let ticking = false;
		function update() {
			ticking = false;
			const el = document.querySelector(".hero__cta");
			if (!el) return;
			// gone from view once it slides under the fixed nav bar
			const navH = document.querySelector(".nav")?.getBoundingClientRect().height ?? 0;
			faded = el.getBoundingClientRect().bottom < navH;
		}
		function onScroll() {
			if (ticking) return;
			ticking = true;
			requestAnimationFrame(update);
		}
		update();
		// app.css gives html/body height:100% + overflow, which makes <body> the
		// scroller instead of the window — and element scroll events don't
		// bubble. A capturing listener on document sees scrolls from either.
		document.addEventListener("scroll", onScroll, { passive: true, capture: true });
		window.addEventListener("resize", onScroll);
		return () => {
			document.removeEventListener("scroll", onScroll, { capture: true });
			window.removeEventListener("resize", onScroll);
		};
	});
</script>

<div class="aurora" class:is-faded={faded} aria-hidden="true">
	<span class="blob blob--purple"></span>
	<span class="blob blob--pink"></span>
	<span class="blob blob--cyan"></span>
</div>

<style>
	.aurora {
		position: fixed;
		inset: 0;
		z-index: -1;
		overflow: hidden;
		pointer-events: none;
		opacity: 1;
		transition: opacity 0.6s ease;
	}
	.aurora.is-faded {
		opacity: 0;
	}

	.blob {
		position: absolute;
		border-radius: 50%;
		transform: scale(0);
		will-change: transform;
		animation: pulse var(--dur) ease-in-out var(--delay) infinite alternate;
	}

	/* size = 2 x the old radial-gradient radius; left/top mark the old
	   "at <x> <y>" centre, negative margins pull the centre onto it so the
	   scale() pulse grows symmetrically from that point. */
	.blob--purple {
		width: 120vw;
		height: 120vw;
		left: 12%;
		top: -5%;
		margin: -60vw 0 0 -60vw;
		background: radial-gradient(
			circle,
			color-mix(in srgb, var(--c-purple) 55%, transparent) 0%,
			transparent 60%
		);
		--dur: 13s;
		--delay: -2s;
	}

	.blob--pink {
		width: 110vw;
		height: 110vw;
		left: 95%;
		top: 8%;
		margin: -55vw 0 0 -55vw;
		background: radial-gradient(
			circle,
			color-mix(in srgb, var(--c-pink) 45%, transparent) 0%,
			transparent 60%
		);
		--dur: 9s;
		--delay: -6s;
	}

	.blob--cyan {
		width: 140vw;
		height: 140vw;
		left: 50%;
		top: 115%;
		margin: -70vw 0 0 -70vw;
		background: radial-gradient(
			circle,
			color-mix(in srgb, var(--c-cyan) 30%, transparent) 0%,
			transparent 60%
		);
		--dur: 17s;
		--delay: -11s;
	}

	@keyframes pulse {
		from {
			transform: scale(0);
		}
		to {
			transform: scale(1);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.blob {
			animation: none;
			transform: scale(1);
		}
		.aurora {
			transition: none;
		}
	}
</style>
