<script lang="ts">
	import Hero from "$lib/components/2026/Hero.svelte";
	import Section from "$lib/components/2026/Section.svelte";
	import Carousel from "$lib/components/2026/Carousel.svelte";
	import Countdown from "$lib/components/2026/Countdown.svelte";
	import ComingSoon from "$lib/components/2026/ComingSoon.svelte";
	import CardDeco from "$lib/components/2026/CardDeco.svelte";
	import CardTexture from "$lib/components/2026/CardTexture.svelte";
	import DisplayText from "$lib/components/2026/DisplayText.svelte";
	import { pick, type BrandColor } from "$lib/components/2026/palette";

	// Each section's cards cycle through its own set of brand colours,
	// starting from the section's main colour.
	const COLORS: Record<string, BrandColor[]> = {
		acerca: ["blue", "pink", "yellow"],
		lineup: ["purple", "magenta", "cyan"],
		talleres: ["cyan", "purple", "yellow", "pink", "lime", "blue"],
		batallas: ["yellow", "magenta"],
		entradas: ["lime", "pink", "blue", "yellow", "purple"]
	};

	const momentos = [
		{
			title: "The Biggest Workshops",
			body: "Un espacio para elevar tu nivel con formadores locales, nacionales e internacionales provenientes de Estados Unidos y Corea del Sur, además de conversatorios y encuentros de networking."
		},
		{
			title: "League of Giants",
			body: "Nuestra competencia por grupos. Un todos contra todos para llevar el nivel al máximo en las categorías Street Dance y K-pop Dance Cover.",
			note: "Bolsa de premios: $20.000.000 (aplican términos y condiciones)."
		},
		{
			title: "The Battles of Giants",
			body: 'Batallas de street dance en formato "Defiende tu estilo", con dos categorías: Soul Train (Locking, Popping, Breaking y Whacking/Punking) y 80\'s Battles (Hip Hop, House Dance, Krumping, Dancehall, Afro y Electro Dance).',
			note: "Bolsa de premios: $3.000.000 (aplican términos y condiciones). Los estilos funk no pueden participar en 80's Battles y viceversa."
		}
	];

	const paquetes = [
		{
			name: "Faith Pass",
			desc: "Todas las clases",
			fine: "No incluye ingreso a competencias ni batallas.",
			price: "$374.500",
			promo: true
		},
		{ name: "Local Pass", desc: "4 clases (Collab)", price: "$90.950" },
		{ name: "National Pass", desc: "Todas las clases", price: "Valor pendiente" },
		{ name: "International Pass", desc: "3 clases", price: "Valor pendiente" },
		{
			name: "Cali Pack",
			desc: "Todas las clases",
			fine: "No incluye ingreso a competencias ni batallas.",
			price: "$802.500"
		}
	];

	const claseSuelta = [
		{ nivel: "Local", precio: "$48.150" },
		{ nivel: "Nacional", precio: "$85.600" },
		{ nivel: "Internacional", precio: "$267.500" }
	];

	const logInscripcion = [
		{ opcion: "1 categoría", precio: "$150.000" },
		{ opcion: "1 categoría + taller (aplican TyC)", precio: "$220.000" },
		{ opcion: "Categoría adicional", precio: "$80.000" }
	];

	const battlesInscripcion = [
		{ opcion: "1 categoría", precio: "$80.000" },
		{ opcion: "2 categorías", precio: "$160.000" }
	];

	const cronograma = [
		{
			day: "Martes 17",
			items: [
				{ time: "5:30 p. m.", label: "Apertura" },
				{ time: "6:30 p. m.", label: "Taller de apertura (Free)" },
				{ time: "9:30 p. m.", label: "Tallerista local 1 (Free)" }
			]
		},
		{
			day: "Miércoles 18",
			items: [
				{ time: "5:00 p. m.", label: "Tallerista local 2" },
				{ time: "6:30 p. m.", label: "Tallerista local 3" },
				{ time: "8:30 p. m.", label: "Tallerista nacional 1" }
			]
		},
		{
			day: "Jueves 19",
			items: [
				{ time: "5:00 p. m.", label: "Tallerista local 4" },
				{ time: "6:30 p. m.", label: "Tallerista local 5" },
				{ time: "8:30 p. m.", label: "Tallerista nacional 2" }
			]
		},
		{
			day: "Viernes 20",
			items: [
				{ time: "6:00 p. m.", label: "Tallerista nacional 3" },
				{ time: "7:30 p. m.", label: "Meeting" }
			]
		},
		{
			day: "Sábado 21",
			items: [{ time: "2:00 p. m.", label: "League of Giants" }]
		},
		{
			day: "Domingo 22",
			items: [
				{ time: "9:00 a. m.", label: "Tallerista internacional 1 — The Biggest Workshop" },
				{ time: "10:30 a. m.", label: "Tallerista internacional 2 — The Biggest Workshop" },
				{ time: "12:00 m.", label: "Tallerista internacional 3 — The Biggest Workshop" },
				{ time: "3:00 p. m.", label: "Inscripciones — Battle of Giants" },
				{ time: "4:00 p. m.", label: "Inicio de batallas — Battle of Giants" }
			]
		}
	];
