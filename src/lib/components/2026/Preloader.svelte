<!--
	Page-load intro overlay: black screen + the flat (silhouette) logo, pinned to
	the exact on-screen position of the real hero logo, then fades out to reveal
	the page (and the real coloured logo sitting in the same spot).

	- First load of a session: the flat logo slides up from the bottom into place.
	- Later loads: it just sits in place while the black sheet fades.
	- Clicking the hero logo (see Hero.svelte) replays the overlay: fade in, fade out,
	  each time in a different one of the brand manual's flat logo colourways.
-->
<script lang="ts">
	import { base } from "$app/paths";
	import { onMount, tick } from "svelte";
	import { fade } from "svelte/transition";
	import { overlayReplay } from "./overlay";
	import { PRELOAD_ASSETS } from "./preloadAssets";
	import { FLAT_LOGO_CALI, FLAT_LOGO_CAPITAL, FLAT_LOGO_VIEWBOX, LOGO_COMBOS } from "./flatLogo";

	let visible = $state(true);
	let shown = $state(false); // logo opacity gate (set once positioning is known)
	let entering = $state(false); // first-load slide-up
	let pinned = $state(false); // matched to the real hero logo's rect
	let dur = $state(550);
	let progress = $state(0); // 0..1, share of PRELOAD_ASSETS decoded so far
	let showBar = $state(false);

	// Page load: cream silhouette on black, like the original flat logo.
	// Replays swap in a brand colourway (never the same one twice in a row).
	let colors = $state({ bg: "#000", cali: "#ffffe9", capital: "#ffffe9" });
	let lastCombo = -1;
	function nextCombo() {
		let i = Math.floor(Math.random() * (LOGO_COMBOS.length - 1));
		if (i >= lastCombo && lastCombo !== -1) i++;
		lastCombo = i;
		colors = { ...LOGO_COMBOS[i] };
	}

	const REPLAY_HOLD = 1000; // ms the replayed logo stays up before fading

	let logoEl: SVGSVGElement | undefined = $state();

	// Decodes every asset in the list and reports progress as each one settles
	// (load or error — a broken image shouldn't be able to hang the overlay).
	// Capped by a hard timeout in the caller so a slow network can't either.
	function preloadImages(urls: string[], onProgress: (done: number, total: number) => void) {
		const total = urls.length;
		let done = 0;
		if (total === 0) {
			onProgress(0, 0);
			return Promise.resolve();
		}
		onProgress(0, total);
		return Promise.all(
			urls.map(
				(url) =>
					new Promise<void>((resolve) => {
						const img = new Image();
						img.onload = img.onerror = () => {
							done++;
							onProgress(done, total);
							resolve();
						};
						img.src = url;
					})
			)
		);
	}

	function wait(ms: number) {
		return new Promise<void>((resolve) => setTimeout(resolve, ms));
	}

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

		showBar = firstLoad;

		const minHold = firstLoad ? 1150 : reduced ? 250 : 400;
		const maxHold = 4000; // hard cap so a slow/broken asset can't stall the page

		let cancelled = false;
		const assets = PRELOAD_ASSETS.map((p) => `${base}${p}`);
		Promise.race([preloadImages(assets, (done, total) => (progress = total ? done / total : 1)), wait(maxHold)])
			.then(() => wait(minHold))
			.then(() => {
				if (cancelled) return;
				visible = false;
				root.style.overflow = "";
			});

		// Replay when the hero logo is clicked.
		let hideTimer: ReturnType<typeof setTimeout>;
		const unsub = overlayReplay.subscribe((n) => {
			if (n === 0) return;
			clearTimeout(hideTimer);
			nextCombo();
			entering = false;
			shown = true;
			visible = true;
			tick().then(pin);
			// fade in, hold the logo for a full second, then fade out
			hideTimer = setTimeout(() => (visible = false), dur + REPLAY_HOLD);
		});

		return () => {
			cancelled = true;
			clearTimeout(hideTimer);
			unsub();
			root.style.overflow = "";
		};
	});
</script>

{#if visible}
	<div class="preloader" aria-hidden="true" transition:fade={{ duration: dur }}>
		<div class="preloader__sheet" style:background={colors.bg}></div>
		<svg
			bind:this={logoEl}
			class="preloader__logo"
			class:is-shown={shown}
			class:is-entering={entering}
			class:is-pinned={pinned}
			viewBox={FLAT_LOGO_VIEWBOX}
		>
			<!-- evenodd: the counters of "a"/"A" are traced as inner subpaths -->
			<path fill={colors.cali} fill-rule="evenodd" d={FLAT_LOGO_CALI} />
			<path fill={colors.capital} fill-rule="evenodd" d={FLAT_LOGO_CAPITAL} />
		</svg>
		{#if showBar}
			<div class="preloader__bar" class:is-shown={shown}>
				<div class="preloader__bar-fill" style:width="{Math.round(progress * 100)}%"></div>
			</div>
		{/if}
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
		aspect-ratio: 2229 / 1255;
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

	.preloader__bar {
		position: fixed;
		left: 50%;
		bottom: 12vh;
		translate: -50% 0;
		width: min(60vw, 260px);
		height: 4px;
		border-radius: 999px;
		background: rgba(255, 255, 233, 0.15);
		overflow: hidden;
		opacity: 0;
		transition: opacity 0.4s ease;
	}
	.preloader__bar.is-shown {
		opacity: 1;
	}
	.preloader__bar-fill {
		height: 100%;
		border-radius: inherit;
		background: #ff1f5f; /* brand fucsia — flat, matches the manual */
		transition: width 0.25s ease;
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
