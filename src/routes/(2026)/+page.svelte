<script lang="ts">
	import { base } from "$app/paths";
	import { onMount } from "svelte";
	import Hero from "$lib/components/2026/Hero.svelte";
	import Section from "$lib/components/2026/Section.svelte";
	import Carousel from "$lib/components/2026/Carousel.svelte";
	import Countdown from "$lib/components/2026/Countdown.svelte";
	import DisplayText from "$lib/components/2026/DisplayText.svelte";
	import ScrollHint from "$lib/components/2026/ScrollHint.svelte";
	import { BRAND, pick, type BrandColor } from "$lib/components/2026/palette";

	// Content and section order follow temp/Cali_Capital_2026_Contenido_Web.docx
	// (Apartados 1–7). The flashcards (momentos, pases, inscripción)
	// follow the designer's SVGs in temp/drive-download-20260924T234744Z-1-001
	// and are styled by $lib/styles/2026-cards.css. Cronograma days cycle
	// through their own brand colours.
	const COLORS: Record<string, BrandColor[]> = {
		cronograma: ["cyan", "purple", "yellow", "pink", "lime", "magenta"]
	};

	// Descripción cards. `lead` is the bold opening phrase, `prize` the bold
	// amount before "(TyC)". The \n are the designs' line breaks.
	const momentos: {
		title: string;
		lead: string;
		body: string;
		prize?: string;
		bg: string;
		titleFg: string;
		panelFg: string;
		panelBg: string;
	}[] = [
		{
			title: "The Biggest Workshops",
			lead: "12 talleres de danza urbana",
			body: "\ncon artistas internacionales,\nnacionales y colaboraciones\ncon los mejores artistas de\nCali.",
			bg: BRAND.cyan.bg,
			titleFg: "#ffffff",
			panelFg: BRAND.purple.bg,
			panelBg: "#ffffe8"
		},
		{
			title: "League Of Giants",
			lead: "Competencias grupales",
			body: "en\nformato todos contra todos,\nen las categorías Street\nDance y K-pop DC, con una\nbolsa de premios de hasta\n",
			prize: "$20.000.000 COP",
			bg: BRAND.magenta.bg,
			titleFg: "#ffffe8",
			panelFg: BRAND.magenta.bg,
			panelBg: "#ffffe8"
		},
		{
			title: "Battle Of Giants",
			lead: "Batallas de freestyle dance",
			body: '\nen dos categorías, en\nformato "Defiende tu estilo",\ncon una bolsa concursable\nde',
			prize: "$3.000.000 COP",
			bg: BRAND.lime.bg,
			titleFg: "#000101",
			panelFg: "#000101",
			panelBg: "#ffffff"
		}
	];

	// Pases. Prices are shown outright, except the promo pass, whose price
	// sits under the tap-to-reveal cover. `from` is the
	// "Disponible desde el" date as printed; the promo pass shows the countdown
	// in that box instead.
	//
	// Sale window (Colombia time, ISO): before `opens` the COMPRAR button is
	// covered by "No Disponible Aún", after `until` by "No disponible".
	const FAITH_ENDS = "2026-11-10T23:59:59-05:00";
	const pases: {
		name: string;
		lead: string;
		sub: string;
		price: string;
		from?: string;
		opens?: string;
		until?: string;
		promo?: boolean;
		href?: string;
		bg: string;
		fg: string;
	}[] = [
		{
			name: "Local Pass",
			lead: "4 Clases Pro-Collab",
			sub: "Con maestros Regionales",
			price: "$90.950 COP",
			from: "10 de octubre",
			opens: "2026-10-10T00:00:00-05:00",
			href: "https://checkout.bold.co/payment/LNK_QWCFODLLNU",
			bg: BRAND.purple.bg,
			fg: "#ffffe8"
		},
		{
			name: "National Pass",
			lead: "3 Clases",
			sub: "Con maestros Nacionales",
			price: "$160.500 COP",
			from: "20 de octubre",
			opens: "2026-10-20T00:00:00-05:00",
			href: "https://checkout.bold.co/payment/LNK_B01PHJDAKC",
			bg: BRAND.cyan.bg,
			fg: "#ffffe8"
		},
		{
			name: "International Pass",
			lead: "3 Clases",
			sub: "Con maestros internacionales",
			price: "$642.000 COP",
			from: "31 de octubre",
			opens: "2026-10-31T00:00:00-05:00",
			href: "https://checkout.bold.co/payment/LNK_24PP6AI8CD",
			bg: BRAND.magenta.bg,
			fg: "#ffffe8"
		},
		{
			name: "Cali Pack",
			lead: "Acceso a todo el evento",
			sub: "No incluye competencia grupal ni\nbatallas",
			price: "$802.500 COP",
			from: "5 de noviembre",
			opens: "2026-11-05T00:00:00-05:00",
			href: "https://checkout.bold.co/payment/LNK_ER08M9G9UY",
			bg: BRAND.yellow.bg,
			fg: "#000101"
		},
		{
			name: "Faith Pass",
			lead: "Todas las clases del evento (12)",
			sub: "No incluye ingresos a\ncompetencias ni batallas",
			price: "$374.500 COP",
			until: FAITH_ENDS,
			promo: true,
			href: "https://checkout.bold.co/payment/LNK_PTN3EH3VWM",
			bg: BRAND.lime.bg,
			fg: "#000101"
		}
	];

	// Clases Sueltas' three COMPRAR buttons: each tilts on its own beat
	const BUY_BEATS = [
		{ dur: "5s", delay: "0s" },
		{ dur: "5.7s", delay: "-1.9s" },
		{ dur: "4.4s", delay: "-3.3s" }
	];

	const clasesSueltas = {
		rows: [
			{ nivel: "Local", precio: "$48.150 COP", href: "https://checkout.bold.co/payment/LNK_SXJD3C3EFU" },
			{ nivel: "Nacional", precio: "$85.600 COP", href: "https://checkout.bold.co/payment/LNK_29I9G3LZC0" },
			{ nivel: "Internacional", precio: "$267.500 COP", href: "https://checkout.bold.co/payment/LNK_CKGUUAYTT6" }
		],
		from: "5 de noviembre",
		opens: "2026-11-05T00:00:00-05:00"
	};

	// Bonos de Ingreso (entry to the competitions). The design's
	// "Comptencias" typo is corrected.
	const bonos = {
		rows: [
			{ dia: "21 nov", evento: "Competencias\nGrupales", aporte: "$37.450 COP" },
			{ dia: "22 nov", evento: "Batallas\nStreet Dance", aporte: "$37.450 COP" }
		],
		from: "31 de octubre"
	};

	const leagueInscripcion = [
		{ opcion: "1 categoría", precio: "$150.000 COP" },
		{ opcion: "Categoría adicional", precio: "$80.000 COP" },
		{ opcion: "1 categoría + taller Internacional", precio: "$220.000 COP" }
	];
	const leagueBotones: { label: string; href: string; external?: boolean }[] = [
		{ label: "Reglamento", href: `${base}/league/reglamento` },
		{ label: "Pre-registro", href: "https://forms.gle/a4sfXkxhAVReujNK9", external: true },
		{ label: "Pagos y entrega de pistas", href: "https://forms.gle/mFWU8Lx74fYrZp579", external: true }
	];

	const battlesInscripcion = [
		{ opcion: "1 categoría", precio: "$80.000 COP" },
		{ opcion: "2 categorías", precio: "$160.000 COP" }
	];

	// Passes whose price cover has been tapped away, by name
	let revealed = $state<Record<string, boolean>>({});

	// The clock only starts in the browser: the prerendered page leaves every
	// COMPRAR uncovered rather than freezing the build date's state into it.
	// Ticks every second so a window opens or closes on the spot.
	let now = $state<number | null>(null);
	onMount(() => {
		now = Date.now();
		const id = setInterval(() => (now = Date.now()), 1000);
		return () => clearInterval(id);
	});
	function saleState(p: { opens?: string; until?: string }, t: number | null) {
		if (t === null) return "open";
		if (p.opens && t < Date.parse(p.opens)) return "soon";
		if (p.until && t >= Date.parse(p.until)) return "over";
		return "open";
	}
	let clasesSale = $derived(saleState(clasesSueltas, now));

	type Item = { time: string; label: string; artists?: string };
	type Venue = { name: string; href?: string };
	const LAS_PILAS: Venue = {
		name: "Centro Comercial Las Pilas",
		href: "https://www.google.com/maps/place/Centro+Comercial+Las+Pilas/@3.4061366,-76.5377913,17z/data=!3m1!4b1!4m6!3m5!1s0x8e30a6ad636a707d:0x87a6c7af055faa90!8m2!3d3.4061366!4d-76.5377913!16s%2Fg%2F1tg5d4dh"
	};
	const PALMETTO: Venue = {
		name: "Palmetto Plaza",
		href: "https://www.google.com/maps/place/Palmetto+Plaza+Shopping+Mall/@3.4128861,-76.5431852,17z/data=!3m2!4b1!5s0x8e30a6aef78344eb:0xe260a8b7d67b4a5!4m6!3m5!1s0x8e30a6af05707fc1:0xd083a753c7398fb8!8m2!3d3.4128807!4d-76.5406049!16s%2Fg%2F1hf2hz45s"
	};
	const E1060: Venue = {
		name: "Espacio 10-60",
		href: "https://www.google.com/maps/place/Espacio+10-60/@3.4469788,-76.534555,17z/data=!3m1!4b1!4m6!3m5!1s0x8e30a663dc084f97:0xd1742e76d804b37e!8m2!3d3.4469734!4d-76.5319747!16s%2Fg%2F11c5g81n40"
	};
	const TBC: Venue = { name: "Espacio por confirmar" };
	const cronograma: { day: string; venue: Venue; groups: { heading?: string; venue?: Venue; items: Item[] }[] }[] = [
		{
			day: "Martes 17",
			venue: PALMETTO,
			groups: [
				{
					items: [
						{ time: "5:30 p.m.", label: "Apertura" },
						{ time: "6:00 p.m.", label: "Taller de apertura (Free)", artists: "Valoyes x Valen Killa" },
						{ time: "7:30 p.m.", label: "Taller de apertura 2 (Free)", artists: "Diego Casas" }
					]
				}
			]
		},
		{
			day: "Miércoles 18",
			venue: PALMETTO,
			groups: [
				{
					items: [
						{ time: "5:00 p.m.", label: "Local | Collab Class", artists: "Luppy x AlexX" },
						{ time: "6:30 p.m.", label: "Local | Collab Class", artists: "Tian Viveros x JuanKa" },
						{ time: "8:30 p.m.", label: "Tallerista nacional", artists: "La Casas" }
					]
				}
			]
		},
		{
			day: "Jueves 19",
			venue: LAS_PILAS,
			groups: [
				{
					items: [
						{ time: "5:00 p.m.", label: "Local | Collab Class", artists: "Andrea Acevedo x Andhiyes" },
						{ time: "6:30 p.m.", label: "Local | Collab Class", artists: "Esteban R x Gekko" },
						{ time: "8:30 p.m.", label: "Tallerista nacional", artists: "Nai Garcia" }
					]
				}
			]
		},
		{
			day: "Viernes 20",
			venue: LAS_PILAS,
			groups: [
				{
					items: [
						{ time: "6:00 p.m.", label: "Tallerista nacional", artists: "Erwin Fine" },
						{ time: "7:30 p.m.", label: "Meeting" }
					]
				}
			]
		},
		{
			day: "Sábado 21",
			venue: TBC,
			groups: [
				{
					items: [
						{
							time: "2:00 p.m.",
							label: "League of Giants",
							artists: "Hosts: Kid Lord x Scarly\nHead Judge: Arnold Taborda"
						}
					]
				}
			]
		},
		{
			day: "Domingo 22",
			venue: E1060,
			groups: [
				{
					heading: "The Biggest Workshop (Internacionales)",
					items: [
						{ time: "9:00 a.m.", label: "Tallerista internacional", artists: "Clay Boonthanakit (IDL)" },
						{ time: "10:30 a.m.", label: "Tallerista internacional", artists: "Josh Price (Jam Republic)" },
						{ time: "12:00 m.", label: "Tallerista internacional", artists: "Latrice Kabamba (Jam Republic)" }
					]
				},
				{
					heading: "Battle of Giants",
					items: [
						{ time: "2:00 p.m.", label: "Inscripciones" },
						{
							time: "4:00 p.m.",
							label: "Inicio de batallas",
							artists:
								"Hosts: Kid Lord x Scarly\nDJs: Brah x DFour x Kid Boneless\nJueces: Geiker Lock, Blady y Sad 69"
						}
					]
				}
			]
		}
	];