</script>

<svelte:head>
	<title>Cali Capital Fest 2026</title>
	<meta
		name="description"
		content="Cali Capital Fest 2026 — Festival Internacional de Danza Urbana. Noviembre 2026, Cali, Colombia."
	/>
</svelte:head>

<Hero />

<!--
	Section icon + background placement.

	Every Section spells out all eight knobs so each one can be nudged on its own.
	Both layers pivot on the same fixed centre, so rotation never drifts:
	  iconRotate / bgRotate       degrees
	  iconX / iconY / bgX / bgY   percent of that element's own size
	  iconScale / bgScale         multiplier
	bgColor tints the shape — the flat-*.svg files are used as masks, so any
	shape can take any colour.
-->

<Section
	id="acerca"
	kicker="El Festival"
	title="Acerca"
	icon="icon-mic.png"
	iconBg="flat-flower.svg"
	bgColor="#0073d8"
	iconRotate={0}
	iconX={0}
	iconY={0}
	iconScale={1}
	bgRotate={0}
	bgX={0}
	bgY={0}
	bgScale={1.7}
>
	<div class="u-prose" style="margin-bottom:2.5rem">
		<p>
			Cali Capital es un festival que se realizará del 17 al 22 de noviembre de
			2026 y reúne a la comunidad de danza de Colombia en Cali, con el propósito
			de atraer a la industria global hacia el suroccidente colombiano.
		</p>
		<p style="margin-top:1rem">
			Durante el festival se desarrollarán talleres con formadores locales,
			nacionales e internacionales, estos últimos provenientes de Estados Unidos y
			Corea del Sur, así como conversatorios y encuentros de networking. Además,
			se llevarán a cabo dos grandes competencias: una para grupos de street dance
			y K-pop dance cover, y otra dedicada a las batallas de freestyle dance.
		</p>
	</div>

	<Carousel label="El festival se desarrolla en 3 momentos">
		{#each momentos as m, i}
			{@const c = pick(COLORS.acerca, i)}
			<article class="card card--momento" style:--accent={c.bg} style:--accent-fg={c.fg}>
				<CardTexture index={i} />
				<CardDeco seed={m.title} bg={c.bg} />
				<h3 class="font-display card__title"><DisplayText text={m.title} /></h3>
				<p>{m.body}</p>
				{#if m.note}<p class="card__note">{m.note}</p>{/if}
			</article>
		{/each}
	</Carousel>
</Section>

<Section
	id="lineup"
	kicker="Artistas"
	title="Line Up"
	icon="deco-star.png"
	iconBg="flat-blob-purple.svg"
	bgColor="#9546ff"
	iconRotate={0}
	iconX={0}
	iconY={0}
	iconScale={1}
	bgRotate={0}
	bgX={0}
	bgY={0}
	bgScale={1.7}
>
	<div class="lineup-grid">
		{#each ["Internacionales", "Nacionales", "Locales"] as grupo, i}
			{@const c = pick(COLORS.lineup, i)}
			<div class="lineup-box" style:--accent={c.bg} style:--accent-fg={c.fg}>
				<CardTexture index={i} />
				<CardDeco seed={grupo} bg={c.bg} />
				<ComingSoon label="Se revela pronto" />
				<p class="lineup-box__label">{grupo}</p>
			</div>
		{/each}
	</div>
</Section>

<Section
	id="talleres"
	kicker="Formación"
	title="Talleres"
	icon="icon-calendar.png"
	iconBg="flat-circle.svg"
	bgColor="#00ebff"
	accentFg="#000507"
	iconRotate={0}
	iconX={0}
	iconY={0}
	iconScale={1}
	bgRotate={0}
	bgX={0}
	bgY={0}
	bgScale={1.55}
>
	<Carousel label="Cronograma">
		{#each cronograma as d, i}
			{@const c = pick(COLORS.talleres, i)}
			<article class="card card--dia" style:--accent={c.bg} style:--accent-fg={c.fg}>
				<CardTexture index={i} />
				<CardDeco seed={d.day} bg={c.bg} />
				<h3 class="font-display card__title"><DisplayText text={d.day} /></h3>
				<ul class="card__agenda">
					{#each d.items as it}
						<li><span class="card__time">{it.time}</span><span>{it.label}</span></li>
					{/each}
				</ul>
			</article>
		{/each}
	</Carousel>
</Section>

<Section
	id="batallas"
	kicker="Competencia"
	title="Batallas"
	icon="deco-asterisk.png"
	iconBg="flat-blob.svg"
	bgColor="#f2cf00"
	accentFg="#000507"
	iconRotate={0}
	iconX={0}
	iconY={0}
	iconScale={1}
	bgRotate={0}
	bgX={0}
	bgY={0}
	bgScale={1.7}
>
	<div class="battle-block" style:--accent={pick(COLORS.batallas, 0).bg} style:--accent-fg={pick(COLORS.batallas, 0).fg}>
		<p class="u-kicker">League of Giants · K-pop Dance Cover y Street Dance</p>
		<div class="u-prose">
			<p>
				Aquí es donde traes lo mejor de ti para llevarte hasta $10.000.000 COP
				(Aplican TyC) por cada categoría. Recuerda leer muy bien el reglamento
				para evitar sorpresas.
			</p>
		</div>
		<div class="card card--table">
			<CardTexture index={4} />
			<CardDeco seed="logInscripcion" bg={pick(COLORS.batallas, 0).bg} corners={["bl", "br"]} min={36} max={52} />
			<table class="u-table">
				<thead>
					<tr><th><DisplayText text="Opción" /></th><th><DisplayText text="Valor" /></th></tr>
				</thead>
				<tbody>
					{#each logInscripcion as row}
						<tr><td>{row.opcion}</td><td><span class="card__value">{row.precio}</span></td></tr>
					{/each}
				</tbody>
			</table>
		</div>
		<div class="btn-row">
			<span class="btn btn--primary btn--disabled">Inscríbete aquí — Próximamente</span>
			<span class="btn btn--ghost btn--disabled">Reglamento Street Dance</span>
			<span class="btn btn--ghost btn--disabled">Reglamento K-pop DC</span>
		</div>
	</div>

	<div class="battle-block" style:--accent={pick(COLORS.batallas, 1).bg} style:--accent-fg={pick(COLORS.batallas, 1).fg}>
		<p class="u-kicker">The Battles of Giants · Soul Train y 80's Battles</p>
		<div class="u-prose">
			<p>
				Nuestro espacio de batallas, donde este año la comunidad será la
				protagonista. Ven y gana uno de los dos premios de $1.500.000 al primer
				puesto de cada categoría, en el formato "Defiende tu estilo".
			</p>
		</div>
		<div class="card card--table">
			<CardTexture index={5} />
			<CardDeco seed="battlesInscripcion" bg={pick(COLORS.batallas, 1).bg} corners={["bl", "br"]} min={36} max={52} />
			<table class="u-table">
				<thead>
					<tr><th><DisplayText text="Opción" /></th><th><DisplayText text="Valor" /></th></tr>
				</thead>
				<tbody>
					{#each battlesInscripcion as row}
						<tr><td>{row.opcion}</td><td><span class="card__value">{row.precio}</span></td></tr>
					{/each}
				</tbody>
			</table>
		</div>
		<div class="u-prose">
			<p><strong>Soul Train:</strong> Locking, Popping, Breaking y Whacking (Punking).</p>
			<p style="margin-top:0.5rem"><strong>80's Battles:</strong> Hip Hop Dance, House Dance, Krumping, Dancehall, Afro Dance, Electro Dance.</p>
			<p class="card__note" style="margin-top:0.75rem">
				Los estilos funk no pueden participar en 80's Battles, y los estilos de
				80's no pueden participar en Soul Train.
			</p>
		</div>
	</div>
</Section>

<Section
	id="entradas"
	kicker="Boletería"
	title="Entradas"
	icon="icon-notes.png"
	iconBg="flat-cross.svg"
	bgColor="#ccff00"
	accentFg="#000507"
	iconRotate={0}
	iconX={0}
	iconY={0}
	iconScale={1}
	bgRotate={0}
	bgX={0}
	bgY={0}
	bgScale={1.7}
>
	<Carousel label="Paquetes">
		{#each paquetes as p, i}
			{@const c = pick(COLORS.entradas, i)}
			<article class="card card--paquete" style:--accent={c.bg} style:--accent-fg={c.fg}>
				<CardTexture index={i} />
				<CardDeco seed={p.name} bg={c.bg} />
				<h3 class="font-display card__title"><DisplayText text={p.name} /></h3>
				<p>{p.desc}</p>
				{#if p.fine}<p class="card__note">{p.fine}</p>{/if}
				<!-- Polymath has no "$", so it's set in the body face instead of falling back -->
					<p class="card__price">{#if p.price.startsWith("$")}<span class="card__currency">$</span>{p.price.slice(1)}{:else}{p.price}{/if}</p>
				{#if p.promo}
					<div class="promo">
						<p class="card__note">
							Promoción válida hasta el 25 de octubre o hasta agotar existencias.
							Solo 15 cupos disponibles.
						</p>
						<div class="promo__countdown">
							<Countdown target="2026-10-25T23:59:59-05:00" />
						</div>
					</div>
				{/if}
			</article>
		{/each}
	</Carousel>

	<p class="u-label" style="margin-top:2.5rem;margin-bottom:0.75rem">Clase suelta</p>
	<div class="card card--table" style:--accent={pick(COLORS.entradas, 1).bg} style:--accent-fg={pick(COLORS.entradas, 1).fg}>
		<CardTexture index={7} />
		<CardDeco seed="claseSuelta" bg={pick(COLORS.entradas, 1).bg} corners={["bl", "br"]} min={36} max={52} />
		<table class="u-table">
			<thead>
				<tr><th><DisplayText text="Nivel" /></th><th><DisplayText text="Valor" /></th></tr>
			</thead>
			<tbody>
				{#each claseSuelta as row}
					<tr><td>{row.nivel}</td><td><span class="card__value">{row.precio}</span></td></tr>
				{/each}
			</tbody>
		</table>
	</div>
</Section>

<Section
	id="ubicacion"
	kicker="Dónde"
	title="Ubicación"
	icon="icon-location.png"
	iconBg="flat-asterisk.svg"
	bgColor="#ff48d4"
	accentFg="#000507"
	iconRotate={0}
	iconX={0}
	iconY={0}
	iconScale={1}
	bgRotate={0}
	bgX={0}
	bgY={0}
	bgScale={1.7}
/>

<Section
	id="patrocinadores"
	kicker="Apoyan"
	title="Patrocinadores"
	icon="deco-splat.png"
	iconBg="flat-circle.svg"
	bgColor="#ff245e"
	iconRotate={0}
	iconX={0}
	iconY={0}
	iconScale={1}
	bgRotate={0}
	bgX={0}
	bgY={0}
	bgScale={1.55}
/>

<style>
	/* Flat flashcards: a solid fill in the section's brand colour (--accent,
	   set by Section.svelte from its bgColor prop) rather than a dark panel
	   with a glowing border — matches the brand manual's flat colour blocks. */
	.card {
		/* shapes from CardDeco sit at z-index -1: above this fill, under the text */
		position: relative;
		overflow: hidden;
		isolation: isolate;
		width: min(78vw, 320px);
		padding: 1.5rem;
		border-radius: 20px;
		background: var(--accent);
		color: var(--accent-fg);
	}
	/* app.css paints every p/h3 white — on lime, cyan or yellow that vanishes */
	.card :is(h3, p),
	.lineup-box :global(p) {
		color: inherit;
	}
	.card__title {
		font-size: 1.3rem;
		margin-bottom: 0.6rem;
	}
	.card__note {
		margin-top: 0.5rem;
		font-size: 0.85rem;
		opacity: 0.75;
	}
	.card__price {
		margin-top: 0.9rem;
		font-family: var(--font-display);
		font-weight: 950;
		font-size: 1.6rem;
	}

	.card__currency {
		font-family: var(--font-body);
		font-weight: 600;
		margin-right: 0.05em;
	}

	.card--momento,
	.card--paquete {
		width: min(78vw, 340px);
	}

	.promo {
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: 1px solid color-mix(in srgb, var(--accent-fg) 30%, transparent);
	}

	.promo__countdown {
		display: flex;
		justify-content: center;
		margin-top: 0.75rem;
	}

	.card--dia {
		width: min(78vw, 260px);
	}
	.card__agenda {
		display: flex;
		flex-direction: column;
	}
	.card__agenda li {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.3rem;
		padding: 0.7rem 0;
		font-size: 0.92rem;
	}
	.card__agenda li:first-child {
		padding-top: 0.2rem;
	}
	.card__agenda li + li {
		border-top: 2px solid color-mix(in srgb, var(--accent-fg) 22%, transparent);
	}
	/* highlight box: the card's own colour, one shade lighter */
	.card__time {
		padding: 0.15rem 0.55rem;
		border-radius: 6px;
		background: color-mix(in srgb, var(--accent) 72%, #fff);
		font-weight: 700;
		font-size: 0.78rem;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	/* a table set inside a flashcard: its header and rules follow the card's
	   text colour, since the section accent may be the card's own fill */
	.card--table {
		width: 100%;
		max-width: 480px;
		padding: 1rem 1.25rem 2rem;
	}
	.card--table :global(.u-table th) {
		/* Polymath, like the section titles */
		color: inherit;
		font-family: var(--font-display);
		font-size: 1.35rem;
		font-weight: 950;
		letter-spacing: 0.02em;
	}
	.card--table :global(.u-table td) {
		font-size: 1.1rem;
		font-weight: 600;
	}
	/* price bubble: same lighter-shade box as the cronograma times */
	.card__value {
		display: inline-block;
		padding: 0.15rem 0.6rem;
		border-radius: 6px;
		background: color-mix(in srgb, var(--accent) 72%, #fff);
		font-weight: 700;
	}
	.card--table :global(.u-table th),
	.card--table :global(.u-table td) {
		border-bottom-color: color-mix(in srgb, var(--accent-fg) 25%, transparent);
	}
	.card--table :global(.u-table tr:last-child td) {
		border-bottom: 0;
	}

	.lineup-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1.25rem;
	}
	.lineup-box {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.9rem;
		height: 220px;
		border-radius: 20px;
		background: var(--accent);
		color: var(--accent-fg);
		overflow: hidden;
		isolation: isolate;
	}
	/* inverted pill, so it never blends into a pink/magenta box */
	.lineup-box :global(.soon) {
		background: var(--accent-fg);
		color: var(--accent);
	}
	.lineup-box__label {
		font-family: var(--font-subtitle);
		font-size: 1.1rem;
		color: var(--accent-fg);
	}

	.battle-block + .battle-block {
		margin-top: 3rem;
		padding-top: 3rem;
		border-top: 1px solid color-mix(in srgb, var(--c-text) 20%, transparent);
	}
	.battle-block .u-prose {
		margin: 0.75rem 0 1.25rem;
	}

	.btn-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.8rem;
		margin-top: 1.5rem;
	}
</style>
