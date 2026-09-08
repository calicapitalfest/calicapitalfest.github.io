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

<Section id="acerca" kicker="El festival" title="Acerca" icon="icon-mic.png">
	<p>
		Cali Capital Fest reúne a la comunidad de danza urbana de Cali con artistas
		nacionales e internacionales: talleres, batallas, conversatorios y una gran
		fiesta de ciudad.
	</p>
	<p style="margin-top:1rem">
		La edición 2026 está en construcción. Muy pronto anunciamos fechas, sedes y
		line&nbsp;up.
	</p>
</Section>

<Section id="lineup" kicker="Artistas" title="Line Up" icon="deco-star.png" />

<Section id="talleres" kicker="Formación" title="Talleres" icon="icon-calendar.png" />

<Section id="batallas" kicker="Competencia" title="Batallas" icon="deco-asterisk.png" />

<Section id="entradas" kicker="Boletería" title="Entradas" icon="icon-notes.png" />

<Section id="ubicacion" kicker="Dónde" title="Ubicación" icon="icon-location.png" />

<Section id="patrocinadores" kicker="Apoyan" title="Patrocinadores" icon="deco-splat.png" />
