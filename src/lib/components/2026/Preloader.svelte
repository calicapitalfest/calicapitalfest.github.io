<!--
	Page-load intro overlay: black screen + the flat (silhouette) logo, pinned to
	the exact on-screen position of the real hero logo, then fades out to reveal
	the page (and the real coloured logo sitting in the same spot).

	- First load of a session: the flat logo slides up from the bottom into place.
	- Later loads: it just sits in place while the black sheet fades.
	- Clicking the hero logo (see Hero.svelte) replays the overlay: fade in, fade out.
-->
<script lang="ts">
	import { base } from "$app/paths";
	import { onMount, tick } from "svelte";
	import { fade } from "svelte/transition";
	import { overlayReplay } from "./overlay";

	let visible = $state(true);
	let shown = $state(false); // logo opacity gate (set once positioning is known)
	let entering = $state(false); // first-load slide-up
	let pinned = $state(false); // matched to the real hero logo's rect
	let dur = $state(550);

	let logoEl: HTMLImageElement | undefined = $state();

	function pin() {
		const hero = document.querySelector<HTMLImageElement>(".hero__logo");
		if (!hero || !logoEl) return;
		const r = hero.getBoundingClientRect();
		if (r.width === 0) return;
		logoEl.style.top = `${r.top}px`;
		logoEl.style.left = `${r.left}px`;
		logoEl.style.width = `${r.width}px`;
		pinned = true;
	}

	onMount(() => {
		const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const root = document.documentElement;

		const seen = sessionStorage.getItem("ccf2026-intro");
		sessionStorage.setItem("ccf2026-intro", "1");
		const firstLoad = !seen && !reduced;

		if (reduced) dur = 200;

		pin();
		const hero = document.querySelector<HTMLImageElement>(".hero__logo");
		if (hero && !hero.complete) hero.addEventListener("load", pin, { once: true });

		root.style.overflow = "hidden";

		if (firstLoad) {
			entering = true;
			shown = true;
			// wait for a real paint in the "down" state before releasing
			requestAnimationFrame(() =>
				requestAnimationFrame(() => (entering = false))
			);
		} else {
			shown = true;
		}

		const hold = firstLoad ? 1150 : reduced ? 250 : 400;
		const t = setTimeout(() => {
			visible = false;
			root.style.overflow = "";
		}, hold);

		// Replay when the hero logo is clicked.
		let hideTimer: ReturnType<typeof setTimeout>;
		const unsub = overlayReplay.subscribe((n) => {
			if (n === 0) return;
			clearTimeout(hideTimer);
			entering = false;
			shown = true;
			visible = true;
			tick().then(pin);
			hideTimer = setTimeout(() => (visible = false), 750);
		});

		return () => {
			clearTimeout(t);
			clearTimeout(hideTimer);
			unsub();
			root.style.overflow = "";
		};
	});
</script>

{#if visible}
	<div class="preloader" aria-hidden="true" transition:fade={{ duration: dur }}>
		<div class="preloader__sheet"></div>
		<img
			bind:this={logoEl}
			class="preloader__logo"
			class:is-shown={shown}
			class:is-entering={entering}
			class:is-pinned={pinned}
			src="{base}/assets/brand/flat-logo.png"
			alt=""
		/>
	</div>
{/if}

<style>
	.preloader {
		position: fixed;
		inset: 0;
		z-index: 9999;
		pointer-events: none;
	}
	.preloader__sheet {
		position: absolute;
		inset: 0;
		background: #000;
	}

	.preloader__logo {
		position: fixed;
		/* fallback until JS pins it to the real logo's rect */
		top: 22vh;
		left: 50%;
		width: min(82vw, 620px);
		height: auto;
		transform: translate(-50%, 0);
		opacity: 0;
		transition:
			transform 0.85s cubic-bezier(0.2, 0.7, 0.2, 1),
			opacity 0.55s ease;
	}
	.preloader__logo.is-shown {
		opacity: 1;
	}
	.preloader__logo.is-pinned {
		transform: translate(0, 0);
	}
	.preloader__logo.is-entering {
		transform: translate(-50%, 60vh);
		opacity: 0;
	}
	.preloader__logo.is-pinned.is-entering {
		transform: translate(0, 60vh);
	}

	@media (prefers-reduced-motion: reduce) {
		.preloader__logo {
			transition: opacity 0.2s ease;
		}
		.preloader__logo.is-entering {
			transform: translate(-50%, 0);
		}
		.preloader__logo.is-pinned.is-entering {
			transform: translate(0, 0);
		}
	}
</style>
