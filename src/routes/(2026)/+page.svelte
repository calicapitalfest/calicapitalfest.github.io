<script lang="ts">
	import Hero from "$lib/components/2026/Hero.svelte";
	import Section from "$lib/components/2026/Section.svelte";
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
	bgColor="#ff2d9b"
	iconRotate={0}
	iconX={0}
	iconY={0}
	iconScale={1}
	bgRotate={0}
	bgX={0}
	bgY={0}
	bgScale={1.7}
>
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
</Section>

<Section
	id="lineup"
	kicker="Artistas"
	title="Line Up"
	icon="deco-star.png"
	iconBg="flat-blob-purple.svg"
	bgColor="#7b2ff7"
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
	id="talleres"
	kicker="Formación"
	title="Talleres"
	icon="icon-calendar.png"
	iconBg="flat-circle.svg"
	bgColor="#29d3f0"
	iconRotate={0}
	iconX={0}
	iconY={0}
	iconScale={1}
	bgRotate={0}
	bgX={0}
	bgY={0}
	bgScale={1.55}
/>

<Section
	id="batallas"
	kicker="Competencia"
	title="Batallas"
	icon="deco-asterisk.png"
	iconBg="flat-blob.svg"
	bgColor="#ffd21e"
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
	id="entradas"
	kicker="Boletería"
	title="Entradas"
	icon="icon-notes.png"
	iconBg="flat-cross.svg"
	bgColor="#c7ff00"
	iconRotate={0}
	iconX={0}
	iconY={0}
	iconScale={1}
	bgRotate={0}
	bgX={0}
	bgY={0}
	bgScale={1.7}
/>

<!-- TODO: restore the accent ("Ubicación") once the licensed Polymath is in place;
     the demo cut has no Ó. -->
<Section
	id="ubicacion"
	kicker="Dónde"
	title="Ubicacion"
	icon="icon-location.png"
	iconBg="flat-asterisk.svg"
	bgColor="#ff48cf"
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
