<script lang="ts">
	// Test page for the home page line-up (LineupSphere): sliders tune it live.
	// Not linked from the site.
	import LineupSphere, { SPHERE_DEFAULTS as D } from "$lib/components/2026/LineupSphere.svelte";

	let imgT = $state(D.imgT);
	let textT = $state(D.textT);
	let speedT = $state(D.speedT);
	let heat = $state(D.heat);
	let wobble = $state(D.wobble);
	let rows = $state(D.rows);
	let angle = $state(D.angle);
	let region = $state(D.region);
	let noScroll = $state(D.noScroll);
	let showText = $state(D.showText);
	let gap = $state(D.gap);
	const pct = (t: number) => `${Math.round(Math.pow(3, t) * 100)}%`;
	function reset() {
		({ imgT, textT, speedT, heat, wobble, rows, angle, region, noScroll, showText, gap } = D);
	}
</script>

<svelte:head>
	<title>Animation test · Cali Capital Fest</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="anim">
	<LineupSphere {imgT} {textT} {speedT} {heat} {wobble} {rows} {angle} {region} {noScroll} {showText} {gap} />

	<form class="anim__controls" onsubmit={(e) => e.preventDefault()}>
		<label>
			<span>Image size <b>{pct(imgT)}</b></span>
			<input type="range" min="-1" max="1" step="0.01" bind:value={imgT} />
		</label>
		<label>
			<span>Text size <b>{pct(textT)}</b></span>
			<input type="range" min="-1" max="1" step="0.01" bind:value={textT} />
		</label>
		<label>
			<span>Heat <b>{heat.toFixed(1)}/s</b></span>
			<input type="range" min="0" max="3" step="0.2" bind:value={heat} />
		</label>
		<label>
			<span>Wobble <b>{wobble.toFixed(1)}px</b></span>
			<input type="range" min="0" max="10" step="0.2" bind:value={wobble} />
		</label>
		<label>
			<span>Rows <b>{rows}</b></span>
			<input type="range" min="2" max="20" step="1" bind:value={rows} />
		</label>
		<label>
			<span>Speed <b>{pct(speedT)}</b></span>
			<input type="range" min="-1" max="1" step="0.01" bind:value={speedT} />
		</label>
		<label>
			<span>Angle <b>{angle}°</b></span>
			<input type="range" min="0" max="360" step="5" bind:value={angle} />
		</label>
		<label>
			<span>Shrink region <b>{region > 0 ? "+" : ""}{region}%</b></span>
			<input type="range" min="-50" max="50" step="5" bind:value={region} />
		</label>
		<label>
			<span>Text gap <b>{gap}px</b></span>
			<input type="range" min="-30" max="30" step="1" bind:value={gap} disabled={!showText} />
		</label>
		<label class="anim__check">
			<input type="checkbox" bind:checked={noScroll} />
			<span>Disable manual scrolling</span>
		</label>
		<label class="anim__check">
			<input type="checkbox" bind:checked={showText} />
			<span>Show text</span>
		</label>
		<button type="button" onclick={reset}>Reset</button>
	</form>
</main>

<style>
	.anim {
		padding-top: var(--nav-h);
		min-height: 100svh;
		display: flex;
		flex-direction: column;
	}
	.anim__controls {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr));
		gap: 0.75rem 1.5rem;
		padding: 1rem 16px 2rem;
		max-width: 60rem;
		width: 100%;
		margin: 0 auto;
		font-family: var(--font-body);
		color: var(--c-text);
	}
	.anim__controls label {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		font-size: 0.95rem;
	}
	.anim__controls label span {
		display: flex;
		justify-content: space-between;
	}
	.anim__controls b {
		color: var(--c-yellow);
		font-variant-numeric: tabular-nums;
	}
	.anim__controls input {
		width: 100%;
		accent-color: var(--c-pink);
	}
	.anim__controls .anim__check {
		flex-direction: row;
		align-items: center;
		align-self: end;
		gap: 0.5rem;
	}
	.anim__controls .anim__check input {
		width: 1.1rem;
		height: 1.1rem;
	}
	.anim__controls button {
		justify-self: start;
		align-self: end;
		padding: 0.4rem 1.2rem;
		border-radius: 999px;
		background: var(--c-yellow);
		color: #000101;
		font-weight: 700;
	}
</style>
