<script lang="ts">
	import { base } from "$app/paths";
	import Socials from "./Socials.svelte";
	import { playOverlay } from "./overlay";

	const suns = ["sun-dancing.png", "sun-handstand.png"];
	let sunIndex = $state(0);
</script>

<section id="top" class="hero">
	<img class="hero__deco hero__deco--star" src="{base}/assets/brand/deco-star.png" alt="" />
	<img class="hero__deco hero__deco--squiggle" src="{base}/assets/brand/deco-squiggle.png" alt="" />

	<div class="hero__inner">
		<button class="hero__logo-btn" type="button" aria-label="Reproducir intro" onclick={playOverlay}>
			<img class="hero__logo" src="{base}/assets/brand/logo.png" alt="Cali Capital Fest" />
		</button>

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

		<p class="u-kicker hero__kicker">Festival Internacional de Danza Urbana</p>

		<p class="hero__meta">
			<span>Noviembre 2026</span>
			<span class="hero__dot">•</span>
			<span>Cali, Colombia</span>
		</p>

		<div class="hero__cta">
			<span class="btn btn--primary btn--disabled">Entradas — Próximamente</span>
			<div class="hero__social">
				<span class="u-kicker">Síguenos</span>
				<Socials size={26} />
			</div>
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
		filter: drop-shadow(0 0 40px color-mix(in srgb, var(--c-pink) 45%, transparent));
	}

	.hero__sun {
		height: min(48vw, 220px);
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

	.hero__kicker {
		font-size: clamp(0.62rem, 2.2vw, 0.8rem);
	}

	.hero__meta {
		font-family: var(--font-display);
		font-size: clamp(1.4rem, 5vw, 2.4rem);
		color: var(--c-text);
		display: flex;
		gap: 0.75rem;
		align-items: center;
		text-transform: uppercase;
	}
	.hero__dot {
		color: var(--c-pink);
	}

	.hero__cta {
		display: flex;
		flex-wrap: wrap;
		gap: 1.4rem;
		align-items: center;
		justify-content: center;
		margin-top: 0.5rem;
	}
	.hero__social {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.4rem;
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
	.hero__deco--squiggle {
		bottom: 10%;
		left: 4%;
		width: clamp(80px, 14vw, 170px);
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
		.hero__sun, .hero__sun-img, .hero__deco--star, .hero__scroll { animation: none; }
	}
</style>
