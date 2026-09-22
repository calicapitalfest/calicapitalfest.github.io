<!--
	Generic horizontal scroll-snap carousel. Drop cards in as children — each
	direct child becomes one snap-aligned slide. Used for the "momentos" cards,
	the ticket packages, the schedule days, etc. `label` is shown on the same
	row as the arrows, vertically centred with them.
-->
<script lang="ts">
	let { label = "", children }: { label?: string; children?: import("svelte").Snippet } = $props();

	let track: HTMLDivElement | undefined = $state();

	function scrollByCard(dir: 1 | -1) {
		if (!track) return;
		const card = track.querySelector<HTMLElement>(":scope > *");
		const step = card ? card.getBoundingClientRect().width + 16 : track.clientWidth * 0.8;
		track.scrollBy({ left: dir * step, behavior: "smooth" });
	}
</script>

<div class="carousel">
	<div class="carousel__nav">
		{#if label}<p class="u-label carousel__label">{label}</p>{/if}
		<button type="button" class="carousel__btn" aria-label="Anterior" onclick={() => scrollByCard(-1)}>‹</button>
		<button type="button" class="carousel__btn" aria-label="Siguiente" onclick={() => scrollByCard(1)}>›</button>
	</div>
	<div class="carousel__track" bind:this={track}>
		{#if children}
			{@render children()}
		{/if}
	</div>
</div>

<style>
	.carousel {
		position: relative;
	}
	.carousel__track {
		display: flex;
		gap: 1rem;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		padding-bottom: 0.75rem;
		scrollbar-width: none;
	}
	.carousel__track::-webkit-scrollbar {
		display: none;
	}
	.carousel__track > :global(*) {
		scroll-snap-align: start;
		flex: 0 0 auto;
	}
	.carousel__nav {
		display: flex;
		gap: 0.6rem;
		align-items: center;
		justify-content: flex-end;
		margin-bottom: 0.75rem;
	}
	.carousel__label {
		margin-right: auto;
	}
	/* flat solid pill in the section colour; hover/press go one shade darker */
	.carousel__btn {
		width: 2.4rem;
		height: 2.4rem;
		border-radius: 999px;
		border: 0;
		background: var(--accent, var(--c-text));
		color: var(--accent-fg, var(--c-bg));
		font-size: 1.8rem;
		line-height: 1;
		/* the ‹ › glyphs sit high in their box; nudge them onto the centre */
		padding-bottom: 0.12em;
		cursor: pointer;
		transition: transform 0.15s ease, background 0.15s ease;
	}
	.carousel__btn:hover,
	.carousel__btn:active {
		background: color-mix(in srgb, var(--accent, var(--c-text)) 80%, #000);
	}
	.carousel__btn:hover {
		transform: translateY(-1px);
	}
	.carousel__btn:active {
		transform: translateY(1px);
	}
</style>
