<script lang="ts">
	import { base } from "$app/paths";
	import Socials from "./Socials.svelte";
	const year = new Date().getFullYear();
</script>

<footer class="foot">
	<img class="foot__mark" src="{base}/assets/brand/sun-face.png" alt="" />

	<Socials size={24} />

	<div class="foot__links">
		<a href="{base}/2025">Edición 2025</a>
	</div>

	<p class="foot__legal">© {year} Cali Capital Fest · Cali, Colombia</p>
</footer>

<style>
	.foot {
		border-top: 1px solid color-mix(in srgb, var(--c-purple) 35%, transparent);
		padding: 3rem 1.5rem 4rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		text-align: center;
	}
	.foot__mark {
		width: 64px;
		height: auto;
	}
	.foot__links {
		display: flex;
		flex-wrap: wrap;
		gap: 1.5rem;
		justify-content: center;
		font-weight: 600;
		font-size: 0.8rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}
	.foot__links a {
		color: var(--c-cyan);
	}
	.foot__legal {
		color: var(--c-muted);
		font-size: 0.8rem;
	}
</style>
