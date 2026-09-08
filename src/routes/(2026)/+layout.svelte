<script lang="ts">
	import "../../app.css";
	import "$lib/styles/2026.css";
	import Nav from "$lib/components/2026/Nav.svelte";
	import Footer from "$lib/components/2026/Footer.svelte";
	import Aurora from "$lib/components/2026/Aurora.svelte";
	import Preloader from "$lib/components/2026/Preloader.svelte";

	let { children } = $props();
</script>

<div class="site-2026">
	<Aurora />
	<Nav />
	{@render children()}
	<Footer />
</div>

<Preloader />
