<script lang="ts">
	import "../app.css";
	import Header from "$lib/components/Header.svelte";

	import { onMount } from "svelte";

	let vantaContainer: HTMLDivElement;

	onMount(() => {
		// @ts-ignore
		const effect = window.VANTA.FOG({
			el: vantaContainer,
			mouseControls: true,
			touchControls: true,
			gyroControls: false,
			minHeight: 200.0,
			minWidth: 200.0,
			highlightColor: 0xF3EEC7,
			midtoneColor: 0xE191A7,
			lowlightColor: 0xC762F3,
			baseColor: 0xFFFFFF,
			blurFactor: 0.5,
			zoom: 1,
		});

		return () => effect?.destroy?.();
	});
</script>

<div bind:this={vantaContainer} class="vanta-bg"></div>

<Header />
<slot />

<style>
	.vanta-bg {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		z-index: -1;
	}
</style>
