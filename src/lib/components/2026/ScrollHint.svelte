<!--
	Scroll invitation, shortly after the intro overlay has faded:

	- at the bottom, two shortcut buttons, PRECIOS and CRONOGRAMA, in their sections'
	  colours. They show whenever the visitor is at the top of the page: they
	  hide on scrolling down and come back on returning to the top;
	- at the very top, just under the header, until the visitor first scrolls
	  (or taps during a bounce): chevrons flowing down around a subtle
	  "Desliza para ver más", while the page bounces every few seconds as if
	  it were about to scroll. A tap
	  during a bounce stops it, so the page never moves under their finger.
-->
<script lang="ts">
	import { onMount } from "svelte";
	import { base } from "$app/paths";
	import { fly, fade } from "svelte/transition";
	import { introDone } from "./overlay";
	import { setSyntheticScroll } from "$lib/analytics/tracker";

	// ---- tuning ------------------------------------------------------------
	/** Strength of the effect: how far (px) the page drops on the first bounce. */
	const AMPLITUDE = 45;
	/** Bounces per round, each one DAMPING times the height of the previous. */
	const BOUNCES = 3;
	const DAMPING = 0.55;
	/** Length of one bounce, down and back up (ms). */
	const BOUNCE_MS = 240;
	/** Seconds after the intro overlay before everything appears. */
	const DELAY_S = 2;
	/** Seconds from the start of one round of bounces to the next; 0 = a single round. */
	const REPEAT_S = 5;
	/** How far (px) the buttons' arrows bob. */
	const ARROW_BOB = 8;
	/** The buttons show while the page is scrolled less than this (px). */
	const TOP_ZONE = 80;
	// ------------------------------------------------------------------------

	// colours match each section's (bgColor / accentFg in +page.svelte)
	const SHORTCUTS = [
		{ label: "Precios", href: `${base}/#paquetes`, bg: "var(--c-lime)", fg: "#000101" },
		{ label: "Cronograma", href: `${base}/#cronograma`, bg: "var(--c-cyan)", fg: "#000101" }
	];

	/** the delay after the intro has passed */
	let started = $state(false);
	let atTop = $state(true);
	/** the visitor has scrolled (or tapped during a bounce): no more bouncing or arrows */
	let settled = $state(false);

	let running = false;
	let cancelAnim: (() => void) | null = null;
	/** bounce scheduling; settle() clears these, but not startTimer */
	let timers: number[] = [];
	let startTimer = 0;

	const buttonsShown = $derived(started && atTop);
	const arrowsShown = $derived(buttonsShown && !settled);

	// The site scrolls <body>, not the window (app.css: html, body { height: 100% }).
	function scroller(): HTMLElement {
		const b = document.body;
		return b.scrollHeight > b.clientHeight + 1 && getComputedStyle(b).overflowY !== "visible"
			? b
			: (document.scrollingElement as HTMLElement);
	}

	const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

	/** One round: BOUNCES quick drops, each smaller than the last, like a ball settling. */
	function bounce(): Promise<void> {
		if (!AMPLITUDE || reduced()) return Promise.resolve();
		const el = scroller();
		const start = el.scrollTop;
		return new Promise((resolve) => {
			const prevBehavior = el.style.scrollBehavior;
			el.style.scrollBehavior = "auto";
			setSyntheticScroll(true);
			running = true;
			let raf = 0;
			const t0 = performance.now();
			const finish = () => {
				cancelAnimationFrame(raf);
				el.style.scrollBehavior = prevBehavior;
				setSyntheticScroll(false);
				running = false;
				cancelAnim = null;
				resolve();
			};
			cancelAnim = finish;
			const frame = (now: number) => {
				const elapsed = now - t0;
				const n = Math.floor(elapsed / BOUNCE_MS);
				if (n >= BOUNCES) {
					el.scrollTop = start;
					return finish();
				}
				const p = (elapsed % BOUNCE_MS) / BOUNCE_MS;
				el.scrollTop = start + AMPLITUDE * DAMPING ** n * Math.sin(Math.PI * p);
				raf = requestAnimationFrame(frame);
			};
			raf = requestAnimationFrame(frame);
		});
	}

	const wait = (ms: number) => new Promise((r) => timers.push(window.setTimeout(r, ms)));

	async function round() {
		if (settled || running) return;
		if (!atTop) return settle();
		const startedAt = performance.now();
		await bounce();
		if (settled || REPEAT_S <= 0) return;
		const next = Math.max(0, REPEAT_S * 1000 - (performance.now() - startedAt));
		timers.push(window.setTimeout(round, next));
	}

	function settle() {
		settled = true;
		timers.forEach(clearTimeout);
		timers = [];
		cancelAnim?.();
	}

	async function start() {
		started = true;
		if (settled) return;
		// let the buttons land before the page moves
		await wait(450);
		round();
	}

	function onScroll() {
		if (running) return; // our own bounce, not the visitor
		atTop = scroller().scrollTop < TOP_ZONE;
		if (!atTop && !settled) settle();
	}

	const SCROLL_KEYS = new Set(["ArrowDown", "ArrowUp", "PageDown", "PageUp", "End", "Home", " "]);

	function onUserInput(e: Event) {
		if (settled) return;
		// taps on the shortcuts are handled by their own click
		if ((e.target as Element | null)?.closest?.(".shint__btns")) return;
		const scrolling =
			e.type === "wheel" || e.type === "touchmove" || (e instanceof KeyboardEvent && SCROLL_KEYS.has(e.key));
		if (scrolling || running) settle();
	}

	onMount(() => {
		const opts = { passive: true, capture: true } as const;
		const events = ["wheel", "touchmove", "touchstart", "pointerdown", "keydown"];
		for (const ev of events) addEventListener(ev, onUserInput, opts);
		// capture on document: scroll events don't bubble, and here it's body that scrolls
		document.addEventListener("scroll", onScroll, opts);
		onScroll();

		let scheduled = false;
		const unsub = introDone.subscribe((done) => {
			if (done && !scheduled) {
				scheduled = true;
				startTimer = window.setTimeout(start, DELAY_S * 1000);
			}
		});
		return () => {
			unsub();
			clearTimeout(startTimer);
			settle();
			for (const ev of events) removeEventListener(ev, onUserInput, opts);
			document.removeEventListener("scroll", onScroll, opts);
		};
	});
