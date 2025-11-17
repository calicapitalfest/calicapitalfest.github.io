<script lang="ts">
	import "../app.css";
	import { onMount } from "svelte";

	let vantaContainer: HTMLDivElement;

	onMount(() => {
		// @ts-ignore
		const effect = window.VANTA.WAVES({
			el: vantaContainer,
			mouseControls: true,
			touchControls: true,
			gyroControls: false,
			minHeight: 200.0,
			minWidth: 200.0,
			scale: 1.0,
			scaleMobile: 1.0,
			color: 0x1e90ff,
			shininess: 1.5,
			waveHeight: 15.00,
		});

		return () => effect?.destroy?.();
	});
</script>

<svelte:head>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.waves.min.js"></script>
</svelte:head>

<div bind:this={vantaContainer} class="vanta-bg"></div>

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
