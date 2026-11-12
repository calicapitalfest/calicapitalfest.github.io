<!--
	Sponsor logo strip: shows a few logos side by side and slides one logo
	along every `every` ms, looping without a jump (the list is drawn twice;
	after the last step the strip snaps back to the start unseen). Pauses
	while it's off screen or the tab is hidden.
-->
<script lang="ts">
	import { base } from "$app/paths";

	let { logos, every = 2000 }: { logos: { name: string; src: string }[]; every?: number } = $props();

	let i = $state(0);
	let snap = $state(false); // true for the one frame the strip jumps back
	let box: HTMLDivElement | undefined = $state();

	$effect(() => {
		if (!box) return;
		let inView = false;
		const io = new IntersectionObserver(([e]) => (inView = e.isIntersecting));
		io.observe(box);
		// reduced motion: no slide, so no transitionend to wrap on
		const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const id = setInterval(() => {
			if (!inView || document.hidden) return;
			i = still ? (i + 1) % logos.length : i + 1;
		}, every);
		return () => {
			clearInterval(id);
			io.disconnect();
		};
	});

	// one full lap done: jump back to the first copy without animating
	function onEnd() {
		if (i < logos.length) return;
		snap = true;
		i -= logos.length;
		requestAnimationFrame(() => requestAnimationFrame(() => (snap = false)));
	}
</script>

<div class="logos" bind:this={box}>
	<ul class="logos__track" class:is-snap={snap} style:--i={i} ontransitionend={onEnd}>
		{#each [...logos, ...logos] as l, k}
			<li class="logos__item" aria-hidden={k >= logos.length}>
				<img src="{base}{l.src}" alt={k < logos.length ? l.name : ""} loading="lazy" decoding="async" />
			</li>
		{/each}
	</ul>
</div>

<style>
	.logos {
		--n: 3; /* logos on screen at once */
		container-type: inline-size;
		overflow: hidden;
	}
	@media (min-width: 700px) {
		.logos {
			--n: 4;
		}
	}
	.logos__track {
		display: flex;
		margin: 0;
		padding: 0;
		list-style: none;
		transform: translateX(calc(var(--i) * -100cqi / var(--n)));
		transition: transform 0.6s cubic-bezier(0.65, 0, 0.35, 1);
	}
	.logos__track.is-snap {
		transition: none;
	}
	.logos__item {
		flex: 0 0 calc(100cqi / var(--n));
		display: grid;
		place-items: center;
		height: clamp(90px, 16cqi, 140px);
		padding: 0 clamp(0.75rem, 3cqi, 2rem);
	}
	.logos__item img {
		width: 100%;
		height: 100%;
		min-height: 0;
		object-fit: contain;
	}
	@media (prefers-reduced-motion: reduce) {
		.logos__track {
			transition: none;
		}
	}
</style>
