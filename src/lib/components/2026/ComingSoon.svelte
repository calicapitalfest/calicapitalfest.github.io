<script lang="ts">
	let { label = "Próximamente" }: { label?: string } = $props();
</script>

<span class="soon">{label}</span>

<style>
	.soon {
		display: inline-block;
		padding: 0.4rem 1rem;
		border-radius: 999px;
		font-weight: 600;
		font-size: 0.7rem;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--c-text);
		background: var(--c-pink);
	}
</style>
