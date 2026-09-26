<script lang="ts">
	import { base } from "$app/paths";
	import DisplayText from "$lib/components/2026/DisplayText.svelte";
	import Reglamento from "$lib/components/2026/Reglamento.svelte";

	// Text from temp/Reglamento LOG 2026.docx. Editorial fixes against the
	// document: the "[PROPUESTA]" draft markers (3.1, 11.7) are left out,
	// 17.7, which appears twice, keeps only its complete second version, and
	// 12.2 drops its "Salida tardía" row, which contradicted 7.6.

	const articulos = [
		"Presentación y propósito",
		"Componente deportivo",
		"Definiciones y glosario",
		"Modalidades y conformación de equipos",
		"Registro, inscripción, pagos y acreditación",
		"Roster y orden de presentación",
		"Formato de competencia y tiempos",
		"Escenario, zonas y requerimientos técnicos",
		"Música",
		"Vestuario, utilería, elementos prohibidos y contenido en escena",
		"Criterios de calificación y panel de jueces",
		"Tabla de deducciones",
		"Causales de descalificación",
		"Falla técnica, lesión y protocolos",
		"Desempate",
		"Resultados y reclamaciones",
		"Premiación y condiciones de pago",
		"Conducta",
		"Material audiovisual, datos personales y marca",
		"Consideración final y aceptación del reglamento"
	];

	const datosGenerales: [string, string][] = [
		["Competencia", "League of Giants 2026 (en adelante, LOG)"],
		[
			"Festival",
			"Cali Capital 2026, Festival Internacional de Arte, Deporte y Cultura. Del 17 al 22 de noviembre de 2026"
		],
		["Fecha de la competencia", "Sábado 21 de noviembre de 2026"],
		["Ciudad y lugar", "Santiago de Cali. Unidad Deportiva Jaime Aparicio."],
		["Modalidades", "Street Dance | Performance y Kpop Dance Cover (DC)"],
		["Formato", "Ronda única. Todos contra todos, sin división por edad"],
		["Inscripciones", "Del 25 de septiembre al 19 de noviembre de 2026, en www.calicapitalfest.com"],
		["Organiza", "Corporación para el Arte, el Deporte y la Cultura - The Giants Community."],
		["Correo oficial", "calicapitalfest@thegiantsco.com"]
	];

	const glosario: [string, string][] = [
		["Acreditación", "Verificación presencial de la identidad de cada depo-artista contra el roster registrado. Se hace el día de la competencia, antes de salir a escena."],
		["Acrobacia", "Movimiento de destreza gimnástica o de riesgo que hace un depo-artista solo o con otros, como mortales, saltos con rotación, power moves, elevaciones, portes y lanzamientos."],
		["Acrobacia mal ejecutada", "Acrobacia que termina en caída, o que entorpece el desarrollo del repertorio porque obliga a detener, repetir o recomponer una secuencia, o porque rompe de forma visible la formación o la sincronía del grupo."],
		["Caída", "Pérdida de control no intencional que lleva a un depo-artista al piso o lo obliga a apoyar las manos, las rodillas u otra parte del cuerpo para no llegar a él. Incluye la caída desde una elevación. El apoyo en el piso que hace parte de la coreografía no es caída."],
		["Canales oficiales", "El correo calicapitalfest@thegiantsco.com y el sitio www.calicapitalfest.com. Para el taller internacional, también la cuenta oficial de Instagram del festival: @calicapitalfest"],
		["Categoría", "Cada una de las dos modalidades de competencia. En este reglamento, categoría y modalidad significan lo mismo."],
		["Contenido sexualmente explícito", "Movimiento, gesto, imagen, texto o letra que simula o describe un acto sexual."],
		["Coordinador de escenario", "Persona de la organización que dirige el paso de los equipos por las zonas del evento y su salida a escena."],
		["Cronometrista", "Persona designada por la organización para tomar el tiempo de cada presentación."],
		["Dance break", "Segmento de coreografía original que un equipo de Kpop Dance Cover (DC) agrega al cover."],
		["Deducción", "Puntos que se restan de la puntuación final por una infracción. Sus valores están en el artículo 12."],
		["Depo-artista", "Persona que compite en LOG como integrante del roster de un equipo."],
		["Descalificación", "Pérdida del derecho a figurar en la clasificación y a recibir premio. Sus causales están en el artículo 13."],
		["Director", "Persona mayor de edad que inscribe al equipo, lo representa ante la organización y responde por él. Es la única persona autorizada para presentar reclamaciones y para escoger la opción de pago del premio."],
		["Director del Evento", "Persona designada por la organización para dirigir la producción de LOG."],
		["Dominio", "Cada una de las tres áreas de evaluación: A, B y C. Cada dominio lo califica un juez distinto."],
		["Equipo", "Grupo de depo-artistas registrados en el roster de una categoría, junto con su director."],
		["Falla técnica de la organización", "Interrupción causada por un elemento a cargo de la organización: sonido, reproducción de una pista distinta a la enviada, iluminación, escenario, energía eléctrica, o la entrada de personas u objetos ajenos al equipo a la zona de competencia."],
		["Gesto obsceno", "Gesto con un significado ofensivo o sexual reconocido, como mostrar el dedo medio, tocarse o señalarse los genitales de forma explícita o simular un acto sexual."],
		["Inscripción en firme", "Inscripción que cumple los dos requisitos del numeral 5.8: formulario enviado y primer pago realizado."],
		["Juez de mesa", "Cada uno de los tres jueces que califican un dominio."],
		["Juez Principal", "Autoridad de la competencia. No califica. Supervisa la evaluación, aplica las deducciones y resuelve lo no previsto."],
		["Movimiento coreográfico", "Todo movimiento que hace parte del repertorio. La entrada al escenario y el desplazamiento hasta la posición inicial no lo son."],
		["Organización", "Corporación para el Arte, el Deporte y la Cultura, The Giants Community, organizadora de Cali Capital y de LOG."],
		["Personal de salud del evento", "Personal de atención médica o de primeros auxilios que la organización dispone durante la competencia."],
		["Presentación", "La actuación de un equipo en la zona de competencia, desde su primer sonido o movimiento coreográfico hasta el último."],
		["Repertorio", "La coreografía completa que el equipo presenta en escena."],
		["Roster", "Lista oficial de los depo-artistas de un equipo, registrada en la inscripción."],
		["Utilería", "Todo objeto que el equipo lleva a escena y que no hace parte del vestuario."],
		["Vestuario obsceno", "El que deja al descubierto la zona genital, los glúteos o los pezones, o el que lleva imágenes, textos o mensajes sexualmente explícitos u ofensivos."],
		["Vestuario revelador", "El que deja a la vista zonas amplias del cuerpo, como abdomen, espalda, hombros o piernas, sin incurrir en obscenidad. Está permitido."]
	];

	type Criterio = [string, number, string];
	const criteriosStreet: { dominio: string; items: Criterio[] }[] = [
		{
			dominio: "Dominio A. Técnica (40 puntos). Juez de Técnica",
			items: [
				["Ejecución y sincronización", 10, "Precisión de cada movimiento, claridad de líneas, control muscular y ausencia de errores, a nivel individual y grupal. Contempla el mantenimiento de la potencia muscular y el rendimiento físico durante todo el repertorio."],
				["Dificultad y factor de riesgo", 10, "Complejidad de los movimientos: power moves, acrobacias, trucos y secuencias técnicas. Premia el componente atlético y el riesgo asumido."],
				["Vocabulario y estilo", 10, "Amplitud y autenticidad de los estilos presentados, con clara distinción y ejecución correcta. Premia la versatilidad y el conocimiento de la cultura."],
				["Control corporal y dinámicas", 10, "Manejo de tensión y relajación, cambios de velocidad, estabilidad y capacidad de encarnar las texturas de la música."]
			]
		},
		{
			dominio: "Dominio B. Composición coreográfica (30 puntos). Juez de Composición Coreográfica",
			items: [
				["Creatividad y originalidad", 10, "Creatividad de las secuencias y singularidad de la propuesta. La imitación o el abuso de pasos de moda sin intención clara bajan la calificación de este criterio."],
				["Musicalidad", 10, "Relación entre movimiento y música más allá de bailar a tiempo: resaltar la instrumentación, interpretar la letra o encarnar el ánimo de la pista."],
				["Uso del escenario", 10, "Uso del espacio, claridad y creatividad de formaciones y transiciones, y dinamismo entre planos y niveles."]
			]
		},
		{
			dominio: "Dominio C. Espectacularidad (30 puntos). Juez de Espectacularidad",
			items: [
				["Presencia escénica", 10, "Energía, proyección, confianza, carisma y expresión corporal, individual y grupal."],
				["Concepto e interpretación", 10, "Idea, tema o historia de la propuesta y la eficacia con que se comunica. Incluye la respuesta emocional de la audiencia."],
				["Presentación visual y estética", 10, "Vestuario, peinado, maquillaje, accesorios y utilería, y qué tanto apoyan el concepto de la propuesta."]
			]
		}
	];

	const criteriosKpop: { dominio: string; items: Criterio[] }[] = [
		{
			dominio: "Dominio A. Fidelidad y ejecución del cover (40 puntos). Juez de Técnica",
			items: [
				["Precisión coreográfica", 10, "Exactitud en la réplica de la coreografía original, con sus detalles y matices, incluidos vestuario y maquillaje."],
				["Sincronización y formaciones", 10, "Unidad del grupo en el movimiento y precisión en las transiciones de formación."],
				["Ejecución técnica del movimiento", 10, "Calidad y limpieza del movimiento, control corporal, dinámicas y correcta ejecución de los pasos del cover. Contempla el mantenimiento de la potencia muscular y el rendimiento físico durante todo el repertorio."],
				["Lip-sync y expresión facial", 10, "Credibilidad y precisión de la sincronización de labios, y expresiones acordes con la emoción de la canción y del artista original."]
			]
		},
		{
			dominio: "Dominio B. Composición coreográfica (30 puntos). Juez de Composición Coreográfica",
			items: [
				["Transiciones y formaciones", 10, "Fluidez y dinamismo en las transiciones y formaciones."],
				["Puesta en escena y uso del escenario", 10, "Entradas, salidas, desplazamientos y cambios de nivel."],
				["Musicalidad e interpretación sonora", 10, "Conexión con la música, acentos rítmicos y expresión de la melodía y la emoción de la canción."]
			]
		},
		{
			dominio: "Dominio C. Impacto escénico (30 puntos). Juez de Espectacularidad",
			items: [
				["Presencia escénica y personificación", 15, "Confianza, energía y personalidad grupal e individual. Credibilidad de la actuación."],
				["Conexión con la audiencia", 15, "Capacidad de conectar, interactuar y cautivar al público con una experiencia memorable."]
			]
		}
	];

	const deducciones: { grupo: string; items: [string, string, string][] }[] = [
		{
			grupo: "Tiempo",
			items: [
				["Cada segundo por fuera del margen de más o menos 5 segundos, del segundo 1 al 5", "-0,2 por segundo", "7.3"],
				["Cada segundo por fuera del margen, del segundo 6 al 10", "-0,5 por segundo, sumado al anterior", "7.3"],
				["Más de 10 segundos por fuera del margen", "-3,5", "13.2"]
			]
		},
		{
			grupo: "Música y contenido en escena",
			items: [
				["Groserías o lenguaje soez en la pista, por cada ocurrencia", "-1,0", "9.5"],
				["Gesto obsceno o contenido sexualmente explícito, por cada ocurrencia", "-3,0", "10.9"]
			]
		},
		{
			grupo: "Kpop Dance Cover (DC)",
			items: [
				["Dance break de más de 45 segundos, o ubicado en más de un momento de la pieza", "-2,0", "7.7"],
				["Fusión con J-pop u otro género dentro del cover", "-2,0", "4.3"]
			]
		},
		{
			grupo: "Ejecución",
			items: [
				["Caída", "-1,0", "3.1 y 12.5"],
				["Acrobacia mal ejecutada", "-1,0", "10.11"]
			]
		},
		{
			grupo: "Utilería y elementos prohibidos",
			items: [
				["Utilería no aprobada", "-1,0", "10.4"],
				["Fuego, pirotecnia, animales vivos o sustancias prohibidas en el escenario (purpurina, líquidos, polvos, aceite)", "-1,0 y pago de los costos de limpieza", "10.6"],
				["Elemento que simule un arma, como pistola, cuchillo o espada, u objeto que incite a la violencia", "-1,0", "10.6"],
				["Exceder el tiempo de montaje o de desmontaje", "-1,0", "10.5"]
			]
		},
		{
			grupo: "Vestuario",
			items: [
				["Vestuario obsceno", "-3,0", "10.1"],
				["Calzado no permitido", "-1,0", "10.2"],
				["Logos de patrocinadores en el vestuario de escena", "-0,5", "10.3"]
			]
		},
		{
			grupo: "Conducta del equipo o del director",
			items: [
				["Falta leve", "Amonestación escrita, sin descuento de puntos", "18.4"],
				["Falta grave", "-5,0", "18.4"],
				["Falta gravísima", "Descalificación", "13.1"]
			]
		}
	];

	// Anexo 1: the judges' blank score sheets, shown as criterion + maximum
	const hojas: { titulo: string; criterios: [string, number][]; total: number; firma: string }[] = [
		{ titulo: "Hoja 1. Dominio A: Técnica. Street Dance | Performance", criterios: [["Ejecución y sincronización", 10], ["Dificultad y factor de riesgo", 10], ["Vocabulario y estilo", 10], ["Control corporal y dinámicas", 10]], total: 40, firma: "Juez de Técnica" },
		{ titulo: "Hoja 2. Dominio B: Composición coreográfica. Street Dance | Performance", criterios: [["Creatividad y originalidad", 10], ["Musicalidad", 10], ["Uso del escenario", 10]], total: 30, firma: "Juez de Composición Coreográfica" },
		{ titulo: "Hoja 3. Dominio C: Espectacularidad. Street Dance | Performance", criterios: [["Presencia escénica", 10], ["Concepto e interpretación", 10], ["Presentación visual y estética", 10]], total: 30, firma: "Juez de Espectacularidad" },
		{ titulo: "Hoja 4. Dominio A: Fidelidad y ejecución del cover. Kpop Dance Cover (DC)", criterios: [["Precisión coreográfica", 10], ["Sincronización y formaciones", 10], ["Ejecución técnica del movimiento", 10], ["Lip-sync y expresión facial", 10]], total: 40, firma: "Juez de Técnica" },
		{ titulo: "Hoja 5. Dominio B: Composición coreográfica. Kpop Dance Cover (DC)", criterios: [["Transiciones y formaciones", 10], ["Puesta en escena y uso del escenario", 10], ["Musicalidad e interpretación sonora", 10]], total: 30, firma: "Juez de Composición Coreográfica" },
		{ titulo: "Hoja 6. Dominio C: Impacto escénico. Kpop Dance Cover (DC)", criterios: [["Presencia escénica y personificación", 15], ["Conexión con la audiencia", 15]], total: 30, firma: "Juez de Espectacularidad" }
	];
