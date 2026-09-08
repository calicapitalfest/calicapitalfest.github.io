<script lang="ts">
	import { base } from "$app/paths";
	import Socials from "./Socials.svelte";

	const links = [
		{ href: "#acerca", label: "Acerca" },
		{ href: "#lineup", label: "Line Up" },
		{ href: "#talleres", label: "Talleres" },
		{ href: "#batallas", label: "Batallas" },
		{ href: "#entradas", label: "Entradas" },
		{ href: "#ubicacion", label: "Ubicación" }
	];

	let open = $state(false);
</script>

<svelte:window onkeydown={(e) => e.key === "Escape" && (open = false)} />

<header class="nav">
	<button
		class="nav__sun"
		aria-label={open ? "Cerrar menú" : "Abrir menú"}
		aria-expanded={open}
		onclick={() => (open = !open)}
	>
		<img src="{base}/assets/brand/sun-face.png" alt="Cali Capital Fest" />
	</button>

	<Socials class="nav__socials" />
</header>

{#if open}
	<button class="nav__scrim" aria-label="Cerrar menú" onclick={() => (open = false)}></button>
	<nav class="nav__menu">
		{#each links as l}
			<a href={l.href} onclick={() => (open = false)}>{l.label}</a>
		{/each}
		<a class="nav__archive" href="{base}/2025" onclick={() => (open = false)}>Edición 2025 →</a>
	</nav>
{/if}

<style>
	.nav {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 60;
		height: var(--nav-h);
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0 clamp(1rem, 4vw, 2.5rem);
		background: color-mix(in srgb, var(--c-bg) 78%, transparent);
		backdrop-filter: blur(12px);
		border-bottom: 1px solid color-mix(in srgb, var(--c-purple) 35%, transparent);
	}

	.nav__sun {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0;
		background: none;
		border: 0;
		cursor: pointer;
	}
	.nav__sun img {
		height: 42px;
		width: auto;
		display: block;
		transition: transform 0.2s ease;
	}
	.nav__sun:hover img {
		transform: rotate(12deg);
	}
	.nav__sun[aria-expanded="true"] img {
		transform: rotate(45deg);
	}

	.nav :global(.nav__socials) {
		color: var(--c-text);
	}

	.nav__scrim {
		position: fixed;
		inset: 0;
		z-index: 55;
		background: color-mix(in srgb, var(--c-bg) 55%, transparent);
		border: 0;
		cursor: default;
	}

	.nav__menu {
		position: fixed;
		top: calc(var(--nav-h) + 8px);
		left: clamp(1rem, 4vw, 2.5rem);
		z-index: 61;
		display: flex;
		flex-direction: column;
		min-width: 220px;
		padding: 0.6rem;
		border-radius: 18px;
		background: var(--c-bg-elev);
		border: 1px solid color-mix(in srgb, var(--c-purple) 45%, transparent);
		box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5),
			0 0 40px color-mix(in srgb, var(--c-purple) 30%, transparent);
		animation: menu-in 0.16s ease-out;
	}

	.nav__menu a {
		padding: 0.7rem 0.9rem;
		border-radius: 12px;
		font-weight: 600;
		font-size: 0.85rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--c-muted);
		transition: background 0.12s ease, color 0.12s ease;
	}
	.nav__menu a:hover {
		background: color-mix(in srgb, var(--c-purple) 22%, transparent);
		color: var(--c-text);
	}
	.nav__menu .nav__archive {
		margin-top: 0.3rem;
		border-top: 1px solid color-mix(in srgb, var(--c-purple) 30%, transparent);
		color: var(--c-cyan);
	}

	@keyframes menu-in {
		from {
			opacity: 0;
			transform: translateY(-8px);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.nav__menu {
			animation: none;
		}
		.nav__sun img,
		.nav__sun:hover img {
			transition: none;
		}
	}
</style>
