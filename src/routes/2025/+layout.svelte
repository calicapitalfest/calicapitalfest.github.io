<script lang="ts">
	import "../../app.css";
	import Header from "$lib/components/Header.svelte";
	import { base } from "$app/paths";

	import { onMount } from "svelte";

	let vantaContainer: HTMLDivElement;

	// Vanta (three.js + the FOG effect) is only needed by this 2025 page, so it is
	// loaded here instead of in app.html, where it blocked every page's first paint.
	function loadScript(src: string) {
		return new Promise<void>((resolve, reject) => {
			const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
			if (existing) {
				if (existing.dataset.loaded) return resolve();
				existing.addEventListener("load", () => resolve(), { once: true });
				existing.addEventListener("error", () => reject(), { once: true });
				return;
			}
			const el = document.createElement("script");
			el.src = src;
			el.onload = () => {
				el.dataset.loaded = "1";
				resolve();
			};
			el.onerror = () => reject();
			document.head.appendChild(el);
		});
	}

	onMount(() => {
		let effect: { destroy?: () => void } | undefined;
		let cancelled = false;

		loadScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js")
			.then(() => loadScript("https://cdn.jsdelivr.net/npm/vanta@0.5.24/dist/vanta.fog.min.js"))
			.then(() => {
				// @ts-ignore
				if (cancelled || !window.VANTA?.FOG) return;
				// @ts-ignore
				effect = window.VANTA.FOG({
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
			})
			.catch(() => {});

		return () => {
			cancelled = true;
			effect?.destroy?.();
		};
	});
</script>

<svelte:head>
	<!-- Keep the 2025 edition's own "Cali" tab icon (site default is the 2026 sun) -->
	<link rel="icon" type="image/svg+xml" href="{base}/assets/favicon.svg" />
</svelte:head>

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
