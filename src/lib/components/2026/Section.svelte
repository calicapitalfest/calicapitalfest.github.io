<script lang="ts">
	import { base } from "$app/paths";
	import ComingSoon from "./ComingSoon.svelte";

	let {
		id,
		kicker = "",
		title,
		icon = "",
		children
	}: {
		id: string;
		kicker?: string;
		title: string;
		icon?: string;
		children?: import("svelte").Snippet;
	} = $props();
</script>

<section {id} class="sec">
	<div class="sec__head">
		{#if icon}
			<img class="sec__icon" src="{base}/assets/brand/{icon}" alt="" />
		{/if}
		<div>
			{#if kicker}<p class="u-kicker">{kicker}</p>{/if}
			<h2 class="font-display sec__title">{title}</h2>
		</div>
	</div>

	<div class="sec__body">
		{#if children}
			{@render children()}
		{:else}
			<ComingSoon />
		{/if}
	</div>
</section>

<style>
	.sec {
		max-width: 1100px;
		margin: 0 auto;
		padding: clamp(3.5rem, 9vw, 7rem) clamp(1.25rem, 5vw, 3rem);
		scroll-margin-top: calc(var(--nav-h) + 12px);
	}

	.sec__head {
		display: flex;
		align-items: center;
		gap: 1.1rem;
		margin-bottom: 2rem;
	}
	.sec__icon {
		height: clamp(48px, 9vw, 76px);
		width: auto;
		flex-shrink: 0;
	}
	.sec__title {
		font-size: clamp(2.4rem, 7vw, 4.5rem);
		color: var(--c-text);
	}

	.sec__body {
		color: var(--c-muted);
		font-size: 1.05rem;
		max-width: 60ch;
	}
</style>