</script>

<!-- Card titles: Polymath, one word per line unless the text sets its own
     breaks with \n (DisplayText draws the accents) -->
{#snippet cardTitle(text: string)}
	<h3 class="dc__title">
		{#each text.split(text.includes("\n") ? "\n" : " ") as word}<span><DisplayText text={word} lower /></span>{/each}
	</h3>
{/snippet}

<svelte:head>
	<title>Cali Capital Fest 2026</title>
	<meta
		name="description"
		content="Cali Capital Fest 2026 — Festival Internacional de Danza Urbana. Noviembre 2026, Cali, Colombia."
	/>
</svelte:head>

<Hero />
<ScrollHint />

<!--
	Section icon placement.

	Every icon sits absolutely on the centre of the same fixed square box, so
	each Section spells out all four knobs to nudge it on its own:
	  iconSize            icon width as a fraction of the box width
	                      (defaults balance the icons' visible area, so a tall
	                      mic and a wide star read about the same size)
	  iconX / iconY       offset of the icon's centre, percent of the box
	  iconRotate          degrees, around the icon's own centre
	bgColor is the section's accent colour (kicker, tables, buttons, cards).
-->

<!-- Apartado 1 · El Festival -->
<Section
	id="acerca"
	kicker="Acerca del"
	title="Festival"
	icon="icon-mic.png"
	bgColor="#ff1f5f"
	iconSize={0.68}
	iconRotate={0}
	iconX={0}
	iconY={0}
>
	<div class="u-prose" style="margin-bottom:2.5rem">
		<p>
			Cali Capital es la <u>plataforma internacional</u> que conecta a Colombia con las
			industrias artísticas, creativas y culturales de Corea del Sur y Estados
			Unidos, y se llevará a cabo del 17 al 22 de noviembre de 2026, en tres
			momentos:
		</p>
	</div>

	<Carousel>
		{#each momentos as m}
			<article
				class="dc dc--desc"
				style:--accent={m.bg}
				style:--title-fg={m.titleFg}
				style:--panel-fg={m.panelFg}
				style:--fill-bg={m.panelBg}
			>
				<div class="dc__in">
					{@render cardTitle(m.title)}
					<p class="dc__panel">
						<span
							><strong>{m.lead}</strong> {m.body}{#if m.prize}{" "}<strong>{m.prize}</strong> (TyC).{/if}</span
						>
					</p>
				</div>
			</article>
		{/each}
	</Carousel>
</Section>

<!-- Apartado 3 · Paquetes -->
<Section
	id="paquetes"
	kicker="Boletería"
	title="Paquetes"
	icon="icon-notes.png"
	bgColor="#acff00"
	accentFg="#000101"
	iconSize={0.99}
	iconRotate={0}
	iconX={0}
	iconY={0}
>
	<Carousel>
		{#each pases as p}
			{@const sale = saleState(p, now)}
			<article class="dc dc--pass" style:--accent={p.bg} style:--accent-fg={p.fg} data-track-card={p.name}>
				<div class="dc__in">
					{@render cardTitle(p.name)}
					<p class="dc__lead"><strong>{p.lead}</strong><span>{p.sub}</span></p>
					<!-- prices are shown outright; only the promo pass keeps its reveal cover -->
					<p class="dc__price" aria-hidden={p.promo && !revealed[p.name]}>{p.price}</p>
					{#if p.promo}
						<button
							type="button"
							class="dc__reveal"
							class:is-open={revealed[p.name]}
							disabled={revealed[p.name]}
							data-track="Revelar precio"
							onclick={() => (revealed[p.name] = true)}
						>
							Revelar Precio!
						</button>
					{/if}
					{#if p.href && sale === "open"}
						<a class="dc__buy" href={p.href} target="_blank" rel="noopener" data-track="Comprar">Comprar</a>
					{:else}
						<span class="dc__buy" aria-disabled={sale !== "open"} data-track="Comprar (no disponible)">Comprar</span>
					{/if}
					{#if sale !== "open"}
						<!-- covers COMPRAR (and takes its clicks) before the window opens / after it closes -->
						<div class="dc__closed" data-track="Comprar (no disponible)">
							<span>{sale === "soon" ? "No Disponible Aún" : "No disponible"}</span>
						</div>
					{/if}
					{#if p.promo}
						<p class="dc__when">La oferta termina en</p>
						<div class="dc__pill dc__pill--countdown">
							<Countdown target={p.until ?? FAITH_ENDS} />
						</div>
						<p class="dc__fine">Solo 15 cupos disponibles</p>
					{:else}
						<p class="dc__when">Disponible desde el</p>
						<p class="dc__pill">{p.from}</p>
					{/if}
				</div>
			</article>
		{/each}
		<!-- white card, dark "multiply" date box, as in the design -->
		<article
			class="dc dc--pass dc--wide"
			data-track-card="Clases Sueltas"
			style:--accent="#ffffff"
			style:--accent-fg="#000101"
			style:--pill-fg="#ffffff"
			style:--fill-bg="#000101"
			style:--fill-blend="multiply"
			style:--fill-opacity="0.67"
		>
			<!-- wider than a pass card for the COMPRAR column; .dc__base keeps the
			     pass card's units so the text matches the other cards (2026-cards.css) -->
			<div class="dc__in">
				<div class="dc__base">
					<div class="dc__pad">
						{@render cardTitle("Clases Sueltas")}
						<div class="dc__rows">
							<span class="dc__head dc__head--col">Nivel</span>
							<span class="dc__head dc__head--col">Inversión</span>
							<span class="dc__head dc__head--col"></span>
							{#each clasesSueltas.rows as row, i}
								<span class="dc__k">{row.nivel}</span>
								<span class="dc__v">{row.precio}</span>
								{#if row.href && clasesSale === "open"}
									<a
										class="dc__buy"
										style:--buy-dur={BUY_BEATS[i].dur}
										style:--buy-delay={BUY_BEATS[i].delay}
										href={row.href} target="_blank" rel="noopener" data-track="Comprar {row.nivel}"
										>Comprar</a
									>
								{:else}
									<span
										class="dc__buy"
										style:--buy-dur={BUY_BEATS[i].dur}
										style:--buy-delay={BUY_BEATS[i].delay}
										aria-disabled={clasesSale !== "open"}
										data-track="Comprar (no disponible)">Comprar</span
									>
								{/if}
							{/each}
							{#if clasesSale !== "open"}
								<!-- one cover over the three buttons, as on the passes -->
								<div class="dc__closed" data-track="Comprar (no disponible)">
									<span>{clasesSale === "soon" ? "No Disponible Aún" : "No disponible"}</span>
								</div>
							{/if}
						</div>
					</div>
					<p class="dc__when">Disponible desde el</p>
					<p class="dc__pill">{clasesSueltas.from}</p>
				</div>
			</div>
		</article>
		<article class="dc dc--pass dc--bonos" data-track-card="Bonos de Ingreso" style:--accent={BRAND.yellow.bg} style:--accent-fg="#000101">
			<div class="dc__in">
				{@render cardTitle("Bonos de\nIngreso")}
				<div class="dc__rows">
					<span class="dc__head dc__head--col">Evento</span>
					<span class="dc__head dc__head--col">Aporte</span>
					{#each bonos.rows as row}
						<span class="dc__k"><strong>{row.dia}</strong>{row.evento}</span><span class="dc__v"
							>{row.aporte}</span
						>
					{/each}
				</div>
				<p class="dc__when">Disponible desde el</p>
				<p class="dc__pill">{bonos.from}</p>
			</div>
		</article>
	</Carousel>
	<p class="card__note paquetes-note">Aplican TyC | No se hacen reembolsos</p>
</Section>

<!-- Apartado 4 · League of Giants -->
<Section
	id="league"
	kicker="Competencia"
	title="League of Giants"
	icon="deco-asterisk.png"
	bgColor="#fed000"
	accentFg="#000101"
	iconSize={0.8}
	iconRotate={0}
	iconX={0}
	iconY={0}
>
	<div class="u-prose">
		<p><strong>Categorías:</strong> K-pop Dance Cover y Street Dance</p>
		<p style="margin-top:1rem">
			Aquí es donde traes lo mejor de ti para llevarte hasta $10.000.000 COP
			(Aplican TyC) por cada categoría. Recuerda leer muy bien el reglamento
			para evitar sorpresas.
		</p>
	</div>

	<article class="dc dc--form sub" style:--accent={BRAND.magenta.bg} style:--accent-fg="#ffffff">
		<div class="dc__in">
			{@render cardTitle("Inscripción")}
			<div class="dc__rows">
				<span class="dc__head">Opción</span>
				{#each leagueInscripcion as row}
					<span class="dc__k">{row.opcion}</span><span class="dc__v">{row.precio}</span>
				{/each}
			</div>
			<div class="dc__btns">
				{#each leagueBotones as b}
					<a
						class="dc__btn"
						href={b.href}
						target={b.external ? "_blank" : undefined}
						rel={b.external ? "noopener" : undefined}>{b.label}</a
					>
				{/each}
			</div>
		</div>
	</article>
</Section>

<!-- Apartado 5 · Battles of Giants -->
<Section
	id="battles"
	kicker="Competencia"
	title="Battles of Giants"
	icon="deco-splat.png"
	bgColor="#ff46d4"
	accentFg="#000101"
	iconSize={0.88}
	iconRotate={0}
	iconX={0}
	iconY={0}
>
	<div class="u-prose">
		<p>
			Battles of Giants es el espacio donde construimos cultura a través de las batallas de
			freestyle. Aquí se reúne la comunidad de street dance del suroccidente colombiano, que
			siempre ha sido la protagonista de este evento.
		</p>
		<p style="margin-top:1rem">
			Dos categorías, Soul Train y 80's Battles, y un premio de $1.500.000 COP para el primer
			puesto de cada una.
		</p>
		<p style="margin-top:1rem">Ven y hagamos de Cali una capital del arte urbano</p>
	</div>

	<!-- no design for this one; same card as League's, in the Battle card's lime -->
	<article class="dc dc--form sub" style:--accent={BRAND.lime.bg} style:--accent-fg="#000101">
		<div class="dc__in">
			{@render cardTitle("Inscripción")}
			<div class="dc__rows">
				<span class="dc__head">Opción</span>
				{#each battlesInscripcion as row}
					<span class="dc__k">{row.opcion}</span><span class="dc__v">{row.precio}</span>
				{/each}
			</div>
			<!-- Reglamento button hidden for now; the page stays at /battles/reglamento
			<div class="dc__btns">
				<a class="dc__btn" href="{base}/battles/reglamento">Reglamento</a>
			</div>
			-->
		</div>
	</article>

	<h3 class="u-label sub">Categorías</h3>
	<div class="u-prose">
		<p><strong>Soul Train:</strong> Locking, Popping, Breaking y Whacking (Punking).</p>
		<p style="margin-top:0.5rem">
			<strong>80's Battles:</strong> Hip Hop Dance, House Dance, Krumping, Dancehall, Afro Dance, Electro Dance.
		</p>
		<p class="card__note" style="margin-top:0.75rem">
			<strong>Aclaración:</strong> los estilos funk no pueden participar en 80's Battles, y los
			estilos de 80's no pueden participar en Soul Train.
		</p>
	</div>
</Section>

<!-- Apartado 6 · Agenda -->
<Section
	id="cronograma"
	kicker="Programación"
	title="Agenda"
	icon="icon-calendar.png"
	bgColor="#00e7ff"
	accentFg="#000101"
	iconSize={0.7}
	iconRotate={0}
	iconX={0}
	iconY={0}
>
	<div class="cronograma">
		{#each cronograma as d, i}
			{@const c = pick(COLORS.cronograma, i)}
			<article class="dc dc--day" style:--accent={c.bg} style:--accent-fg={c.fg}>
				<div class="dc__in">
					{@render cardTitle(d.day)}
					<p class="dc__venue">
						{#if d.venue.href}<a href={d.venue.href} target="_blank" rel="noopener">📍 {d.venue.name}</a>{:else}{d.venue.name}{/if}
					</p>
					{#each d.groups as g}
						{#if g.heading}<p class="dc__group">{g.heading}</p>{/if}
						{#if g.venue}<p class="dc__venue"><a href={g.venue.href} target="_blank" rel="noopener">📍 {g.venue.name}</a></p>{/if}
						<ul class="dc__agenda">
							{#each g.items as it}
								<li>
									<span class="dc__time">{it.time}</span>
									<span>{it.label}{#if it.artists}<small class="dc__artists">{it.artists}</small>{/if}</span>
								</li>
							{/each}
						</ul>
					{/each}
				</div>
			</article>
		{/each}
	</div>
</Section>

<!-- Apartado 7 · Apoyan (logos de aliados y patrocinadores) -->
<Section
	id="apoyan"
	kicker="Aliados"
	title="Apoyan"
	icon="deco-squiggle.png"
	bgColor="#ff1f5f"
	iconSize={1.1}
	iconRotate={0}
	iconX={0}
	iconY={0}
/>

<style>
	/* no slider for the schedule in the document: every day is visible at
	   once. The day cards are .dc--day (2026-cards.css). */
	.dc__venue {
		margin: 0 0 0.6rem;
		font-size: 0.85em;
		font-weight: 700;
	}
	.dc__venue a {
		text-decoration: underline;
	}
	.dc__artists {
		display: block;
		font-size: 0.85em;
		font-weight: 400;
		white-space: pre-line;
		opacity: 0.85;
	}
	.cronograma {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
		gap: 1rem;
	}

	/* Faith Pass: the countdown fills the date box, in the box's own type */
	.dc__pill--countdown :global(.countdown) {
		gap: 3cqi;
	}
	.dc__pill--countdown :global(.countdown__unit) {
		min-width: 0;
		padding: 0;
		border: 0;
		flex-direction: row;
		align-items: baseline;
		gap: 0.6cqi;
	}
	.dc__pill--countdown :global(.countdown__n) {
		font-family: inherit;
		font-weight: 800;
		font-size: 6.4cqi;
		letter-spacing: -0.025em;
	}
	.dc__pill--countdown :global(.countdown__l) {
		margin: 0;
		font-size: 3.6cqi;
		letter-spacing: 0;
		opacity: 0.7;
	}

	/* the document's sub-headings (Categorías) and the Inscripción cards */
	.sub {
		margin: 2rem 0 0.75rem;
	}

	/* Battles' "Aclaración" */
	/* :global(.site-2026) outranks the prose size in 2026.css */
	:global(.site-2026) .card__note {
		margin-top: 0.5rem;
		font-size: calc(var(--body-text) * 0.85);
		opacity: 0.75;
	}
	.paquetes-note {
		margin-top: 1rem;
		text-align: center;
	}
</style>
