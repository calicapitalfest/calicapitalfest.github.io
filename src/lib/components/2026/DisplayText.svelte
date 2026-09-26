<!--
	Text for the Polymath display face. The bundled Polymath cut has no
	accented letters, so "Á" would fall back to another font. Instead, each
	accented letter is drawn as its plain Polymath base letter with the
	accent drawn in CSS on top. Assumes the display style's uppercase transform;
	pass `lower` when the text keeps its own case (the flashcard titles), so
	accents on lowercase letters sit at x-height instead of cap height.
-->
<script lang="ts">
	let { text, lower = false }: { text: string; lower?: boolean } = $props();

	const MARKS: Record<string, string> = { "́": "acute", "̃": "tilde" };

	type Part = { ch: string; mark?: string };
	const split = (word: string) =>
		[...word.normalize("NFD")].reduce<Part[]>((acc, ch) => {
			const mark = MARKS[ch];
			if (mark && acc.length) acc[acc.length - 1].mark = mark;
			else acc.push({ ch });
			return acc;
		}, []);

	// Word by word (spaces kept as their own entries): an accented word is held
	// together, since its inline-block letters would otherwise be line-break
	// points ("T" | "ÉCNICOS").
	let words = $derived(text.split(/(\s+)/).filter(Boolean).map(split));
</script>

<!-- kept on one line: whitespace between the letter spans would render as gaps -->
<span class="sr">{text}</span><span aria-hidden="true">{#each words as parts}{#if parts.some((p) => p.mark)}<span class="word">{#each parts as p}{#if p.mark}<span class="acc acc--{p.mark}" class:acc--lc={lower && p.ch !== p.ch.toUpperCase()}>{p.ch}</span>{:else}{p.ch}{/if}{/each}</span>{:else}{parts.map((p) => p.ch).join("")}{/if}{/each}</span>

<style>
	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}
	.word {
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
	/* With line-height 0.95, Polymath's cap top sits 0.134em below the
	   span's top. Marks are about as thick as the Super cut's strokes and
	   leave a ~0.05em gap above the letter. */
	.acc--acute::after {
		top: -0.13em;
		width: 0.3em;
		height: 0.15em;
		translate: -40% 0;
		rotate: -28deg;
		border-radius: 0.03em;
	}
	.acc--tilde::after {
		top: -0.07em;
		width: 0.42em;
		height: 0.14em;
		translate: -50% 0;
		border-radius: 999px;
	}
	/* lowercase: Polymath's x-height sits ~0.16em below its cap height
	   (0.521 vs 0.681em for a/e/o). After the mark rules so it wins for ñ too. */
	.acc--lc::after {
		top: 0.03em;
	}
	.acc--lc.acc--tilde::after {
		top: 0.09em;
	}
</style>
