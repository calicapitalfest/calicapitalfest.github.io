<!--
	Page frame for the competition rulebooks (League of Giants, Battles of
	Giants): the way back to the site, the cream sheet, the title block, and
	every style the rule text inside it uses (articles, a) b) lists, tables,
	glossary, boxes, score sheets). The page supplies the text as children,
	with the class names styled below.
-->
<script lang="ts">
	let {
		back,
		title,
		subs = [],
		children
	}: {
		back: { href: string; label: string };
		title: string;
		subs?: string[];
		children: import("svelte").Snippet;
	} = $props();
</script>

<main class="reg">
	<a class="reg__home" href={back.href}>← {back.label}</a>

	<article class="doc">
		<header class="doc__head">
			<p class="doc__kicker">Reglamento oficial de competencia</p>
			<h1 class="font-display doc__title">{title}</h1>
			{#each subs as sub}<p class="doc__sub">{sub}</p>{/each}
		</header>

		{@render children()}
	</article>
</main>

<style>
	/* Long-form reading page: dark ink on the brand's cream "paper", DM Sans at
	   a regular (not light) weight, ~68 characters a line, generous leading.
	   The brand colours only mark structure (article numbers, rules, table
	   group rows); body text is always ink on cream. */
	.reg {
		--paper: #ffffe9;
		--ink: #000101;
		--ink-soft: #3d3c35;
		--line: #d9d6c3;
		--tint: #f4f1d9;
		--mark: #a544ff;
		max-width: 52rem;
		margin: 0 auto;
		padding: clamp(1.5rem, 5vw, 3rem) clamp(0.75rem, 3vw, 1.5rem) 4rem;
	}
	.reg__home {
		display: inline-block;
		margin-bottom: 1rem;
		font-weight: 600;
		color: var(--c-text);
	}
	.reg__home:hover {
		text-decoration: underline;
	}

	.doc {
		background: var(--paper);
		color: var(--ink);
		border-radius: 1.5rem;
		padding: clamp(1.5rem, 6vw, 4rem) clamp(1.1rem, 6vw, 4.5rem);
		font-family: var(--font-body);
		font-weight: 400;
		font-size: calc(1.0625rem + 2pt);
		line-height: 1.7;
		overflow-wrap: break-word;
		hyphens: auto;
	}
	/* app.css styles every p with a small, translucent-white size */
	.doc :global(p),
	.doc :global(li),
	.doc :global(dd) {
		font-size: inherit;
		color: inherit;
		max-width: 68ch;
	}
	.doc :global(p) {
		margin: 0 0 1.1em;
	}
	/* app.css paints every heading white */
	.doc :global(h1),
	.doc :global(h2),
	.doc :global(h3) {
		color: var(--ink);
	}
	.doc :global(b) {
		font-weight: 700;
	}
	.doc :global(a) {
		color: var(--ink);
		text-decoration: underline;
		text-decoration-color: var(--mark);
		text-decoration-thickness: 2px;
		text-underline-offset: 3px;
	}

	/* ---- title block ---- */
	.doc :global(.doc__head) {
		padding-bottom: 1.5rem;
		margin-bottom: 2rem;
		border-bottom: 3px solid var(--ink);
	}
	.doc :global(.doc__kicker) {
		font-weight: 700;
		font-size: 0.9rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}
	.doc :global(.doc__kicker) {
		margin-bottom: 0.4rem;
	}
	.doc :global(.doc__title) {
		hyphens: manual;
		font-size: clamp(2.2rem, 7vw, 3.6rem);
		margin-bottom: 0.9rem;
	}
	.doc :global(.doc__sub) {
		margin: 0;
		font-weight: 500;
		font-size: calc(1.1rem + 2pt);
		line-height: 1.45;
	}

	/* ---- boxes (datos generales, cuenta, documentos) ---- */
	.doc :global(.box) {
		background: var(--tint);
		border-radius: 1rem;
		padding: 1.25rem 1.4rem;
		margin: 0 0 1.75rem;
	}
	.doc :global(.box__title) {
		font-weight: 800;
		font-size: 0.85rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		margin-bottom: 0.8rem;
	}
	.doc :global(.kv) {
		display: grid;
		grid-template-columns: minmax(8rem, max-content) 1fr;
		gap: 0.45rem 1.25rem;
		margin: 0;
		line-height: 1.5;
	}
	.doc :global(.kv dt) {
		font-weight: 700;
	}
	.doc :global(.kv dd) {
		margin: 0;
	}
	@media (max-width: 560px) {
		.doc :global(.kv) {
			grid-template-columns: 1fr;
			gap: 0;
		}
		.doc :global(.kv dd) {
			margin-bottom: 0.7rem;
		}
	}
	.doc :global(.mono) {
		font-variant-numeric: tabular-nums;
		letter-spacing: 0.02em;
	}

	/* ---- table of contents ---- */
	.doc :global(.toc) {
		border: 2px solid var(--ink);
		border-radius: 1rem;
		padding: 1.25rem 1.4rem;
		margin: 2rem 0 1rem;
		scroll-margin-top: calc(var(--nav-h) + 16px);
	}
	.doc :global(.toc ol) {
		list-style: none;
		margin: 0;
		padding: 0;
		columns: 2 18rem;
		column-gap: 2rem;
		line-height: 1.4;
	}
	.doc :global(.toc li) {
		break-inside: avoid;
		margin-bottom: 0.55rem;
	}
	/* number in its own column, so wrapped titles hang under the title */
	.doc :global(.toc a) {
		display: grid;
		grid-template-columns: minmax(1.8em, max-content) 1fr;
		column-gap: 0.4em;
		text-decoration: none;
	}
	.doc :global(.toc a:hover) {
		text-decoration: underline;
		text-decoration-color: var(--mark);
	}
	.doc :global(.toc__n) {
		font-weight: 700;
		font-variant-numeric: tabular-nums;
	}

	/* ---- articles ---- */
	.doc :global(.art) {
		padding-top: 2.5rem;
		margin-top: 2.5rem;
		border-top: 1px solid var(--line);
		scroll-margin-top: calc(var(--nav-h) + 8px);
	}
	.doc :global(.art__head) {
		margin-bottom: 1.4rem;
	}
	.doc :global(.art__num) {
		margin: 0 0 0.25rem;
		font-weight: 800;
		font-size: 0.85rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--mark);
	}
	.doc :global(.art__title) {
		hyphens: manual;
		font-size: clamp(1.45rem, 4vw, 2rem);
		line-height: 1.1;
		letter-spacing: 0.01em;
	}
	.doc :global(.art__back) {
		margin: 1.5rem 0 0;
		font-size: 0.9rem;
	}
	.doc :global(.art__back a) {
		text-decoration: none;
		color: var(--ink-soft);
	}
	.doc :global(.art__back a:hover) {
		text-decoration: underline;
	}

	/* a) b) c) lists, as in the document */
	.doc :global(.alpha) {
		list-style: none;
		counter-reset: alpha;
		margin: -0.4em 0 1.2em;
		padding: 0 0 0 2.2em;
	}
	.doc :global(.alpha li) {
		counter-increment: alpha;
		position: relative;
		margin-bottom: 0.45em;
	}
	.doc :global(.alpha li::before) {
		content: counter(alpha, lower-alpha) ")";
		position: absolute;
		left: -1.8em;
		font-weight: 700;
	}
	.doc :global(.box .alpha) {
		margin: 0;
	}

	/* 15.2: numbered tie-break steps */
	.doc :global(.steps) {
		list-style: none;
		counter-reset: step;
		margin: 0 0 1.2em;
		padding: 0;
		display: grid;
		gap: 0.6rem;
	}
	.doc :global(.steps li) {
		counter-increment: step;
		display: grid;
		grid-template-columns: 2.2rem 1fr;
		align-items: baseline;
		gap: 0.75rem;
	}
	.doc :global(.steps li::before) {
		content: counter(step);
		display: grid;
		place-items: center;
		width: 2.2rem;
		height: 2.2rem;
		border-radius: 50%;
		background: var(--ink);
		color: var(--paper);
		font-weight: 800;
		line-height: 1;
		translate: 0 0.55rem;
	}

	/* ---- glossary: term above its definition, readable at any width ---- */
	.doc :global(.glossary) {
		margin: 0 0 1.2em;
		display: grid;
		gap: 0;
	}
	.doc :global(.glossary > div) {
		padding: 0.8rem 0;
		border-bottom: 1px solid var(--line);
	}
	.doc :global(.glossary > div:first-child) {
		border-top: 1px solid var(--line);
	}
	.doc :global(.glossary dt) {
		font-weight: 700;
	}
	.doc :global(.glossary dd) {
		margin: 0.15rem 0 0;
		line-height: 1.6;
	}

	/* ---- tables ---- */
	/* scrolls sideways on phones instead of squeezing the columns */
	.doc :global(.tbl) {
		overflow-x: auto;
		margin: 0 0 1.5em;
		border: 1px solid var(--line);
		border-radius: 0.75rem;
	}
	.doc :global(table) {
		width: 100%;
		border-collapse: collapse;
		font-size: calc(0.97rem + 2pt);
		line-height: 1.5;
	}
	.doc :global(.tbl table) {
		min-width: 34rem;
	}
	.doc :global(th),
	.doc :global(td) {
		text-align: left;
		vertical-align: top;
		padding: 0.7rem 0.9rem;
		border-bottom: 1px solid var(--line);
	}
	.doc :global(thead th) {
		background: var(--ink);
		color: var(--paper);
		font-weight: 700;
		font-size: 0.85rem;
		letter-spacing: 0.02em;
	}
	.doc :global(tbody tr:last-child td) {
		border-bottom: 0;
	}
	.doc :global(tr.group th) {
		background: var(--tint);
		font-weight: 800;
		font-size: 0.8rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		border-top: 2px solid var(--mark);
	}
	.doc :global(tfoot th) {
		border-top: 2px solid var(--ink);
		border-bottom: 0;
		font-weight: 800;
	}
	.doc :global(.num) {
		text-align: right;
		white-space: nowrap;
		font-variant-numeric: tabular-nums;
	}

	/* small notes, worked examples and e-mail subjects */
	.doc :global(.note) {
		margin-top: -0.6em;
		font-size: calc(0.92rem + 2pt);
		color: var(--ink-soft);
	}
	.doc :global(.example) {
		padding: 0.9rem 1.1rem;
		border-left: 4px solid var(--mark);
		background: var(--tint);
		border-radius: 0 0.6rem 0.6rem 0;
	}
	.doc :global(.subject) {
		padding: 0.05em 0.4em;
		border-radius: 0.35em;
		background: var(--tint);
		border: 1px solid var(--line);
		font-weight: 600;
		font-size: 0.92em;
		white-space: nowrap;
	}
	@media (max-width: 560px) {
		.doc :global(.subject) {
			white-space: normal;
		}
	}

	.doc :global(.cols) {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
		gap: 1rem;
		margin-bottom: 1.5em;
	}
	.doc :global(.cols .box) {
		margin: 0;
	}

	/* ---- closing ---- */
	.doc :global(.closing) {
		margin: 2rem 0;
		padding: 1.25rem 1.4rem;
		border-left: 4px solid var(--mark);
		font-size: calc(1.1rem + 2pt);
		font-weight: 500;
		line-height: 1.6;
	}
	.doc :global(.sign p) {
		margin: 0;
		line-height: 1.5;
	}
	.doc :global(.sign__name) {
		margin-top: 1.5rem;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	/* ---- Anexo 1 ---- */
	.doc :global(.sheets) {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(17rem, 1fr));
		gap: 1rem;
	}
	.doc :global(.sheet) {
		border: 1px solid var(--line);
		border-radius: 0.9rem;
		padding: 1rem 1.1rem;
	}
	.doc :global(.sheet--wide) {
		grid-column: 1 / -1;
	}
	.doc :global(.sheet__title) {
		font-weight: 800;
		font-size: 0.95rem;
		line-height: 1.35;
		margin-bottom: 0.4rem;
	}
	.doc :global(.sheet__fields) {
		margin: 0.5rem 0;
		font-size: 0.85rem;
		line-height: 1.45;
		color: var(--ink-soft);
	}
	.doc :global(.sheet table) {
		font-size: calc(0.92rem + 2pt);
	}
	.doc :global(.sheet th),
	.doc :global(.sheet td) {
		padding: 0.45rem 0.5rem;
	}
</style>
