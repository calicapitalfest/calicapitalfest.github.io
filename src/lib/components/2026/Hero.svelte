<script lang="ts">
	import { base } from "$app/paths";
	import { playOverlay } from "./overlay";
	import { flashBubble } from "./flashBubble.svelte";
	import Countdown from "./Countdown.svelte";

	// opening day, Colombia time; the countdown renders nothing once it's past
	const EVENT_START = "2026-11-17T00:00:00-05:00";

	const suns = ["sun-dancing.png", "sun-handstand.png", "sun-pointing.png"];
	let sunIndex = $state(0);

	// "Click me!" hint: first 5s after load, then for 2s every 10–15s
	const bubble = flashBubble(5000);

	// Two extra spinning decorations, placed at random on each visit: one in
	// the left margin, one in the right (below the fixed top-right star), so
	// they never land on the logo/sun column. Positioned on mount only, so the
	// server render and hydration agree; they fade in once placed.
	type Deco = { src: string; x: number; y: number; dur: number; dir: 1 | -1 };
	let decos = $state<Deco[]>([]);

	$effect(() => {
		const r = (min: number, max: number) => min + Math.random() * (max - min);
		const srcs = ["deco-asterisk.png", "deco-splat.png"].sort(() => Math.random() - 0.5);
		decos = [
			{ src: srcs[0], x: r(2, 14), y: r(12, 78), dur: r(16, 28), dir: Math.random() < 0.5 ? 1 : -1 },
			{ src: srcs[1], x: r(80, 90), y: r(40, 80), dur: r(16, 28), dir: Math.random() < 0.5 ? 1 : -1 }
		];
	});
</script>

