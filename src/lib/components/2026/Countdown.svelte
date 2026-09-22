<!-- Ticking countdown to an ISO date, e.g. for a limited-time ticket promo. -->
<script lang="ts">
	let { target }: { target: string } = $props();

	let now = $state(Date.now());

	$effect(() => {
		const id = setInterval(() => (now = Date.now()), 1000);
		return () => clearInterval(id);
	});

	let remaining = $derived(Math.max(0, new Date(target).getTime() - now));
	let expired = $derived(remaining <= 0);
	let days = $derived(Math.floor(remaining / 86_400_000));
	let hours = $derived(Math.floor((remaining % 86_400_000) / 3_600_000));
	let mins = $derived(Math.floor((remaining % 3_600_000) / 60_000));
	let secs = $derived(Math.floor((remaining % 60_000) / 1000));
</script>

{#if !expired}
	<div class="countdown" role="timer" aria-label="Tiempo restante de la promoción">
		<div class="countdown__unit">
			<span class="countdown__n">{days}</span>
			<span class="countdown__l">d</span>
		</div>
		<div class="countdown__unit">
			<span class="countdown__n">{String(hours).padStart(2, "0")}</span>
			<span class="countdown__l">h</span>
		</div>
		<div class="countdown__unit">
			<span class="countdown__n">{String(mins).padStart(2, "0")}</span>
			<span class="countdown__l">m</span>
		</div>
		<div class="countdown__unit">
			<span class="countdown__n">{String(secs).padStart(2, "0")}</span>
			<span class="countdown__l">s</span>
		</div>
	</div>
{/if}

<style>
	.countdown {
		display: flex;
		gap: 0.5rem;
	}
	.countdown__unit {
		display: flex;
		flex-direction: column;
		align-items: center;
		min-width: 2.4rem;
		padding: 0.35rem 0.4rem;
		border-radius: 10px;
		border: 1px solid currentColor;
	}
	.countdown__n {
		font-family: var(--font-display);
		font-weight: 950;
		font-size: 1.1rem;
		line-height: 1;
	}
	.countdown__l {
		font-size: 0.6rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		opacity: 0.7;
		margin-top: 0.15rem;
	}
</style>