</script>

{#snippet chevrons()}
	<span class="shint-more__flow" aria-hidden="true">
		{#each [0, 1, 2] as i}
			<svg viewBox="0 0 24 14" style:--i={i}><path d="M3 3l9 8 9-8" /></svg>
		{/each}
	</span>
{/snippet}

{#if arrowsShown}
	<p class="shint-more" in:fade={{ duration: 450 }} out:fade={{ duration: 400 }}>
		{@render chevrons()}
		<span class="shint-more__text">Desliza para ver más</span>
		{@render chevrons()}
	</p>
{/if}

{#if buttonsShown}
	<div class="shint" style:--arrow="{ARROW_BOB}px" in:fly={{ y: 40, duration: 450 }} out:fade={{ duration: 250 }}>
		<nav class="shint__btns" aria-label="Atajos">
			{#each SHORTCUTS as s}
				<a
					class="shint__btn"
					href={s.href}
					style:--bg={s.bg}
					style:--fg={s.fg}
					data-track="Atajo: {s.label}"
					onclick={settle}
				>
					<span>{s.label}</span>
					<svg class="shint__arrow" viewBox="0 0 24 24" aria-hidden="true">
						<path d="M5 9l7 7 7-7" />
					</svg>
				</a>
			{/each}
		</nav>
	</div>
{/if}

<style>
	.shint {
		position: fixed;
		left: 50%;
		bottom: calc(1.25rem + env(safe-area-inset-bottom, 0px));
		translate: -50% 0;
		z-index: 60;
		max-width: calc(100vw - 32px);
	}

	/* top of the screen, under the header: "Desliza para ver más" between two
	   columns of chevrons flowing down */
	.shint-more {
		position: fixed;
		top: calc(var(--nav-h) + 0.6rem);
		left: 50%;
		translate: -50% 0;
		z-index: 60;
		display: flex;
		align-items: center;
		gap: 0.9rem;
		color: var(--c-text);
		text-shadow: 0 1px 8px rgb(0 0 0 / 0.8);
		pointer-events: none;
	}
	.shint-more__text {
		font-family: var(--font-body);
		font-size: 0.82rem;
		letter-spacing: 0.04em;
		opacity: 0.75;
		white-space: nowrap;
	}
	.shint-more__flow {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1px;
		filter: drop-shadow(0 1px 4px rgb(0 0 0 / 0.7));
	}
	.shint-more__flow svg {
		width: 16px;
		height: 9px;
		fill: none;
		stroke: var(--c-text);
		stroke-width: 3;
		stroke-linecap: round;
		stroke-linejoin: round;
		opacity: 0;
		animation: shint-flow 1.5s ease-in-out infinite;
		animation-delay: calc(var(--i) * 0.2s);
	}
	/* each tip lights up in turn and drifts down: a cascade from top to bottom */
	@keyframes shint-flow {
		0% {
			opacity: 0;
			transform: translateY(-4px);
		}
		35% {
			opacity: 0.9;
		}
		70%,
		100% {
			opacity: 0;
			transform: translateY(4px);
		}
	}

	.shint__btns {
		display: flex;
		gap: 0.6rem;
	}
	.shint__btn {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.65rem 0.8rem 0.65rem 1.1rem;
		border-radius: 999px;
		background: var(--bg);
		color: var(--fg);
		font-family: var(--font-display);
		font-weight: 900;
		font-size: clamp(0.9rem, 3.8vw, 1.15rem);
		letter-spacing: 0.02em;
		text-transform: uppercase;
		white-space: nowrap;
		box-shadow: 0 8px 28px rgb(0 0 0 / 0.45);
		transition: scale 0.15s ease;
	}
	.shint__btn:hover,
	.shint__btn:focus-visible {
		scale: 1.05;
	}
	.shint__btn:active {
		scale: 0.97;
	}
	.shint__arrow {
		width: 1.4em;
		height: 1.4em;
		fill: none;
		stroke: currentColor;
		stroke-width: 3;
		stroke-linecap: round;
		stroke-linejoin: round;
		animation: shint-bob 1.1s ease-in-out infinite;
	}
	@keyframes shint-bob {
		0%,
		100% {
			transform: translateY(calc(var(--arrow) * -0.4));
		}
		50% {
			transform: translateY(calc(var(--arrow) * 0.6));
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.shint__arrow {
			animation: none;
		}
		.shint-more__flow svg {
			animation: none;
			opacity: 0.7;
		}
	}
</style>
