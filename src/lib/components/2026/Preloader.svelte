<!--
	Page-load intro overlay: a flat-colour screen + the flat (silhouette) logo,
	pinned to the exact on-screen position of the real hero logo, then fades
	out to reveal the page (and the real coloured logo sitting in the same spot).
	Random flat brand figures (assets/brand/flat-*.svg) follow the hero
	line-up's stickers frame by frame, one per sticker.

	- First load of a session: the flat logo slides up from the bottom into place.
	- Later loads: it just sits in place while the black sheet fades.
	- The page load uses one of the brand manual's flat logo colourways at
	  random (picked in app.html before the first paint, as --pre-* variables).
	- Clicking the hero logo (see Hero.svelte) replays the overlay: fade in, fade out,
	  each time in a different colourway.
-->
<script lang="ts">
	import { base } from "$app/paths";
	import { onMount, tick } from "svelte";
	import { fade } from "svelte/transition";
	import { overlayReplay, introDone } from "./overlay";
	import { PRELOAD_ASSETS } from "./preloadAssets";
	import { FLAT_LOGO_CALI, FLAT_LOGO_CAPITAL, FLAT_LOGO_VIEWBOX, LOGO_COMBOS } from "./flatLogo";

	let visible = $state(true);
	let shown = $state(false); // logo opacity gate (set once positioning is known)
	let entering = $state(false); // first-load slide-up
	let pinned = $state(false); // matched to the real hero logo's rect
	let dur = $state(400);
	let progress = $state(0); // 0..1, share of PRELOAD_ASSETS decoded so far
	let showBar = $state(false);

	// Page load: the colourway app.html picked. Replays swap in another one
	// (never the same one twice in a row).
	let colors = $state({
		bg: "var(--pre-bg, #000101)",
		cali: "var(--pre-cali, #ffffe9)",
		capital: "var(--pre-capital, #ffffe9)"
	});
	let lastCombo = -1;
	function nextCombo() {
		let i = Math.floor(Math.random() * (LOGO_COMBOS.length - 1));
		if (i >= lastCombo && lastCombo !== -1) i++;
		lastCombo = i;
		colors = { ...LOGO_COMBOS[i] };
	}

	const REPLAY_HOLD = 1000; // ms the replayed logo stays up before fading

	let logoEl: SVGSVGElement | undefined = $state();

	// Flat brand figures over the hero line-up: one per sphere spot, a random
	// shape, colour and turn, copying the spot's position, size and fade every
	// frame while the overlay is up. The titles are laid out but invisible, so
	// each figure sits exactly where its sticker is.
	const FIGURES = ["asterisk", "circle", "cross", "flower", "spiral", "squiggle", "star", "zigzag"];
	type Fig = { shape: string; color: "cali" | "capital"; turn: number; title: string; sub: string };
	let figs = $state<Fig[]>([]);
	let figBox: HTMLDivElement | undefined = $state();
	const figEls: HTMLElement[] = [];
	const pick = <T,>(a: readonly T[]) => a[Math.floor(Math.random() * a.length)];
	const newFig = (it: HTMLElement): Fig => ({
		shape: pick(FIGURES),
		color: pick(["cali", "capital"] as const),
		turn: Math.round(Math.random() * 360),
		title: it.dataset.title ?? "",
		sub: it.dataset.sub ?? ""
	});
	function follow() {
		const sph = document.querySelector<HTMLElement>(".sphere");
		if (!sph || !figBox) return;
		const r = sph.getBoundingClientRect();
		// the sphere's inline style carries its size variables (--img-h, --title…)
		figBox.style.cssText = `${sph.style.cssText};top:${r.top}px;left:${r.left}px;width:${r.width}px;height:${r.height}px`;
		const items = sph.querySelectorAll<HTMLElement>(".sphere__item");
		if (figs.length !== items.length) figs = Array.from(items, newFig);
		items.forEach((it, i) => {
			const e = figEls[i];
			if (!e) return;
			e.style.transform = it.style.transform;
			e.style.opacity = it.style.opacity;
		});
	}
	// runs from when the overlay shows until it has faded out; new figures each time
	$effect(() => {
		if (!visible) return;
		figs = [];
		let raf = 0;
		const loop = () => {
			follow();
			raf = requestAnimationFrame(loop);
		};
		raf = requestAnimationFrame(loop);
		// keep following through the fade-out, then stop
		return () => setTimeout(() => cancelAnimationFrame(raf), dur + 100);
	});

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

		lastCombo = Number(root.dataset.combo ?? -1);

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

		showBar = true; // every page load; replays have no bar

		// first load: lets the slide-up (0.85s) land; +1s so the figures can be seen
		const minHold = firstLoad ? 1800 : reduced ? 150 : 1250;
		const maxHold = 2000; // hard cap so a slow/broken asset can't stall the page

		let cancelled = false;
		const assets = PRELOAD_ASSETS.map((p) => `${base}${p}`);
		Promise.race([preloadImages(assets, (done, total) => (progress = total ? done / total : 1)), wait(maxHold)])
			.then(() => wait(minHold))
			.then(() => {
				if (cancelled) return;
				visible = false;
				root.style.overflow = "";
				introDone.set(true);
			});

		// Replay when the hero logo is clicked.
		let hideTimer: ReturnType<typeof setTimeout>;
		const unsub = overlayReplay.subscribe((n) => {
			if (n === 0) return;
			clearTimeout(hideTimer);
			showBar = false;
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
		<div class="preloader__figs" bind:this={figBox}>
			{#each figs as f, i (i)}
				<div class="preloader__item" bind:this={figEls[i]}>
					{#if f.title}
						<span class="preloader__title">{f.title}</span>
						<span class="preloader__sub">{f.sub}</span>
					{/if}
					<span
						class="preloader__shape"
						style:background={colors[f.color]}
						style:--mask="url({base}/assets/brand/flat-{f.shape}.svg)"
						style:--turn="{f.turn}deg"
					></span>
				</div>
			{/each}
		</div>
		<svg
			bind:this={logoEl}
			class="preloader__logo"
			class:is-shown={shown}
			class:is-entering={entering}
			class:is-pinned={pinned}
			viewBox={FLAT_LOGO_VIEWBOX}
		>
			<!-- evenodd: the counters of "a"/"A" are traced as inner subpaths -->
			<path style:fill={colors.cali} fill-rule="evenodd" d={FLAT_LOGO_CALI} />
			<path style:fill={colors.capital} fill-rule="evenodd" d={FLAT_LOGO_CAPITAL} />
		</svg>
		{#if showBar}
			<div class="preloader__bar" class:is-shown={shown}>
				<div class="preloader__bar-fill" style:width="{Math.round(progress * 100)}%" style:background={colors.cali}></div>
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

	/* figures: same layout as the LineupSphere items */
	.preloader__figs {
		position: fixed;
		overflow: hidden;
	}
	.preloader__item {
		position: absolute;
		left: 50%;
		top: 50%;
		display: flex;
		flex-direction: column;
		align-items: center;
		opacity: 0;
	}
	/* invisible: they only keep the figure where the sticker is */
	.preloader__title,
	.preloader__sub {
		visibility: hidden;
		white-space: nowrap;
		line-height: 1;
		letter-spacing: 0.02em;
	}
	.preloader__title {
		font-family: var(--font-display);
		font-weight: 950;
		font-size: var(--title);
		text-transform: uppercase;
	}
	.preloader__sub {
		font-family: var(--font-subtitle);
		font-size: var(--sub);
		margin-bottom: var(--gap);
	}
	/* the colour shows through the figure's shape */
	.preloader__shape {
		display: block;
		width: calc(var(--img-h) * 0.9);
		height: calc(var(--img-h) * 0.9);
		rotate: var(--turn, 0deg);
		-webkit-mask: var(--mask) center / contain no-repeat;
		mask: var(--mask) center / contain no-repeat;
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
		/* along the bottom edge of where the header sits */
		left: 0;
		right: 0;
		top: calc(var(--nav-h, 60px) - 4px);
		height: 4px;
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
