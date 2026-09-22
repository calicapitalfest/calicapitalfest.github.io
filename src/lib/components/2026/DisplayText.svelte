<!--
	Text for the Polymath display face. The bundled Polymath cut has no
	accented letters, so "Á" would fall back to another font. Instead, each
	accented letter is drawn as its plain Polymath base letter with the
	accent drawn in CSS on top. Assumes the display style's uppercase transform.
-->
<script lang="ts">
	let { text }: { text: string } = $props();

	const MARKS: Record<string, string> = { "́": "acute", "̃": "tilde" };

	let parts = $derived(
		[...text.normalize("NFD")].reduce<{ ch: string; mark?: string }[]>((acc, ch) => {
			const mark = MARKS[ch];
			if (mark && acc.length) acc[acc.length - 1].mark = mark;
			else acc.push({ ch });
			return acc;
		}, [])
	);
</script>

<!-- kept on one line: whitespace between the letter spans would render as gaps -->
<span class="sr">{text}</span><span aria-hidden="true">{#each parts as p}{#if p.mark}<span class="acc acc--{p.mark}">{p.ch}</span>{:else}{p.ch}{/if}{/each}</span>

<style>
	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}
	.acc {
		position: relative;
		display: inline-block;
		/* fixed so the accent's offset is measured from the cap height,
		   whatever line-height the surrounding text uses */
		line-height: 0.95;
	}
	.acc::after {
		content: "";
		position: absolute;
		left: 50%;
		background: currentColor;
	}
	.acc--acute::after {
		top: -0.2em;
		width: 0.3em;
		height: 0.11em;
		translate: -40% 0;
		rotate: -28deg;
		border-radius: 0.02em;
	}
	.acc--tilde::after {
		top: -0.2em;
		width: 0.42em;
		height: 0.1em;
		translate: -50% 0;
		border-radius: 999px;
	}
</style>