<section id="top" class="hero">
	<img class="hero__deco hero__deco--star" src="{base}/assets/brand/deco-star.png" alt="" />
	{#each decos as d}
		<img
			class="hero__deco hero__deco--rand"
			src="{base}/assets/brand/{d.src}"
			alt=""
			style:left="{d.x}%"
			style:top="{d.y}%"
			style:--spin-dur="{d.dur}s"
			style:animation-direction={d.dir === 1 ? "normal" : "reverse"}
		/>
	{/each}

	<div class="hero__inner">
		<button class="hero__logo-btn" type="button" aria-label="Reproducir intro" onclick={playOverlay}>
			<img class="hero__logo" src="{base}/assets/brand/logo.png" alt="Cali Capital Fest" />
		</button>

		<div class="hero__stage">
			<img class="hero__podium" src="{base}/assets/podio3.png" alt="" />
			<button
				class="hero__sun"
				type="button"
				aria-label="Cambiar mascota"
				onclick={() => (sunIndex = (sunIndex + 1) % suns.length)}
			>
				{#key sunIndex}
					<img class="hero__sun-img" src="{base}/assets/brand/{suns[sunIndex]}" alt="" />
				{/key}
			</button>
			<span class="hero__bubble" class:is-on={bubble.on} aria-hidden="true">Click me!</span>
		</div>

		<p class="hero__kicker">Festival Internacional de Danza Urbana</p>

		<p class="hero__meta">
			<span class="hero__meta-row hero__meta-row--split">
				<span class="hero__place">
					<span>Cali Col</span>
					<svg class="hero__flag" viewBox="0 0 6 4" role="img" aria-label="Colombia">
						<rect width="6" height="2" fill="#FCD116" />
						<rect y="2" width="6" height="1" fill="#003893" />
						<rect y="3" width="6" height="1" fill="#CE1126" />
					</svg>
				</span>
				<span class="hero__bar" aria-hidden="true"></span>
				<span class="hero__dates">
					<span>Nov 17</span>
					<span class="hero__dash" aria-hidden="true"></span>
					<span>22</span>
				</span>
			</span>
			<span class="hero__meta-row">2026</span>
		</p>

		<div class="hero__cta">
			<Countdown target={EVENT_START} label="Tiempo para el festival" />
		</div>
	</div>

	<a href="#acerca" class="hero__scroll" aria-label="Bajar">▾</a>
</section>

<style>
	.hero {
		position: relative;
		min-height: calc(100svh - var(--nav-h));
		display: grid;
		place-items: center;
		padding: 2rem 1.25rem 4rem;
		overflow: hidden;
		text-align: center;
	}

	.hero__inner {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.25rem;
		max-width: 900px;
	}

	.hero__logo-btn {
		padding: 0;
		border: 0;
		background: none;
		cursor: pointer;
		display: block;
		line-height: 0;
		transition: transform 0.15s ease;
	}
	.hero__logo-btn:hover {
		transform: scale(1.02);
	}
	.hero__logo-btn:active {
		transform: scale(0.98);
	}
	.hero__logo {
		width: min(82vw, 620px);
		height: auto;
	}

	.hero__stage {
		/* both sizes derive from one base so they can be tuned independently:
		   the sun runs 44% over it, the podium 36.5% */
		--stage-base: min(48vw, 220px);
		--sun-h: calc(var(--stage-base) * 1.44);
		--podium-h: calc(var(--stage-base) * 1.365);
		position: relative;
		/* Fixed box. Left to shrink-wrap, the stage would follow each pose's
		   aspect ratio and drag the podium's size along with it. */
		width: calc(var(--podium-h) * 1.334);
		height: var(--sun-h);
		display: flex;
		justify-content: center;
		/* The podium overhangs the stage box, but its lower ~15% is transparent,
		   so only this much is actually visible pixels. */
		margin-bottom: calc(var(--stage-base) * 0.07);
	}

	.hero__podium {
		position: absolute;
		left: 50%;
		bottom: calc(var(--stage-base) * -0.273);
		translate: -50% 0;
		height: var(--podium-h);
		width: auto;
		/* Tailwind preflight sets img{max-width:100%}; without this the podium
		   gets clamped to the stage width and changes size between poses. */
		max-width: none;
		pointer-events: none;
		z-index: 0;
	}

	.hero__bubble {
		position: absolute;
		left: 50%;
		bottom: calc(100% + 0.35rem);
		translate: -50% 0;
		z-index: 2;
		padding: 0.45rem 0.9rem;
		border-radius: 999px;
		background: var(--c-yellow);
		color: #000101;
		font-family: var(--font-subtitle);
		font-size: clamp(1.02rem, 3vw, 1.22rem);
		letter-spacing: 0.06em;
		white-space: nowrap;
		pointer-events: none;
		opacity: 0;
		transition: opacity 0.25s ease, translate 0.25s ease;
	}
	/* the tail */
	.hero__bubble::after {
		content: "";
		position: absolute;
		top: 100%;
		left: 50%;
		translate: -50% 0;
		border: 7px solid transparent;
		border-top-color: var(--c-yellow);
		border-bottom: 0;
	}
	.hero__bubble.is-on,
	.hero__sun:focus-visible ~ .hero__bubble {
		opacity: 1;
		translate: -50% -4px;
	}

	.hero__sun {
		position: relative;
		z-index: 1;
		height: 100%;
		padding: 0;
		border: 0;
		background: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		animation: bob 4s ease-in-out infinite;
		transition: transform 0.15s ease;
	}
	.hero__sun-img {
		height: 100%;
		width: auto;
		display: block;
		animation: sun-swap 0.5s ease-in-out;
	}
	.hero__sun:hover {
		transform: scale(1.06);
	}
	.hero__sun:active {
		transform: scale(0.95);
	}

	@keyframes sun-swap {
		from { transform: rotate(0deg) scale(0.6); }
		to { transform: rotate(360deg) scale(1); }
	}

	/* styled here rather than via .u-kicker so this DM Sans cut wins
	   without depending on stylesheet order */
	.hero__kicker {
		/* grouped with the date block below it, clear of the podium above */
		margin-top: clamp(1.25rem, 4vw, 2.75rem);
		font-family: var(--font-body);
		font-weight: 600;
		font-size: clamp(0.72rem, 2.4vw, 0.95rem);
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--c-cyan);
	}

	.hero__meta {
		font-family: var(--font-display);
		font-weight: 950;
		font-size: clamp(1.4rem, 5vw, 2.4rem);
		color: var(--c-text);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.08em;
		line-height: 1;
		text-transform: uppercase;
		width: 100%;
		/* sits tight under the kicker, past the column gap */
		margin-top: -0.55rem;
	}
	.hero__place {
		display: inline-flex;
		align-items: center;
		gap: 0.32em;
	}
	.hero__flag {
		height: 0.62em;
		width: auto;
		border-radius: 0.06em;
		flex-shrink: 0;
	}
	.hero__meta-row {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.42em;
	}
	/* equal side columns put the bar dead centre, directly above "2026" */
	.hero__meta-row--split {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		width: 100%;
	}
	.hero__meta-row--split > :first-child {
		justify-self: end;
	}
	.hero__meta-row--split > :last-child {
		justify-self: start;
	}
	.hero__dates {
		display: flex;
		align-items: center;
		gap: 0.42em;
	}
	/* Polymath Demo carries no "|" or "-" glyph, so both marks are drawn */
	.hero__bar {
		width: 0.09em;
		height: 0.8em;
		border-radius: 999px;
		background: var(--c-pink);
	}
	.hero__dash {
		width: 0.42em;
		height: 0.1em;
		border-radius: 999px;
		background: currentColor;
	}

	.hero__cta {
		display: flex;
		flex-wrap: wrap;
		gap: 1.4rem;
		align-items: center;
		justify-content: center;
		margin-top: 0.5rem;
	}
	/* countdown to the festival: brand-pink boxes, Polymath digits */
	.hero__cta :global(.countdown) {
		gap: clamp(0.5rem, 2vw, 0.9rem);
	}
	.hero__cta :global(.countdown__unit) {
		min-width: clamp(3.6rem, 14vw, 5rem);
		padding: 0.6rem 0.5rem 0.5rem;
		border: 0;
		border-radius: 14px;
		background: var(--c-pink);
		color: #ffffff;
	}
	.hero__cta :global(.countdown__n) {
		font-size: clamp(1.6rem, 6vw, 2.4rem);
	}
	.hero__cta :global(.countdown__l) {
		font-weight: 700;
		font-size: 0.72rem;
		opacity: 0.8;
	}
	.hero__deco {
		position: absolute;
		width: clamp(90px, 16vw, 200px);
		opacity: 0.85;
		pointer-events: none;
	}
	.hero__deco--star {
		top: 8%;
		right: 6%;
		animation: spin 22s linear infinite;
	}
	.hero__deco--rand {
		width: clamp(56px, 9vw, 130px);
		translate: -50% -50%;
		animation:
			spin var(--spin-dur, 22s) linear infinite,
			deco-in 0.6s ease-out;
	}
	/* stays under the logo, sun and text */
	.hero__inner {
		position: relative;
		z-index: 1;
	}

	@keyframes deco-in {
		from { opacity: 0; }
	}

	.hero__scroll {
		position: absolute;
		bottom: 1.5rem;
		left: 50%;
		translate: -50% 0;
		font-size: 1.6rem;
		color: var(--c-muted);
		animation: bob 2s ease-in-out infinite;
	}

	@keyframes bob {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-10px); }
	}
	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	@media (prefers-reduced-motion: reduce) {
		.hero__sun, .hero__sun-img, .hero__deco--star, .hero__deco--rand, .hero__scroll { animation: none; }
	}
</style>