</script>

<svelte:head>
	<title>Reglamento League of Giants 2026 · Cali Capital Fest</title>
	<meta
		name="description"
		content="Reglamento oficial de competencia de League of Giants 2026: Street Dance | Performance y Kpop Dance Cover (DC)."
	/>
</svelte:head>

{#snippet articulo(n: number)}
	<header class="art__head">
		<p class="art__num">Artículo {n}</p>
		<h2 class="font-display art__title"><DisplayText text={articulos[n - 1]} /></h2>
	</header>
{/snippet}

{#snippet volver()}
	<p class="art__back"><a href="#contenido">↑ Volver al contenido</a></p>
{/snippet}

<Reglamento
	back={{ href: `${base}/#league`, label: "League of Giants" }}
	title="League of Giants 2026"
	subs={[
		"Street Dance | Performance y Kpop Dance Cover (DC)",
		"Competencia de grupos del festival Cali Capital 2026"
	]}
>

		<section class="box" aria-labelledby="datos">
			<h2 id="datos" class="box__title">Datos generales</h2>
			<dl class="kv">
				{#each datosGenerales as [k, v]}
					<dt>{k}</dt>
					<dd>{v}</dd>
				{/each}
			</dl>
		</section>

		<p>
			Este documento es el reglamento oficial de League of Giants 2026, la competencia de grupos del
			festival Cali Capital 2026. Fija las condiciones de inscripción, las reglas de competencia, el
			sistema de calificación y los procedimientos que se aplican antes, durante y después de la
			competencia.
		</p>
		<p>
			Su cumplimiento es obligatorio para todos los equipos, sus depo-artistas y sus directores. Cada
			regla se cita por su artículo y su numeral. Por ejemplo, la tabla de deducciones es el numeral
			12.2.
		</p>

		<nav id="contenido" class="toc" aria-labelledby="toc-title">
			<h2 id="toc-title" class="box__title">Contenido</h2>
			<ol>
				{#each articulos as a, i}
					<li><a href="#articulo-{i + 1}"><span class="toc__n">{i + 1}.</span> {a}</a></li>
				{/each}
				<li><a href="#anexo-1"><span class="toc__n">Anexo 1.</span> Hojas de puntuación</a></li>
			</ol>
		</nav>

		<!-- 1 -->
		<section id="articulo-1" class="art">
			{@render articulo(1)}
			<p>
				<b>1.1. Propósito.</b> League of Giants (LOG) es la competencia de grupos de Cali Capital, festival
				juvenil de danza urbana y cultura urbana con alcance internacional. Su propósito es fortalecer
				los escenarios de circulación artística del suroccidente colombiano y consolidar una plataforma
				donde el talento colombiano pueda mostrarse a nivel internacional y donde cada vez más artistas
				encuentren oportunidades a través del arte, tomando el deporte como eje de evolución.
			</p>
			<p>
				<b>1.2. Misión.</b> LOG promueve el crecimiento de la danza de competencia en Street Dance y en Kpop
				Dance Cover, en un entorno donde la integridad, la innovación y el desarrollo artístico son los
				pilares. Es una plataforma de excelencia competitiva y, a la vez, un impulso para el crecimiento
				de los depo-artistas, con herramientas de evaluación que estimulan la maestría técnica y la
				creatividad.
			</p>
			<p>
				LOG es también una vitrina de propuestas artísticas en formato espectáculo, pensada para generar
				interés e interacción entre empresarios, industrias creativas, promotores, festivales y los
				artistas, coreógrafos, líderes y directores de agrupaciones.
			</p>
			<p>
				<b>1.3. Pilares de Cali Capital.</b> El festival trabaja sobre cinco pilares: formación, circulación
				artística, emprendimiento, internacionalización y la línea ambiental Cali Capital +verde. LOG se
				conecta con cada uno. Forma a través de la retroalimentación escrita de los jueces, hace circular
				a los equipos frente al público y los programadores, abre oportunidades de trabajo para las
				agrupaciones, proyecta el talento local hacia escenarios internacionales y aplica prácticas
				responsables con el entorno en las zonas del evento (numeral 8.8).
			</p>
			<p><b>1.4. Valores.</b></p>
			<ol class="alpha">
				<li><b>Objetividad:</b> la evaluación se basa en criterios medibles, definidos antes de la competencia.</li>
				<li><b>Equidad:</b> todos los equipos compiten bajo las mismas reglas, aplicadas de la misma forma.</li>
				<li><b>Arte:</b> se valoran la creatividad, la originalidad y la capacidad de comunicar una idea en formato espectáculo.</li>
				<li><b>Técnica:</b> se reconocen la ejecución, la dificultad, la autenticidad y la esencia de cada estilo como base de todo gran espectáculo.</li>
				<li><b>Crecimiento profesional:</b> cada equipo recibe la retroalimentación escrita de los jueces para identificar sus fortalezas y lo que debe mejorar.</li>
			</ol>
			<p>
				<b>1.5. Compromiso LOG.</b> Al inscribirse, el equipo y su director se suscriben al Compromiso LOG:
				mantener un entorno positivo, respetuoso y seguro para todas las personas del evento. Este
				compromiso prohíbe el acoso, la conducta antideportiva, la deshonestidad y la falta de respeto
				hacia jueces, personal de la organización, otros equipos y público. Su incumplimiento se
				sanciona según el artículo 18.
			</p>
			{@render volver()}
		</section>

		<!-- 2 -->
		<section id="articulo-2" class="art">
			{@render articulo(2)}
			<p>
				<b>2.1. La danza en el panorama deportivo.</b> LOG busca impulsar la danza urbana y el Kpop Dance
				Cover dentro del panorama deportivo nacional e internacional. Por eso la competencia funciona con
				la estructura de una disciplina deportiva: reglamento público, jueces especializados, sistema de
				puntuación con pesos definidos, tabla de deducciones con valores exactos y un procedimiento de
				reclamaciones con responsable, plazo y canal.
			</p>
			<p>
				<b>2.2. El depo-artista.</b> En LOG compiten depo-artistas: personas que unen la preparación física
				y la disciplina de un deportista con la sensibilidad y la intención de un artista. Este
				reglamento usa ese término, sin variaciones, para referirse a todos los participantes.
			</p>
			<p>
				<b>2.3. Exigencia física.</b> La preparación física hace parte de lo que se evalúa. El Juez de
				Técnica califica el rendimiento físico del equipo, es decir, su capacidad de sostener el nivel de
				la presentación durante todo el repertorio. En la ejecución también cuenta el mantenimiento de
				la potencia muscular de principio a fin (numerales 11.4, 11.8 y 11.9).
			</p>
			{@render volver()}
		</section>

		<!-- 3 -->
		<section id="articulo-3" class="art">
			{@render articulo(3)}
			<p>
				<b>3.1. Términos.</b> En todo este reglamento, los términos de la tabla tienen el significado que se
				indica. Están en orden alfabético.
			</p>
			<dl class="glossary">
				{#each glosario as [t, d]}
					<div>
						<dt>{t}</dt>
						<dd>{d}</dd>
					</div>
				{/each}
			</dl>
			{@render volver()}
		</section>

		<!-- 4 -->
		<section id="articulo-4" class="art">
			{@render articulo(4)}
			<p>
				<b>4.1. Modalidades oficiales.</b> LOG tiene dos modalidades: Street Dance | Performance y Kpop
				Dance Cover (DC).
			</p>
			<div class="tbl">
				<table>
					<thead>
						<tr><th>Modalidad</th><th class="num">Mínimo de integrantes</th><th class="num">Máximo de integrantes</th></tr>
					</thead>
					<tbody>
						<tr><td>Street Dance | Performance</td><td class="num">7</td><td class="num">35</td></tr>
						<tr><td>Kpop Dance Cover (DC)</td><td class="num">7</td><td class="num">15</td></tr>
					</tbody>
				</table>
			</div>
			<p>
				<b>4.2. Street Dance | Performance.</b> Modalidad para exhibir la diversidad y el poder técnico y
				coreográfico de los estilos del Street Dance. La grandeza de un espectáculo está en su calidad
				técnica, escénica e interpretativa, no en la cantidad de depo-artistas.
			</p>
			<p>
				<b>4.3. Kpop Dance Cover (DC).</b> Modalidad que reconoce el fenómeno global del K-pop, con énfasis
				en la precisión, el rendimiento y la fidelidad del cover. Todos los covers son de K-pop. No se
				permiten fusiones con J-pop ni con otros géneros similares.
			</p>
			<p>
				<b>4.4. Todos contra todos.</b> Cada modalidad se compite en formato todos contra todos, sin
				división por edad, género o nivel de formación. La apuesta está en la excelencia de la
				presentación y no en la edad de quien la hace: en LOG la excelencia no tiene edad. Este formato
				permite a directores y coreógrafos armar sus equipos a partir del talento, la química y la visión
				artística, y abre la puerta a propuestas intergeneracionales.
			</p>
			<p>
				<b>4.5. Participación en las dos categorías.</b> Un depo-artista no puede competir en más de un
				equipo de la misma categoría. Sí puede competir en un equipo de cada categoría, con el pago de la
				categoría adicional (numeral 5.3).
			</p>
			<p>
				<b>4.6. Mínimo para salir a escena.</b> Para competir, el equipo debe contar con el mínimo de
				depo-artistas acreditados de su categoría: <b>7</b>. El equipo que no alcanza ese número no sale a
				escena (numeral 13.1).
			</p>
			<p>
				<b>4.7. Edad mínima.</b> LOG no establece una edad mínima para competir, siempre que el depo-artista
				demuestre estar en capacidad de asumir el compromiso que exige el escenario.
			</p>
			<p>
				<b>4.8. Responsabilidad sobre los menores de edad.</b> La integridad física y mental de cada menor
				de edad es responsabilidad total del director a cargo de su proceso, durante toda su permanencia
				en el evento.
			</p>
			<p>
				<b>4.9. Declaración del director.</b> LOG no exige formatos, anexos ni trámites adicionales para los
				menores de edad. Al inscribir al equipo, el director declara en el formulario:
			</p>
			<ol class="alpha">
				<li>que cada menor del roster está en capacidad de asumir el compromiso del escenario, y</li>
				<li>
					que cuenta con la autorización de los padres o acudientes de cada menor para su participación y
					para el uso de su imagen en los términos del artículo 19.
				</li>
			</ol>
			<p><b>4.10. Protección de menores.</b></p>
			<ol class="alpha">
				<li>
					En las zonas de calentamiento y preparación, los menores permanecen con su equipo y bajo el
					cuidado de su director.
				</li>
				<li>
					Cualquier situación de acoso, abuso o riesgo para un menor se informa de inmediato al personal de
					la organización, que toma las medidas del caso y, cuando corresponde, informa a las autoridades
					competentes.
				</li>
			</ol>
			{@render volver()}
		</section>

		<!-- 5 -->
		<section id="articulo-5" class="art">
			{@render articulo(5)}
			<p>
				<b>5.1. Canal de registro.</b> El registro se hace únicamente a través del formulario de Cali
				Capital Fest publicado en www.calicapitalfest.com. No se aceptan inscripciones por otros medios.
			</p>
			<p>
				<b>5.2. Periodo de inscripción.</b> Del <b>25 de septiembre</b> al <b>19 de noviembre de 2026</b>. Los
				plazos se aplican de forma estricta.
			</p>
			<p>
				<b>5.3. Valores de inscripción.</b> Se cobran por persona, es decir, por cada depo-artista del
				roster. Valores en pesos colombianos:
			</p>
			<div class="tbl">
				<table>
					<thead>
						<tr>
							<th>Concepto</th>
							<th class="num">Valor por persona</th>
							<th class="num">Primer pago (35 %)</th>
							<th class="num">Segundo pago (65 %)</th>
						</tr>
					</thead>
					<tbody>
						<tr><td>1 categoría</td><td class="num">$150.000</td><td class="num">$52.500</td><td class="num">$97.500</td></tr>
						<tr><td>Categoría adicional</td><td class="num">$80.000</td><td class="num">$28.000</td><td class="num">$52.000</td></tr>
						<tr><td>1 categoría con taller internacional incluido</td><td class="num">$250.000</td><td class="num">$87.500</td><td class="num">$162.500</td></tr>
					</tbody>
				</table>
			</div>
			<p class="note">
				El valor de $250.000 corresponde a los $150.000 de la inscripción más $100.000 por un taller
				internacional, según los términos y condiciones publicados.
			</p>
			<p>
				<b>5.4. Categoría adicional con taller.</b> Quien inscribe su primera categoría con taller incluido
				paga la categoría adicional por su valor de <b>$80.000</b>.
			</p>
			<p>
				<b>5.5. Pago en dos partes.</b> Un primer pago del <b>35 %</b> al momento de la inscripción y un
				segundo pago del <b>65 %</b> a más tardar el <b>19 de noviembre de 2026</b>. Quien se inscriba en los
				últimos días del periodo debe cubrir ambos pagos antes del cierre del <b>19 de noviembre</b>.
			</p>
			<p class="example">
				Ejemplo: un equipo de <b>10</b> depo-artistas en una sola categoría, sin taller, paga
				<b>$1.500.000</b>. Al inscribirse paga <b>$525.000</b> y, a más tardar el
				<b>19 de noviembre de 2026</b>, los <b>$975.000</b> restantes.
			</p>
			<p>
				<b>5.6. Medio de pago.</b> El pago se recibe únicamente por transferencia bancaria a la cuenta
				oficial del evento. No se reciben pagos en efectivo ni en otras cuentas.
			</p>
			<section class="box" aria-labelledby="cuenta">
				<h3 id="cuenta" class="box__title">Cuenta oficial del evento</h3>
				<dl class="kv">
					<dt>Banco</dt><dd>Bancolombia</dd>
					<dt>Tipo de cuenta</dt><dd>Ahorros</dd>
					<dt>Número</dt><dd class="mono">82100010485</dd>
					<dt>Titular</dt><dd>The Giants Community</dd>
					<dt>NIT</dt><dd class="mono">901.750.048</dd>
				</dl>
			</section>
			<p>
				<b>5.7. Soporte de pago.</b> El director carga el comprobante de cada pago en el formulario o lo
				envía al correo oficial con el asunto: <span class="subject">NOMBRE DEL EQUIPO | CATEGORÍA | PAGO 1</span>,
				o <span class="subject">PAGO 2</span> según corresponda.
			</p>
			<p>
				<b>5.8. Inscripción en firme y fecha de inscripción.</b> La inscripción queda en firme cuando el
				equipo ha enviado el formulario completo y ha hecho el primer pago. Para el orden de presentación
				(numeral 6.5) y el desempate (numeral 15.2), la fecha de inscripción es la fecha y hora en que se
				cumplió el último de esos dos requisitos, según el registro del formulario y el comprobante
				bancario.
			</p>
			<p>
				<b>5.9. Segundo pago no realizado.</b> El equipo que al cierre del <b>19 de noviembre de 2026</b> no
				ha completado el segundo pago no queda habilitado para competir. Lo pagado no se reembolsa
				(numeral 5.10).
			</p>
			<p><b>5.10. No reembolsos.</b> Bajo ninguna circunstancia se hacen reembolsos.</p>
			<p>
				<b>5.11. Taller internacional.</b> El taller internacional incluido en la inscripción se anuncia por
				la cuenta oficial de Instagram del festival: <b>@calicapitalfest</b>. Su cumplimiento se rige de
				manera estricta por lo publicado en esa cuenta.
			</p>
			<p>
				<b>5.12. Aceptación del reglamento.</b> Con el envío del formulario y el primer pago, el equipo y su
				director aceptan este reglamento (numeral 20.9).
			</p>
			<p>
				<b>5.13. Acreditación.</b> El día de la competencia, el director presenta a su equipo en la mesa de
				acreditación, donde la organización verifica la identidad de cada depo-artista contra el roster
				registrado. Horario de acreditación: <b>2 a 4 PM</b>
			</p>
			<p>
				<b>5.14. Documentos válidos.</b> Cada depo-artista presenta su documento de identidad original,
				físico o digital: cédula de ciudadanía, tarjeta de identidad, cédula de extranjería, Permiso por
				Protección Temporal o pasaporte. Los menores de <b>7</b> años pueden presentar copia del registro
				civil de nacimiento. No se aceptan fotocopias ni fotografías de los demás documentos.
			</p>
			<p>
				<b>5.15. Depo-artista no acreditado.</b> Quien no supera la acreditación no sale a escena. El equipo
				compite sin esa persona si conserva el mínimo de su categoría (numeral 4.6). Cada depo-artista
				acreditado recibe una manilla, que lleva puesta durante toda la competencia.
			</p>
			{@render volver()}
		</section>

		<!-- 6 -->
		<section id="articulo-6" class="art">
			{@render articulo(6)}
			<p>
				<b>6.1. Registro del roster.</b> Cada equipo registra la lista de sus integrantes al momento de la
				inscripción, con nombre completo, tipo y número de documento y fecha de nacimiento de cada
				depo-artista.
			</p>
			<p>
				<b>6.2. Cierre del roster.</b> La lista se cierra el <b>19 de noviembre de 2026</b>. Hasta esa fecha
				el director puede agregar o retirar depo-artistas, con el pago que corresponda a cada persona que
				agregue.
			</p>
			<p>
				<b>6.3. Cambios después del cierre.</b> Después del <b>19 de noviembre de 2026</b> no se admiten
				nuevos integrantes ni reemplazos. El equipo puede presentarse con menos depo-artistas de los
				registrados, siempre que cumpla el mínimo de su categoría. Lo pagado por un integrante que no se
				presente no se reembolsa.
			</p>
			<p>
				<b>6.4. Verificación en acreditación.</b> En acreditación se verifica la identidad de cada
				integrante contra la lista registrada. Solo sale a escena quien figura en el roster y fue
				acreditado.
			</p>
			<p>
				<b>6.5. Orden de presentación.</b> El orden de presentación se define por orden de inscripción: el
				primer equipo en inscribirse es el último en salir a escena, y el último en inscribirse es el
				primero.
			</p>
			<p>
				<b>6.6. Publicación del orden.</b> La organización publica por los canales oficiales el orden de las
				categorías y el orden de salida de cada una el día siguiente al cierre de inscripciones.
			</p>
			<p>
				<b>6.7. Depo-artistas en las dos categorías.</b> Cuando un mismo depo-artista compite en las dos
				categorías y sus equipos quedan en turnos consecutivos, el Juez Principal mueve el turno del
				segundo equipo para que queden al menos <b>2</b> turnos de por medio. Si la categoría no tiene turnos
				suficientes, se da un intervalo de <b>10 minutos</b> antes de esa salida.
			</p>
			{@render volver()}
		</section>

		<!-- 7 -->
		<section id="articulo-7" class="art">
			{@render articulo(7)}
			<p>
				<b>7.1. Ronda única.</b> El torneo se desarrolla en una única etapa. Cada equipo se presenta una sola
				vez y esa presentación define su puntuación y su lugar en la clasificación. No hay ronda
				clasificatoria.
			</p>
			<p>
				<b>7.2. Tiempo de la presentación.</b> Tanto en Street Dance | Performance como en Kpop Dance Cover
				(DC), la ronda única tiene un tiempo mínimo y un tiempo máximo:
			</p>
			<div class="tbl">
				<table>
					<thead>
						<tr><th>Modalidad</th><th class="num">Tiempo mínimo</th><th class="num">Tiempo máximo</th><th class="num">Rango sin deducción</th></tr>
					</thead>
					<tbody>
						<tr><td>Street Dance | Performance</td><td class="num">2:30 minutos</td><td class="num">4:00 minutos</td><td class="num">2:25 a 4:05 minutos</td></tr>
						<tr><td>Kpop Dance Cover (DC)</td><td class="num">2:30 minutos</td><td class="num">4:00 minutos</td><td class="num">2:25 a 4:05 minutos</td></tr>
					</tbody>
				</table>
			</div>
			<p>
				<b>7.3. Margen de tiempo.</b> Se admite un margen de más o menos <b>5 segundos</b> sobre los límites
				establecidos. Una presentación que dura entre <b>2:25</b> y <b>4:05</b> minutos no recibe deducción
				por tiempo. Por fuera de ese margen se aplica la deducción del numeral 12.2.
			</p>
			<p>
				<b>7.4. Inicio y fin del cronómetro.</b> El cronómetro arranca con el primer sonido de la pista o con
				el primer movimiento coreográfico de cualquier depo-artista, lo que ocurra primero. Se detiene con
				el último sonido de la pista o con el último movimiento coreográfico, lo que ocurra de último.
			</p>
			<p>
				<b>7.5. Toma del tiempo.</b> El cronometrista toma el tiempo de cada presentación y lo reporta al
				Juez Principal, que aplica la deducción cuando corresponde. El montaje y el desmontaje de utilería
				no cuentan dentro del tiempo de la presentación.
			</p>
			<p>
				<b>7.6. Llamado a escena.</b> Cuando el presentador anuncia al equipo, este tiene
				<b>60 segundos</b> para ocupar su posición inicial. Ya en posición, el director o un depo-artista
				levanta la mano como señal para el operador de sonido. El equipo que no ocupa su posición en esos
				<b>60 segundos</b> recibe la deducción por salida tardía. El que no se presenta en escena dentro de
				los <b>120 segundos</b> siguientes al anuncio queda descalificado (numeral 13.1).
			</p>
			<p>
				<b>7.7. Dance break en Kpop Dance Cover (DC).</b> El dance break original no puede superar los
				<b>45 segundos</b> del tiempo total de la coreografía y solo puede ubicarse en uno de los momentos de
				la pieza: intro, intermedio u outro. Incumplir cualquiera de estas dos condiciones genera la
				deducción del numeral 12.2.
			</p>
			{@render volver()}
		</section>

		<!-- 8 -->
		<section id="articulo-8" class="art">
			{@render articulo(8)}
			<p><b>8.1. Medidas del escenario.</b> <b>10 metros</b> de ancho por <b>10 metros</b> de fondo.</p>
			<p>
				<b>8.2. Entradas y salidas.</b> Durante la presentación están permitidas las entradas y salidas de
				los depo-artistas del escenario.
			</p>
			<p>
				<b>8.3. Zonas del evento.</b> El evento dispone de tres zonas para los equipos: zona de
				calentamiento, zona de preparación y zona de competencia. Los equipos pasan por ellas en ese
				orden.
			</p>
			<p><b>8.4. Uso y tiempos por equipo.</b> Cada zona tiene un uso definido y un tiempo asignado por equipo:</p>
			<div class="tbl">
				<table>
					<thead>
						<tr><th>Zona</th><th>Uso</th><th>Tiempo por equipo</th></tr>
					</thead>
					<tbody>
						<tr>
							<td><b>Calentamiento</b></td>
							<td>Activación física, estiramiento y repaso de secuencias. No se usan parlantes: la música se escucha con audífonos.</td>
							<td>15 minutos, en el turno que asigna el coordinador de escenario según el orden de salida.</td>
						</tr>
						<tr>
							<td><b>Preparación</b></td>
							<td>Revisión final de vestuario, calzado y utilería, y conteo del equipo contra las manillas de acreditación. El coordinador de escenario inspecciona la utilería y retiene los elementos prohibidos (numeral 10.8).</td>
							<td>Desde que faltan 2 turnos para su salida hasta el llamado a escena.</td>
						</tr>
						<tr>
							<td><b>Competencia</b></td>
							<td>Escenario de 10 × 10 metros, de uso exclusivo del equipo en turno.</td>
							<td>El tiempo de su presentación, más 60 segundos de montaje y 60 segundos de desmontaje si usa utilería aprobada.</td>
						</tr>
					</tbody>
				</table>
			</div>
			<p>
				<b>8.5. Acceso a las zonas.</b> A las zonas de calentamiento y preparación solo ingresan los
				depo-artistas acreditados del equipo y su director. Familiares y acompañantes siguen la
				competencia desde las áreas de público.
			</p>
			<p>
				<b>8.6. Ubicación del director.</b> Durante la presentación, el director permanece en el punto al
				costado del escenario que le asigna el coordinador de escenario.
			</p>
			<p>
				<b>8.7. Sonido e iluminación.</b> La organización opera el sonido y la iluminación. Los equipos no
				conectan equipos propios ni piden efectos de luz particulares.
			</p>
			<p>
				<b>8.8. Cali Capital +verde.</b> Cada equipo entrega limpias las zonas que usa y lleva sus residuos a
				los puntos de disposición del evento. El coordinador de escenario revisa el estado de la zona
				cuando el equipo sale de ella.
			</p>
			{@render volver()}
		</section>

		<!-- 9 -->
		<section id="articulo-9" class="art">
			{@render articulo(9)}
			<p><b>9.1. Formato.</b> La pista se envía en formato digital WAV, o MP3 a <b>320 kbps</b>.</p>
			<p>
				<b>9.2. Envío.</b> Se carga en el formulario de registro o se envía al correo oficial con el asunto:
				<span class="subject">NOMBRE DEL EQUIPO | CATEGORÍA | PISTA</span>.
			</p>
			<p>
				<b>9.3. Plazo de entrega.</b> La pista se entrega a más tardar el <b>19 de noviembre de 2026</b>,
				fecha de cierre de inscripciones. Después de esa fecha no se reciben pistas nuevas ni cambios.
			</p>
			<p>
				<b>9.4. Copia de seguridad.</b> El día de la competencia, cada equipo lleva una memoria USB marcada
				con el nombre del equipo y la categoría, que contenga únicamente su pista. Se usa solo si falla el
				archivo enviado. No se reciben copias desde celulares, computadores ni otros medios.
			</p>
			<p>
				<b>9.5. Pista limpia.</b> La pista no puede contener groserías ni lenguaje soez, en ningún idioma.
				Es responsabilidad del equipo entregar una versión limpia. Cada ocurrencia recibe la deducción del
				numeral 12.2.
			</p>
			<p>
				<b>9.6. Calidad de la pista.</b> El equipo responde por la calidad, la mezcla y el volumen de su
				pista. Un error de edición o de grabación de la pista no es falla técnica de la organización.
			</p>
			<p>
				<b>9.7. Derechos de autor.</b> Cada equipo es responsable de contar con las licencias o
				autorizaciones necesarias para la música que usa y debe poder demostrarlo si la organización lo
				solicita.
			</p>
			{@render volver()}
		</section>

		<!-- 10 -->
		<section id="articulo-10" class="art">
			{@render articulo(10)}
			<p>
				<b>10.1. Vestuario revelador y vestuario obsceno.</b> Un vestuario revelador no equivale a un
				vestuario obsceno. Se permite el vestuario revelador siempre que no incurra en obscenidad ni en
				contenido sexual explícito, según las definiciones del artículo 3. El vestuario obsceno recibe la
				deducción del numeral 12.2.
			</p>
			<p>
				<b>10.2. Calzado.</b> El calzado debe ser seguro para la superficie y no dejar marcas. Se prohíben
				los tacones altos y todo calzado no diseñado para la danza. El calzado no permitido recibe la
				deducción del numeral 12.2.
			</p>
			<p>
				<b>10.3. Marcas y patrocinios.</b> Los logos de patrocinadores se permiten en el uniforme de
				llegada, pero no en el vestuario de escena. Su uso en escena recibe la deducción del numeral 12.2.
			</p>
			<p>
				<b>10.4. Aprobación de utilería.</b> Toda utilería requiere aprobación previa del Comité Técnico de
				LOG. El equipo envía al correo oficial fotografías, medidas y una descripción de cada elemento a
				más tardar el <b>19 de noviembre de 2026</b>. La utilería no aprobada recibe la deducción del
				numeral 12.2.
			</p>
			<p>
				<b>10.5. Seguridad, montaje y desmontaje.</b> La utilería debe ser segura, ignífuga y no representar
				peligro para los depo-artistas ni para el público. Cada equipo monta y desmonta su propia utilería
				en un máximo de <b>60 segundos</b> para el montaje y <b>60 segundos</b> para el desmontaje.
			</p>
			<p><b>10.6. Elementos prohibidos.</b> Se prohíbe llevar a escena:</p>
			<ol class="alpha">
				<li>fuego en cualquier forma, incluida la pirotecnia;</li>
				<li>todo elemento que simule físicamente un arma, como pistolas, cuchillos o espadas;</li>
				<li>cualquier objeto que incite a la violencia;</li>
				<li>animales vivos;</li>
				<li>
					líquidos, polvos, purpurina, aceite o cualquier sustancia que dañe la superficie del escenario o
					ponga en riesgo a los equipos que se presentan después.
				</li>
			</ol>
			<p>
				<b>10.7. Razón de la norma.</b> En LOG creemos que la creatividad puede lograr cosas mucho más
				impactantes que el fuego o la simulación de un arma.
			</p>
			<p>
				<b>10.8. Retención de elementos prohibidos.</b> El coordinador de escenario revisa la utilería en la
				zona de preparación y retiene los elementos prohibidos que encuentre. El equipo los recoge al
				terminar su presentación. Si un elemento prohibido llega a escena, se aplica la deducción del
				numeral 12.2.
			</p>
			<p>
				<b>10.9. Gestos en escena.</b> Quedan prohibidos los gestos obscenos y el contenido sexualmente
				explícito durante la presentación. Cada ocurrencia recibe la deducción del numeral 12.2.
			</p>
			<p>
				<b>10.10. Sensualidad y contenido explícito.</b> El movimiento sensual propio de estilos como heels o
				dancehall no constituye por sí solo contenido sexualmente explícito. Lo que se sanciona es la
				simulación de actos sexuales y los gestos obscenos, según las definiciones del artículo 3.
			</p>
			<p>
				<b>10.11. Acrobacias.</b> En LOG no existen acrobacias prohibidas. La única condición es que se
				ejecuten al cien por ciento. Una acrobacia mal ejecutada genera la deducción del numeral 12.2. Se
				entiende mal ejecutada cuando termina en caída o cuando entorpece el desarrollo del repertorio.
			</p>
			{@render volver()}
		</section>

		<!-- 11 -->
		<section id="articulo-11" class="art">
			{@render articulo(11)}
			<p>
				<b>11.1. Panel de jueces.</b> La calificación está a cargo de un panel de <b>3</b> jueces de mesa.
				Cada uno califica un dominio distinto (A, B o C) y la suma de sus tres puntuaciones forma la
				puntuación del equipo, sobre un máximo de <b>100 puntos</b>. No se descarta ninguna nota, ni la más
				alta ni la más baja.
			</p>
			<p>
				<b>11.2. Juez Principal.</b> La competencia cuenta además con un Juez Principal, que no califica ni
				suma puntos. Sus funciones son:
			</p>
			<ol class="alpha">
				<li>
					supervisar la integridad y la consistencia de la evaluación, desde el inicio de la competencia
					hasta la validación final de las puntuaciones;
				</li>
				<li>
					dirigir, antes de la competencia, una sesión de armonización con los jueces de mesa para revisar
					criterios y rangos de puntuación;
				</li>
				<li>
					revisar las puntuaciones en tiempo real. Puede validar o bloquear una puntuación cuando el
					razonamiento del juez no es coherente con la calificación; en ese caso, el juez la revisa y la
					sustenta por escrito antes de la validación. No puede obligar a un juez a cambiar su puntuación;
				</li>
				<li>aplicar las deducciones del artículo 12;</li>
				<li>decidir las descalificaciones junto con el Director del Evento (numeral 13.3), y</li>
				<li>resolver las situaciones no previstas en este reglamento (numeral 20.6).</li>
			</ol>
			<p>
				<b>11.3. Separación de dominios.</b> Separar las responsabilidades evita que la opinión sobre un
				aspecto influya en la calificación de otro. El Juez de Técnica evalúa solo técnica, el de
				Composición Coreográfica solo composición y el de Espectacularidad solo el impacto del
				espectáculo. El resultado es una retroalimentación más específica y útil para cada equipo.
			</p>
			<p>
				<b>11.4. Juez de Técnica.</b> Experto con conocimiento profundo de los fundamentos de la danza. En
				Street Dance | Performance domina estilos fundacionales como popping, locking, breaking, house y
				waacking, con sus niveles de dificultad, su evolución y su actualidad. En Kpop Dance Cover (DC)
				conoce con rigor la coreografía original, sus detalles de movimiento, formaciones y vestuario.
				Evalúa la ejecución física, la esencia y el desarrollo técnico de los estilos, es decir, cómo se
				baila. También evalúa el rendimiento físico, entendido como la capacidad del equipo de sostener el
				nivel de la presentación en escena durante todo el repertorio. Responde a la pregunta:
				<b>¿con qué nivel de habilidad, dificultad y precisión baila el equipo, y lo sostiene hasta el final?</b>
			</p>
			<p>
				<b>11.5. Juez de Composición Coreográfica.</b> Coreógrafo o director reconocido por su visión
				creativa, que entiende la estructura, la narrativa y la musicalidad. Evalúa los elementos
				compositivos y artísticos: coreografía, concepto, narrativa, uso de la música y del escenario.
				Responde a la pregunta: <b>¿qué tan bien diseñada y estructurada está la propuesta?</b>
			</p>
			<p>
				<b>11.6. Juez de Espectacularidad.</b> Intérprete de trayectoria, director escénico o profesional
				del entretenimiento, con criterio experto para la conexión con el público. Evalúa la entrega y el
				impacto: presencia escénica, energía, proyección y efecto en la audiencia. Responde a la pregunta:
				<b>¿qué tan impactante fue la presentación?</b>
			</p>
			<p>
				<b>11.7. Escala de calificación.</b> Cada criterio se califica con un decimal, por ejemplo
				<b>8,5</b>. Los jueces usan esta escala de referencia:
			</p>
			<div class="tbl">
				<table>
					<thead>
						<tr><th>Nivel</th><th class="num">Criterio de 10 puntos</th><th class="num">Criterio de 15 puntos</th><th>Qué significa</th></tr>
					</thead>
					<tbody>
						<tr><td><b>Insuficiente</b></td><td class="num">0,0 a 3,9</td><td class="num">0,0 a 5,9</td><td>El criterio no se cumple o se cumple con errores constantes.</td></tr>
						<tr><td><b>En desarrollo</b></td><td class="num">4,0 a 5,9</td><td class="num">6,0 a 8,9</td><td>Se cumple de forma parcial, con errores visibles.</td></tr>
						<tr><td><b>Sólido</b></td><td class="num">6,0 a 7,9</td><td class="num">9,0 a 11,9</td><td>Se cumple con claridad y con errores menores.</td></tr>
						<tr><td><b>Sobresaliente</b></td><td class="num">8,0 a 9,4</td><td class="num">12,0 a 14,1</td><td>Se cumple con precisión y aporta valor a la propuesta.</td></tr>
						<tr><td><b>Excepcional</b></td><td class="num">9,5 a 10,0</td><td class="num">14,2 a 15,0</td><td>Nivel de referencia internacional en el criterio.</td></tr>
					</tbody>
				</table>
			</div>
			<p>
				<b>11.8. Criterios de Street Dance | Performance.</b> La calificación equilibra la habilidad técnica
				y el valor del espectáculo. El campeón de esta modalidad demuestra que sabe construir un
				espectáculo completo: autenticidad, dificultad y ejecución limpia de los estilos, junto con
				creatividad, conexión con el público, narrativa y mensaje.
			</p>
			{@render criterios(criteriosStreet)}
			<p>
				<b>11.9. Criterios de Kpop Dance Cover (DC).</b> Una propuesta de Kpop Dance Cover (DC) combina
				danza, interpretación, estética visual y fidelidad a una obra existente. La calificación premia la
				precisión en la réplica de la coreografía y el concepto originales, y la capacidad del equipo de
				aportar su propio carisma. Se apoya en tres pilares:
			</p>
			<ol class="alpha">
				<li>
					<b>Fidelidad:</b> respetar la coreografía, las formaciones y el concepto originales, como
					corresponde a un cover.
				</li>
				<li>
					<b>Reinterpretación creativa:</b> el equipo puede añadir un aporte propio, como un dance break
					original, dentro de los límites del numeral 7.7.
				</li>
				<li>
					<b>Factor ídolo:</b> la energía, el carisma y la presencia escénica que definen a las estrellas
					del K-pop.
				</li>
			</ol>
			{@render criterios(criteriosKpop)}
			<p>
				<b>11.10. Tabulación.</b> La puntuación final de un equipo es la suma de las puntuaciones de los tres
				jueces de mesa, sobre <b>100 puntos</b>, menos las deducciones que aplica el Juez Principal. Se
				expresa con dos decimales. Antes de publicar resultados, el Juez Principal revisa las hojas de
				puntuación y los comentarios de cada juez. Una vez validadas, el Juez Principal y los jueces de
				mesa firman la hoja de resultados, que es el resultado oficial. Los modelos de hojas están en el
				<a href="#anexo-1">Anexo 1</a>.
			</p>
			<p>
				<b>11.11. Retroalimentación.</b> Cada director recibe por correo electrónico las tres hojas de
				puntuación de su equipo, con los comentarios de los jueces, junto con la publicación de los
				resultados oficiales (numeral 16.1).
			</p>
			{@render volver()}
		</section>

		<!-- 12 -->
		<section id="articulo-12" class="art">
			{@render articulo(12)}
			<p>
				<b>12.1. Aplicación.</b> Las deducciones se restan de la puntuación final del equipo. Las aplica el
				Juez Principal, de la misma forma para todos los equipos, y cada una queda anotada en la hoja de
				resultados con el numeral que la sustenta.
			</p>
			<p>
				<b>12.2. Valores.</b> Cada deducción tiene un valor exacto en puntos, sobre la escala de <b>100</b>:
			</p>
			<div class="tbl">
				<table>
					<thead>
						<tr><th>Infracción</th><th class="num">Deducción</th><th class="num">Numeral</th></tr>
					</thead>
					{#each deducciones as g}
						<tbody>
							<tr class="group"><th colspan="3" scope="colgroup">{g.grupo}</th></tr>
							{#each g.items as [inf, ded, num]}
								<tr><td>{inf}</td><td class="num"><b>{ded}</b></td><td class="num">{num}</td></tr>
							{/each}
						</tbody>
					{/each}
				</table>
			</div>
			<p class="example">
				Ejemplo de cálculo por tiempo: una presentación de <b>4:12</b> minutos queda <b>7 segundos</b> por
				fuera del margen, que termina en <b>4:05</b>. Los primeros <b>5 segundos</b> restan <b>1,0</b> punto
				(<b>5 × 0,2</b>) y los <b>2</b> siguientes restan <b>1,0</b> punto (<b>2 × 0,5</b>). Deducción total:
				<b>2,0</b> puntos.
			</p>
			<p>
				<b>12.3. Acumulación.</b> Las deducciones se acumulan. La puntuación final mínima es <b>0</b>.
			</p>
			<p>
				<b>12.4. Confirmación de infracciones de contenido.</b> Las deducciones por vestuario obsceno, gesto
				obsceno o contenido sexualmente explícito se aplican solo cuando al menos <b>2</b> de los <b>3</b>
				jueces de mesa confirman la infracción ante el Juez Principal.
			</p>
			<p>
				<b>12.5. Conteo de caídas.</b> Cada depo-artista que cae cuenta como una caída. Una acrobacia que
				termina en caída se sanciona una sola vez, como acrobacia mal ejecutada.
			</p>
			{@render volver()}
		</section>

		<!-- 13 -->
		<section id="articulo-13" class="art">
			{@render articulo(13)}
			<p><b>13.1. Causales.</b> Son causales de descalificación:</p>
			<ol class="alpha">
				<li>
					el fraude en la inscripción o en la acreditación, como falsificar la identidad de un integrante o
					usar documentos de otra persona;
				</li>
				<li>salir a escena con una persona que no está en el roster o que no fue acreditada;</li>
				<li>
					el sabotaje contra otro equipo, contra la organización o contra el desarrollo de la competencia;
				</li>
				<li>la falta gravísima de conducta del equipo o de su director (numeral 18.4);</li>
				<li>
					poner en riesgo grave la seguridad de otras personas o incumplir una instrucción directa de
					seguridad de la organización;
				</li>
				<li>no presentarse en escena dentro de los <b>120 segundos</b> siguientes al anuncio (numeral 7.6);</li>
				<li>no contar con el mínimo de <b>7</b> depo-artistas acreditados (numeral 4.6), y</li>
				<li>presentar en Kpop Dance Cover (DC) un cover que no es de K-pop (numeral 4.3).</li>
			</ol>
			<p>
				<b>13.2. Presentación fuera de tiempo.</b> La presentación que queda más de <b>10 segundos</b> por
				fuera del margen, es decir, que dura menos de <b>2:15</b> o más de <b>4:15</b> minutos, recibe -3,5
				puntos de deducción.
			</p>
			<p>
				<b>13.3. Quién decide.</b> Las descalificaciones las deciden el Juez Principal y el Director del
				Evento. La decisión se comunica de inmediato al director del equipo y queda registrada en la hoja
				de resultados.
			</p>
			<p>
				<b>13.4. Efectos.</b> El equipo descalificado no figura en la clasificación de su categoría, no
				recibe premio y no tiene derecho a reembolso. La descalificación afecta solo al equipo de la
				categoría donde ocurrió la causal.
			</p>
			{@render volver()}
		</section>

		<!-- 14 -->
		<section id="articulo-14" class="art">
			{@render articulo(14)}
			<p>
				<b>14.1. Prioridad.</b> La seguridad de los depo-artistas es la máxima prioridad y prevalece sobre
				cualquier consideración competitiva.
			</p>
			<p>
				<b>14.2. Falla de la organización.</b> Si la interrupción se origina en una falla de la
				organización, el equipo tiene derecho a repetir su presentación completa.
			</p>
			<p>
				<b>14.3. Falla del equipo.</b> Si la interrupción se origina en el equipo, en su pista o en alguno de
				sus integrantes, no hay derecho a repetición. Se califica lo presentado.
			</p>
			<p><b>14.4. Procedimiento ante una falla.</b></p>
			<ol class="alpha">
				<li>Si el equipo percibe una falla, detiene la presentación de inmediato.</li>
				<li>
					El Juez Principal, con el operador de sonido y el coordinador de escenario, determina en el
					momento si la falla fue de la organización o del equipo.
				</li>
				<li>
					Si la falla fue de la organización, el equipo repite una vez corregida. El director elige si
					repite de inmediato o al final de su categoría.
				</li>
				<li>
					En la repetición se califica solo la nueva presentación. Las deducciones de la presentación
					interrumpida no se trasladan.
				</li>
				<li>No se aceptan reclamos por falla técnica después de terminada la presentación.</li>
			</ol>
			<p><b>14.5. Lesión durante la presentación.</b></p>
			<ol class="alpha">
				<li>
					Si un depo-artista se lesiona y puede salir del escenario por sus propios medios o con ayuda de un
					compañero, el equipo puede continuar sin detenerse (numeral 8.2).
				</li>
				<li>
					Si la lesión impide continuar con seguridad, el Juez Principal detiene la presentación por
					iniciativa propia o a pedido del director o de cualquier depo-artista. El operador de sonido
					detiene la pista por orden del Juez Principal.
				</li>
				<li>
					El personal de salud del evento atiende al depo-artista en el escenario. Nadie lo mueve hasta que
					ese personal lo indique.
				</li>
				<li>
					Como la interrupción se origina en un integrante del equipo, no hay derecho a repetición
					(numeral 14.3). El panel califica lo presentado hasta la interrupción y no se aplica deducción
					por tiempo.
				</li>
				<li>
					El depo-artista atendido solo vuelve a competir ese día, en cualquiera de las categorías, con
					autorización del personal de salud del evento.
				</li>
				<li>
					El director informa de inmediato a la organización cualquier lesión o enfermedad de un
					depo-artista, aunque ocurra fuera del escenario.
				</li>
			</ol>
			<p>
				<b>14.6. Suspensión por emergencia.</b> Si una emergencia, una falla de energía o una condición
				climática obliga a suspender la competencia, el Director del Evento y el Juez Principal definen el
				momento de la reanudación. Los equipos que ya se presentaron conservan su puntuación. El equipo que
				estaba en escena al momento de la suspensión repite su presentación completa.
			</p>
			{@render volver()}
		</section>

		<!-- 15 -->
		<section id="articulo-15" class="art">
			{@render articulo(15)}
			<p><b>15.1. Ámbito.</b> El procedimiento de desempate es igual para las dos modalidades.</p>
			<p>
				<b>15.2. Orden de desempate.</b> Si dos o más equipos terminan con la misma puntuación final, el
				empate se resuelve en este orden:
			</p>
			<ol class="steps">
				<li>Define el dominio A: gana el equipo con mayor puntuación en ese dominio.</li>
				<li>Si el empate persiste, define el dominio B.</li>
				<li>Si persiste, define el dominio C.</li>
				<li>Si aún así persiste, gana el equipo que se haya inscrito primero (numeral 5.8).</li>
			</ol>
			<p>
				<b>15.3. Alcance.</b> Este procedimiento se aplica a cualquier posición de la clasificación en la que
				haya empate.
			</p>
			{@render volver()}
		</section>

		<!-- 16 -->
		<section id="articulo-16" class="art">
			{@render articulo(16)}
			<p>
				<b>16.1. Publicación de resultados.</b> Los resultados se publican por los canales oficiales en un
				plazo de <b>2 días calendario</b> después de finalizado el evento, es decir, a más tardar el
				<b>24 de noviembre de 2026</b>.
			</p>
			<p>
				<b>16.2. Anuncio en el evento.</b> Al cierre de LOG, la organización anuncia el equipo ganador de
				cada categoría con base en las puntuaciones validadas por el Juez Principal. Ese resultado queda en
				firme cuando vence el plazo de reclamaciones o cuando se resuelven las que se presenten.
			</p>
			<p>
				<b>16.3. Contenido de la publicación.</b> La publicación incluye la clasificación de cada categoría,
				con la puntuación de cada dominio, las deducciones con su numeral y la puntuación final de cada
				equipo.
			</p>
			<p><b>16.4. Quién reclama.</b> Las reclamaciones las presenta únicamente el director del equipo.</p>
			<p>
				<b>16.5. Plazo y canal.</b> Dentro de los <b>2 días calendario</b> siguientes a la publicación de los
				resultados, por los canales oficiales.
			</p>
			<p>
				<b>16.6. Forma de la reclamación.</b> La reclamación se envía al correo oficial con el asunto:
				<span class="subject">RECLAMACIÓN | NOMBRE DEL EQUIPO | CATEGORÍA</span>. Indica el numeral del
				reglamento que se considera mal aplicado, los hechos y, si las hay, las pruebas, como un video de la
				presentación.
			</p>
			<p>
				<b>16.7. Qué se puede reclamar.</b> Son objeto de reclamación los errores aritméticos, las
				deducciones y la aplicación de este reglamento. La valoración artística que cada juez hace dentro
				de su dominio no es objeto de reclamación.
			</p>
			<p>
				<b>16.8. Respuesta.</b> El jurado, integrado por los tres jueces de mesa y el Juez Principal,
				responde por escrito dentro de los <b>2 días calendario</b> siguientes al recibo. Si la reclamación
				prospera, se corrige la puntuación, se ajusta la clasificación y se publica de nuevo.
			</p>
			<p><b>16.9. Decisión definitiva.</b> La decisión del jurado sobre la reclamación es definitiva.</p>
			<p>
				<b>16.10. Reclamaciones que no se tramitan.</b> No se tramitan las reclamaciones presentadas fuera de
				plazo, por una persona distinta al director o por un canal distinto a los oficiales.
			</p>
			{@render volver()}
		</section>

		<!-- 17 -->
		<section id="articulo-17" class="art">
			{@render articulo(17)}
			<p>
				<b>17.1. Valor del premio.</b> Cali Capital busca estimular en el ecosistema nacional que las
				premiaciones sean representativas frente al esfuerzo de quienes compiten y dejan todo en el
				escenario. Por esa razón se dispone una bolsa de premios de <b>$20.000.000</b>, de la cual se asignan
				los premios así:
			</p>
			<div class="tbl">
				<table>
					<thead>
						<tr><th>Grupos inscritos en la categoría</th><th class="num">Premio para el equipo ganador</th></tr>
					</thead>
					<tbody>
						<tr><td>10 o más grupos</td><td class="num"><b>$10.000.000</b></td></tr>
						<tr><td>9 grupos a 5 grupos mínimo</td><td class="num"><b>$5.000.000</b></td></tr>
					</tbody>
				</table>
			</div>
			<p>
				<b>17.2. Conteo de grupos.</b> Se cuentan los equipos de cada categoría con inscripción completa, es
				decir, con los dos pagos realizados, al cierre del <b>19 de noviembre de 2026</b>.
			</p>
			<p>
				<b>17.3. Forma y plazo de pago.</b> El premio se paga por transferencia bancaria. Los 10 días
				calendario siguientes al cierre del festival, del 23 de noviembre al 2 de diciembre de 2026, se
				destinan a la publicación de resultados, el trámite de reclamaciones y la entrega de los documentos
				del numeral 17.5. El plazo para el pago empieza a contar el 2 de diciembre de 2026 y vence el 12 de
				diciembre de 2026, fecha máxima para el desembolso.
			</p>
			<p>
				<b>17.4. Proceso.</b> Una vez finalizado el evento, la organización se comunica por los canales
				oficiales para solicitar los documentos legales y poner a disposición del equipo ganador una
				pasarela de opciones de pago, de manera que reciba su premio conforme a la ley. La prioridad es que
				el premio se entregue completo, teniendo en cuenta que, por tratarse de una transacción bancaria de
				alto valor, existen cargas tributarias que debe asumir el ganador.
			</p>
			<p>
				<b>17.5. Documentos.</b> Una vez el director de la agrupación escoge la opción de pago, la
				organización solicita estos documentos:
			</p>
			<div class="cols">
				<div class="box">
					<h3 class="box__title">Persona natural</h3>
					<ol class="alpha">
						<li>RUT</li>
						<li>Cuenta de cobro</li>
						<li>Certificado bancario no mayor a 30 días</li>
						<li>Planilla de seguridad social, según el caso</li>
						<li>Cédula del titular de la cuenta</li>
					</ol>
				</div>
				<div class="box">
					<h3 class="box__title">Persona jurídica</h3>
					<ol class="alpha">
						<li>Factura electrónica</li>
						<li>Certificado de cámara de comercio</li>
						<li>RUT</li>
						<li>Certificado bancario de la organización no mayor a 30 días</li>
						<li>Cédula del titular de la cuenta</li>
					</ol>
				</div>
			</div>
			<p>
				<b>17.6. Retenciones.</b> Si hay lugar a retenciones de ley, se informan al ganador antes de proceder
				al pago. Esa es la razón de ofrecer la pasarela de opciones: que el director del equipo ganador
				escoja la alternativa que más le convenga.
			</p>
			<p>
				<b>17.7. Documentación incompleta.</b> Si al 2 de diciembre de 2026 el equipo ganador no ha entregado
				los documentos completos, el plazo de 10 días calendario para el pago empieza a contar desde el día
				siguiente a la entrega completa. En ese caso no aplica la fecha máxima del 12 de diciembre de 2026.
			</p>
			<p>
				<b>17.8. Reclamación en trámite.</b> Si hay una reclamación que puede cambiar el ganador de una
				categoría, el pago de esa categoría se hace una vez el jurado la resuelva (numeral 16.8), dentro del
				mismo plazo del 2 al 12 de diciembre de 2026. Si la decisión se produce después del 2 de diciembre,
				el plazo de 10 días calendario corre desde el día siguiente a la decisión.
			</p>
			{@render volver()}
		</section>

		<!-- 18 -->
		<section id="articulo-18" class="art">
			{@render articulo(18)}
			<p>
				<b>18.1. Conducta sancionable.</b> Se sanciona la conducta antideportiva del equipo y de su director,
				entendida como agresiones verbales o físicas, e irrespeto al jurado, a la organización, al público o
				a otros equipos.
			</p>
			<p>
				<b>18.2. Alcance.</b> Esta norma aplica al equipo y a su director. No se extiende a los familiares ni
				a los acompañantes.
			</p>
			<p>
				<b>18.3. Vigencia.</b> La norma rige desde la acreditación hasta la publicación de los resultados
				oficiales y durante el trámite de reclamaciones, incluidas las comunicaciones por los canales
				oficiales.
			</p>
			<p><b>18.4. Graduación y sanciones.</b> Las faltas se gradúan así:</p>
			<div class="tbl">
				<table>
					<thead>
						<tr><th>Nivel</th><th>Conductas</th><th>Sanción</th></tr>
					</thead>
					<tbody>
						<tr><td><b>Leve</b></td><td>Gesto o expresión irrespetuosa aislada.</td><td>Amonestación escrita del Juez Principal, sin descuento de puntos.</td></tr>
						<tr><td><b>Grave</b></td><td>Insulto, amenaza, irrespeto reiterado, o repetir una falta leve después de la amonestación.</td><td>-5,0 puntos.</td></tr>
						<tr><td><b>Gravísima</b></td><td>Agresión física o sabotaje.</td><td>Descalificación y retiro del recinto.</td></tr>
					</tbody>
				</table>
			</div>
			<p>
				<b>18.5. Quién decide.</b> El Juez Principal califica la falta y aplica la sanción. La descalificación
				por falta gravísima la decide con el Director del Evento (numeral 13.3).
			</p>
			<p>
				<b>18.6. Familiares y acompañantes.</b> La conducta de familiares y acompañantes no afecta la
				calificación del equipo. La organización puede pedir el retiro del recinto de cualquier persona que
				ponga en riesgo la seguridad del evento.
			</p>
			{@render volver()}
		</section>

		<!-- 19 -->
		<section id="articulo-19" class="art">
			{@render articulo(19)}
			<p>
				<b>19.1. Titularidad del material audiovisual.</b> La organización es titular del material
				audiovisual registrado durante el evento y puede usarlo para difusión, memoria y gestión del
				festival.
			</p>
			<p>
				<b>19.2. Uso de imagen.</b> Con la inscripción, los depo-artistas autorizan el uso de su imagen
				captada durante el evento para esos mismos fines, sin contraprestación económica. Para los menores
				de edad, esta autorización se soporta en la declaración del director (numeral 4.9).
			</p>
			<p>
				<b>19.3. Uso de la marca.</b> El uso de la marca LOG y de la marca Cali Capital por parte de los
				equipos requiere autorización previa de la organización.
			</p>
			<p>
				<b>19.4. Solicitud y alcance.</b> La autorización se pide al correo oficial. Nombrar el evento o
				etiquetar sus cuentas oficiales en redes sociales no requiere autorización. Usar los logos en piezas
				gráficas, mercancía o promoción comercial sí la requiere. Los equipos pueden publicar en sus redes el
				video de su propia presentación.
			</p>
			<p>
				<b>19.5. Datos personales.</b> La Corporación para el Arte, el Deporte y la Cultura - The Giants
				Community es responsable del tratamiento de los datos personales que se entregan en la inscripción y
				la acreditación. Los datos se tratan conforme a la Ley 1581 de 2012 y sus normas reglamentarias,
				solo para gestionar la inscripción, la acreditación, la seguridad, la calificación, la premiación y
				las comunicaciones del evento. Los titulares pueden consultar, actualizar, rectificar o pedir la
				supresión de sus datos escribiendo al correo oficial del evento.
			</p>
			{@render volver()}
		</section>

		<!-- 20 -->
		<section id="articulo-20" class="art">
			{@render articulo(20)}
			<p>
				<b>20.1. Protección de la integridad.</b> LOG adopta todas las medidas a su alcance para proteger la
				integridad de los depo-artistas. Aun así, esa integridad depende de múltiples factores que el evento
				no controla en su totalidad, entre ellos la preparación física, el estado de salud y la ejecución
				del propio repertorio.
			</p>
			<p>
				<b>20.2. Espectáculo público de las artes escénicas.</b> LOG se realiza conforme a la Ley 1493 de
				2011 y sus normas reglamentarias sobre espectáculos públicos de las artes escénicas. El evento cumple
				con las medidas y pólizas que esa norma exige al productor, incluida la póliza de responsabilidad
				civil extracontractual.
			</p>
			<p>
				<b>20.3. Asunción voluntaria del riesgo.</b> La participación es una decisión libre y voluntaria de
				cada depo-artista y de su director, quienes asumen los riesgos propios de la práctica y velan por su
				seguridad de manera individual.
			</p>
			<p>
				<b>20.4. Responsabilidad de la organización.</b> La organización responde por aquello que está bajo
				su control y por las obligaciones que le impone la ley. Ninguna disposición de este reglamento
				excluye su responsabilidad por dolo o culpa grave (Código Civil, artículos 63 y 1522) ni limita las
				obligaciones que le asigna la Ley 1480 de 2011, cuyos artículos 42 y 43 declaran ineficaces de pleno
				derecho las cláusulas que lo hagan.
			</p>
			<p>
				<b>20.5. Acceso a la justicia.</b> Nada en este reglamento restringe el derecho de acceso a la
				administración de justicia (Constitución Política, artículo 229). Lo que el depo-artista y su
				director asumen con la inscripción son los riesgos propios de la práctica, en los términos del
				numeral 20.3.
			</p>
			<p>
				<b>20.6. Casos no previstos.</b> Las situaciones que este reglamento no contemple las resuelven el
				Juez Principal y el Director del Evento.
			</p>
			<p>
				<b>20.7. Cambios al reglamento.</b> La organización puede ajustar este reglamento por razones
				logísticas, técnicas o de seguridad. Todo cambio se comunica por el correo oficial a los equipos
				inscritos antes de la competencia.
			</p>
			<p>
				<b>20.8. Límite de los cambios.</b> Ningún cambio puede modificar los valores de inscripción, la
				bolsa de premios ni las condiciones de pago del premio.
			</p>
			<p>
				<b>20.9. Aceptación del reglamento.</b> Al realizar la inscripción a través del formulario y efectuar
				el primer pago, el equipo y su director aceptan el presente reglamento en su totalidad, junto con
				todos sus términos y condiciones.
			</p>
			<p>
				<b>20.10. Contacto.</b> Las dudas sobre este reglamento se atienden en
				<a href="mailto:calicapitalfest@thegiantsco.com">calicapitalfest@thegiantsco.com</a>.
			</p>

			<blockquote class="closing">
				En LOG sabemos que cada equipo trae una historia que contar y un sueño por alcanzar. Por eso creamos
				un espacio que va más allá de la competencia: una plataforma donde el Street Dance y el K-pop se
				convierten en repertorios listos para grandes escenarios del MUNDO. La retroalimentación de los
				jueces es una guía para seguir puliendo el talento, y los premios son un impulso real para que cada
				agrupación siga creciendo, creando y soñando en grande.
			</blockquote>

			<footer class="sign">
				<p>Santiago de Cali, septiembre de 2026</p>
				<p class="sign__name">Cristian Pastusano Guetio</p>
				<p>Director General – Representante Legal</p>
				<p>Corporación para el Arte, el Deporte y la Cultura - The Giants Community</p>
			</footer>
			{@render volver()}
		</section>

		<!-- Anexo 1 -->
		<section id="anexo-1" class="art">
			<header class="art__head">
				<p class="art__num">Anexo 1</p>
				<h2 class="font-display art__title"><DisplayText text="Hojas de puntuación" /></h2>
			</header>
			<p>
				Modelos de las hojas que usa cada juez de mesa. Cada equipo recibe las tres hojas de su presentación
				(numeral 11.11). La Hoja 7 la usa el Juez Principal para consolidar el resultado.
			</p>
			<div class="sheets">
				{#each hojas as h}
					<section class="sheet">
						<h3 class="sheet__title">{h.titulo}</h3>
						<p class="sheet__fields">Nombre del juez · Orden de salida · Nombre del equipo</p>
						<table>
							<thead>
								<tr><th>Criterio</th><th class="num">Puntuación</th></tr>
							</thead>
							<tbody>
								{#each h.criterios as [c, max]}
									<tr><td>{c}</td><td class="num">/ {max}</td></tr>
								{/each}
							</tbody>
							<tfoot>
								<tr><th>Total</th><th class="num">/ {h.total}</th></tr>
							</tfoot>
						</table>
						<p class="sheet__fields">Comentarios específicos por criterio · Firma del {h.firma}</p>
					</section>
				{/each}
				<section class="sheet sheet--wide">
					<h3 class="sheet__title">Hoja 7. Resultado del equipo. Juez Principal</h3>
					<p class="note">La Hoja 7 es nueva en esta edición.</p>
					<p class="sheet__fields">Nombre del equipo · Orden de salida · Categoría</p>
					<table>
						<thead>
							<tr><th>Concepto</th><th class="num">Puntos</th></tr>
						</thead>
						<tbody>
							<tr><td>Dominio A</td><td class="num">/ 40</td></tr>
							<tr><td>Dominio B</td><td class="num">/ 30</td></tr>
							<tr><td>Dominio C</td><td class="num">/ 30</td></tr>
							<tr><td><b>Subtotal</b></td><td class="num"><b>/ 100</b></td></tr>
							<tr><td>Deducción aplicada (numeral), valor y descripción</td><td class="num">—</td></tr>
							<tr><td>Total deducciones</td><td class="num">—</td></tr>
						</tbody>
						<tfoot>
							<tr><th>Puntuación final</th><th class="num">—</th></tr>
						</tfoot>
					</table>
					<p class="sheet__fields">
						Observaciones · Firmas del Juez Principal, del Juez de Técnica, del Juez de Composición
						Coreográfica y del Juez de Espectacularidad
					</p>
				</section>
			</div>
			{@render volver()}
		</section>
</Reglamento>

{#snippet criterios(dominios: { dominio: string; items: Criterio[] }[])}
	<div class="tbl">
		<table>
			<thead>
				<tr><th>Criterio</th><th class="num">Puntos</th><th>Qué se evalúa</th></tr>
			</thead>
			{#each dominios as d}
				<tbody>
					<tr class="group"><th colspan="3" scope="colgroup">{d.dominio}</th></tr>
					{#each d.items as [c, pts, que]}
						<tr><td><b>{c}</b></td><td class="num">{pts}</td><td>{que}</td></tr>
					{/each}
				</tbody>
			{/each}
			<tfoot>
				<tr><th>Total</th><th class="num">100</th><th></th></tr>
			</tfoot>
		</table>
	</div>
{/snippet}
