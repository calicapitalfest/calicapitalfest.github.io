<script lang="ts">
	import { base } from "$app/paths";
	import DisplayText from "$lib/components/2026/DisplayText.svelte";
	import Reglamento from "$lib/components/2026/Reglamento.svelte";

	// Text from temp/Reglamento_Battles_of_Giants_2026.docx, a draft. Left out
	// as the document itself asks: the "[PROPUESTA]" review tags and the
	// closing "Hoja de revisión interna". Its "[DATO PENDIENTE]" gaps are
	// filled from what the site already publishes: the date (Domingo 22 in the
	// Agenda), the fees (price list: $80.000 per category) and the prize
	// ($1.500.000 COP per category, Battles description). The accreditation
	// hours are still unknown: "Por confirmar".

	const articulos = [
		"Presentación y propósito",
		"Definiciones y glosario",
		"Categorías y estilos",
		"Competidores y menores de edad",
		"Inscripción, pagos y acreditación",
		"Jornada y formato de competencia",
		"Filtros",
		"Jueces y sistema de evaluación",
		"Conducta en batalla",
		"Seguridad, lesiones y elementos prohibidos",
		"Resultados y reclamaciones",
		"Premiación y condiciones de pago",
		"Material audiovisual, datos personales y marca",
		"Consideración final y aceptación del reglamento"
	];

	const datosGenerales: [string, string][] = [
		["Competencia", "Battles of Giants 2026"],
		[
			"Festival",
			"Cali Capital 2026, Festival Internacional de Arte, Deporte y Cultura. Del 17 al 22 de noviembre de 2026"
		],
		["Fecha de la competencia", "Domingo 22 de noviembre de 2026"],
		["Hora de inicio", "3:00 p. m."],
		["Ciudad y lugar", "Santiago de Cali. Espacio 10-60"],
		["Categorías", "Soul Train y 80's Battles"],
		["Formato", "“Defiende tu estilo”. Filtro, top 16 o top 32, semifinales y final"],
		["Inscripciones", "Del 25 de septiembre al 19 de noviembre de 2026, en www.calicapitalfest.com"],
		["Organiza", "Corporación para el Arte, el Deporte y la Cultura, The Giants Community. NIT 901.750.048"],
		["Correo oficial", "calicapitalfest@thegiantsco.com"]
	];

	const glosario: [string, string][] = [
		["Acreditación", "Verificación presencial de la identidad de cada competidor. Se hace el día de la competencia, antes del inicio de los filtros."],
		["Acudiente", "Padre, madre o persona mayor de edad responsable de un competidor menor de edad, que lo inscribe y responde por él durante el evento."],
		["Baile en pleno", "Momento en que el competidor empieza a bailar su estilo. El desplazamiento hasta la posición, el saludo y la preparación no hacen parte del baile en pleno."],
		["Batalla", "Enfrentamiento entre dos competidores de la misma categoría, en el que cada uno hace el número de salidas que indica su ronda."],
		["Canales oficiales", "El correo calicapitalfest@thegiantsco.com y el sitio www.calicapitalfest.com."],
		["Categoría", "Cada una de las dos divisiones de la competencia: Soul Train y 80's Battles."],
		["Competidor", "Depo-artista inscrito en una categoría de Battles of Giants."],
		["Cronometrista", "Persona designada por la organización para tomar el tiempo de las salidas del filtro."],
		["Cuadro", "Tabla de enfrentamientos de cada categoría, armada con los resultados del filtro."],
		["Depo-artista", "Persona que une la preparación física y la disciplina de un deportista con la sensibilidad y la intención de un artista. Es el término con el que Cali Capital nombra a quienes compiten."],
		["Director del Evento", "Persona designada por la organización para dirigir la producción de Battles of Giants."],
		["DJ", "Persona designada por la organización para poner la música de los filtros y las batallas."],
		["Empate", "Voto de un juez que indica que ninguno de los dos competidores superó al otro. Solo se permite en las rondas del numeral 8.6."],
		["Estilo inscrito", "Estilo que el competidor escoge en el formulario y que defiende en el filtro y en todas sus batallas."],
		["Filtro", "Fase clasificatoria de cada categoría, de la que sale el top."],
		["Juez", "Cada uno de los tres jueces de una categoría."],
		["Personal de salud del evento", "Personal de atención médica o de primeros auxilios que la organización dispone durante la competencia."],
		["Presentador", "Persona de la organización que llama a los competidores, anuncia las batallas y dirige la votación."],
		["Réplica", "Salida adicional que los jueces conceden por unanimidad en una semifinal o en la final."],
		["Ronda de desempate", "Salida adicional que se hace cuando una batalla termina en empate en las rondas que lo permiten."],
		["Salida", "Cada intervención de un competidor en el filtro o en una batalla."],
		["Top", "Número de competidores que clasifican del filtro a las batallas."],
		["Voto", "Decisión de cada juez al final de una batalla. Cada voto vale un punto."]
	];

	const rondas: [string, string, string][] = [
		["Top 32 (si aplica)", "1", "Permitido"],
		["Top 16", "1", "Permitido"],
		["Cuartos de final", "1", "Permitido"],
		["Semifinal", "2", "No permitido"],
		["Final", "3", "No permitido"]
	];

	const votos: [string, string][] = [
		["3 votos para el mismo competidor", "Gana ese competidor"],
		["2 votos para un competidor y 1 para el otro", "Gana el competidor con 2 votos"],
		["2 votos para un competidor y 1 empate", "Gana el competidor con 2 votos"],
		["1 voto para un competidor y 2 empates", "Empate. Se hace ronda de desempate"],
		["3 empates", "Empate. Se hace ronda de desempate"],
		["1 voto para cada competidor y 1 empate", "Empate. Se hace ronda de desempate"]
	];
</script>

<svelte:head>
	<title>Reglamento Battles of Giants 2026 · Cali Capital Fest</title>
	<meta
		name="description"
		content="Reglamento oficial de competencia de Battles of Giants 2026: Soul Train y 80's Battles, en formato Defiende tu estilo."
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
	back={{ href: `${base}/#battles`, label: "Battles of Giants" }}
	title="Battles of Giants 2026"
	subs={["Soul Train y 80's Battles", "Batallas de danza urbana del festival Cali Capital 2026"]}
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
		Este documento es el reglamento oficial de Battles of Giants 2026, la competencia de batallas del
		festival Cali Capital 2026. Fija las condiciones de inscripción, el formato de los filtros y de las
		batallas, el sistema de votación de los jueces y los procedimientos que se aplican antes, durante y
		después de la competencia.
	</p>
	<p>
		Su cumplimiento es obligatorio para todos los competidores y, en el caso de los menores de edad,
		para sus acudientes. Cada regla se cita por su artículo y su numeral. Por ejemplo, la tabla de
		votación es el numeral 8.6.
	</p>

	<nav id="contenido" class="toc" aria-labelledby="toc-title">
		<h2 id="toc-title" class="box__title">Contenido</h2>
		<ol>
			{#each articulos as a, i}
				<li><a href="#articulo-{i + 1}"><span class="toc__n">{i + 1}.</span> {a}</a></li>
			{/each}
			<li><a href="#anexo-1"><span class="toc__n">Anexo 1.</span> Planilla del filtro</a></li>
		</ol>
	</nav>

	<!-- 1 -->
	<section id="articulo-1" class="art">
		{@render articulo(1)}
		<p>
			<b>1.1. Propósito.</b> Battles of Giants es la competencia de batallas de danza urbana del festival
			Cali Capital 2026. Su propósito es darle a cada estilo un escenario propio, donde sus exponentes
			midan su nivel frente a otros competidores y frente a jueces que conocen la raíz de cada danza.
		</p>
		<p>
			<b>1.2. Formato “Defiende tu estilo”.</b> Todas las batallas se compiten en el formato “Defiende
			tu estilo”. Cada competidor se inscribe con un estilo y lo defiende en cada salida, frente a un
			oponente que puede venir de otro estilo de la misma categoría. Gana quien mejor representa su
			estilo, con sus fundamentos, su musicalidad y su carácter.
		</p>
		<p>
			<b>1.3. Compromiso de los competidores.</b> Al inscribirse, cada competidor se compromete a mantener
			un entorno positivo, respetuoso y seguro para todas las personas del evento. Este compromiso
			prohíbe el acoso, la conducta antideportiva, la deshonestidad y la falta de respeto hacia jueces,
			personal de la organización, otros competidores y público. Su incumplimiento se sanciona según el
			artículo 9.
		</p>
		{@render volver()}
	</section>

	<!-- 2 -->
	<section id="articulo-2" class="art">
		{@render articulo(2)}
		<p>
			<b>2.1. Términos.</b> En todo este reglamento, los términos de la tabla tienen el significado que se
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

	<!-- 3 -->
	<section id="articulo-3" class="art">
		{@render articulo(3)}
		<p><b>3.1. Categorías.</b> Battles of Giants tiene dos categorías, cada una con sus estilos:</p>
		<div class="tbl">
			<table>
				<thead>
					<tr><th>Categoría</th><th>Estilos</th></tr>
				</thead>
				<tbody>
					<tr><td><b>Soul Train</b></td><td>Locking, Popping, Breaking y Whacking (Punking)</td></tr>
					<tr>
						<td><b>80's Battles</b></td>
						<td>Hip Hop Dance, House Dance, Krumping, Dancehall, Afro Dance y Electro Dance</td>
					</tr>
				</tbody>
			</table>
		</div>
		<p>
			<b>3.2. Separación de estilos.</b> Los estilos funk, es decir, los de Soul Train, no pueden
			participar en 80's Battles, y los estilos de 80's Battles no pueden participar en Soul Train. Cada
			estilo compite únicamente en la categoría donde está listado.
		</p>
		<p>
			<b>3.3. Estilo inscrito.</b> Cada competidor se inscribe con un solo estilo por categoría y lo
			defiende en el filtro y en todas sus batallas. El estilo no se puede cambiar después del cierre de
			inscripciones.
		</p>
		<p>
			<b>3.4. Defender el estilo.</b> En cada salida, el competidor baila su estilo inscrito. Puede
			incorporar elementos de otros estilos, siempre que su estilo siga siendo la base reconocible de la
			salida. Los jueces valoran en contra la salida en la que predomina otro estilo (numeral 8.3).
		</p>
		<p>
			<b>3.5. Participación en las dos categorías.</b> Un competidor puede inscribirse en las dos
			categorías, con un estilo distinto en cada una, pagando la categoría adicional (numeral 5.3).
		</p>
		{@render volver()}
	</section>

	<!-- 4 -->
	<section id="articulo-4" class="art">
		{@render articulo(4)}
		<p>
			<b>4.1. Sin división por edad.</b> Cada categoría se compite sin división por edad, género o nivel de
			formación. No hay edad mínima, siempre que el competidor esté en capacidad de asumir el compromiso
			de una batalla.
		</p>
		<p>
			<b>4.2. Inscripción de menores.</b> El competidor menor de 18 años se inscribe a través de su
			acudiente, que diligencia el formulario y declara:
		</p>
		<ol class="alpha">
			<li>que el menor está en capacidad de asumir el compromiso de la competencia, y</li>
			<li>que autoriza su participación y el uso de su imagen en los términos del artículo 13.</li>
		</ol>
		<p>
			<b>4.3. Responsabilidad del acudiente.</b> La integridad física y mental del menor es
			responsabilidad de su acudiente durante toda su permanencia en el evento. El acudiente permanece en
			el lugar mientras el menor compite.
		</p>
		<p>
			<b>4.4. Protección de menores.</b> Cualquier situación de acoso, abuso o riesgo para un menor se
			informa de inmediato al personal de la organización, que toma las medidas del caso y, cuando
			corresponde, informa a las autoridades competentes.
		</p>
		{@render volver()}
	</section>

	<!-- 5 -->
	<section id="articulo-5" class="art">
		{@render articulo(5)}
		<p>
			<b>5.1. Canal de registro.</b> El registro se hace únicamente a través del formulario de Cali
			Capital Fest publicado en www.calicapitalfest.com. No se aceptan inscripciones por otros medios. En
			el formulario, cada competidor registra su nombre completo, tipo y número de documento, fecha de
			nacimiento, nombre artístico, categoría y estilo inscrito.
		</p>
		<p>
			<b>5.2. Periodo de inscripción.</b> Del <b>25 de septiembre</b> al <b>19 de noviembre de 2026</b>. Los
			plazos se aplican de forma estricta.
		</p>
		<p>
			<b>5.3. Valores de inscripción.</b> Se cobran por competidor y por categoría. Valores en pesos
			colombianos:
		</p>
		<div class="tbl">
			<table>
				<thead>
					<tr><th>Concepto</th><th class="num">Valor por competidor</th></tr>
				</thead>
				<tbody>
					<tr><td>1 categoría</td><td class="num">$80.000</td></tr>
					<tr><td>Categoría adicional</td><td class="num">$80.000</td></tr>
				</tbody>
			</table>
		</div>
		<p>
			<b>5.4. Pago en dos partes.</b> Un primer pago del <b>35 %</b> al momento de la inscripción y un
			segundo pago del <b>65 %</b> a más tardar el <b>19 de noviembre de 2026</b>. Quien se inscriba en los
			últimos días del periodo debe cubrir ambos pagos antes del cierre del <b>19 de noviembre</b>.
		</p>
		<p>
			<b>5.5. Medio de pago.</b> El pago se recibe únicamente por transferencia bancaria a la cuenta
			oficial del evento. No se reciben pagos en efectivo ni en otras cuentas.
		</p>
		<section class="box" aria-labelledby="cuenta">
			<h3 id="cuenta" class="box__title">Cuenta oficial del evento</h3>
			<dl class="kv">
				<dt>Banco</dt><dd>Bancolombia</dd>
				<dt>Tipo de cuenta</dt><dd>Ahorros</dd>
				<dt>Número</dt><dd class="mono">82100010485</dd>
				<dt>Titular</dt><dd>The Giants Community / Corporation</dd>
				<dt>NIT</dt><dd class="mono">901.750.048</dd>
			</dl>
		</section>
		<p>
			<b>5.6. Soporte de pago.</b> El competidor, o el acudiente en el caso de un menor, carga el
			comprobante de cada pago en el formulario o lo envía al correo oficial con el asunto:
			<span class="subject">NOMBRE ARTÍSTICO | CATEGORÍA | PAGO 1</span>, o
			<span class="subject">PAGO 2</span> según corresponda.
		</p>
		<p>
			<b>5.7. Inscripción en firme y fecha de inscripción.</b> La inscripción queda en firme cuando el
			competidor ha enviado el formulario completo y ha hecho el primer pago. La fecha de inscripción es
			la fecha y hora en que se cumplió el último de esos dos requisitos. Con ella se define el orden de
			salida en el filtro (numeral 7.5).
		</p>
		<p>
			<b>5.8. Segundo pago no realizado.</b> El competidor que al cierre del
			<b>19 de noviembre de 2026</b> no ha completado el segundo pago no queda habilitado para competir. Lo
			pagado no se reembolsa (numeral 5.9).
		</p>
		<p><b>5.9. No reembolsos.</b> Bajo ninguna circunstancia se hacen reembolsos.</p>
		<p>
			<b>5.10. Aceptación del reglamento.</b> Con el envío del formulario y el primer pago, el competidor,
			y su acudiente en el caso de un menor, aceptan este reglamento (numeral 14.9).
		</p>
		<p>
			<b>5.11. Acreditación.</b> El día de la competencia, antes del inicio de los filtros, cada
			competidor se presenta en la mesa de acreditación, donde la organización verifica su identidad
			contra el registro del formulario. Los menores se acreditan con su acudiente. Horario de
			acreditación: <b>por confirmar</b>.
		</p>
		<p>
			<b>5.12. Documentos válidos.</b> Cada competidor presenta su documento de identidad original,
			físico o digital: cédula de ciudadanía, tarjeta de identidad, cédula de extranjería, Permiso por
			Protección Temporal o pasaporte. Los menores de <b>7</b> años pueden presentar copia del registro
			civil de nacimiento. No se aceptan fotocopias ni fotografías de los demás documentos.
		</p>
		<p>
			<b>5.13. Competidor no acreditado.</b> Quien no supera la acreditación no compite. Cada competidor
			acreditado recibe una manilla, que lleva puesta durante toda la competencia.
		</p>
		{@render volver()}
	</section>

	<!-- 6 -->
	<section id="articulo-6" class="art">
		{@render articulo(6)}
		<p>
			<b>6.1. Fecha, hora y lugar.</b> Battles of Giants se desarrolla en una sola jornada, a partir de
			las <b>3:00 p. m.</b>, en el Espacio 10-60 de Santiago de Cali. Fecha:
			<b>domingo 22 de noviembre de 2026</b>.
		</p>
		<p>
			<b>6.2. Cronograma.</b> La organización publica por los canales oficiales el cronograma de la
			jornada, con el orden de las categorías y la hora estimada de cada fase, el día siguiente al cierre
			de inscripciones.
		</p>
		<p>
			<b>6.3. Fases.</b> Cada categoría tiene dos fases: el filtro (artículo 7) y las batallas. En las
			batallas se enfrentan dos competidores de la misma categoría, uno contra uno.
		</p>
		<p>
			<b>6.4. Top 16 o top 32.</b> En el evento, según la cantidad de competidores, se define si cada
			categoría clasifica un top 16 o un top 32.
		</p>
		<p>
			<b>6.5. Criterio para definir el top.</b> La categoría con <b>48</b> o más competidores acreditados
			clasifica un top 32. La que tiene entre <b>16</b> y <b>47</b> clasifica un top 16. La que tiene menos
			de <b>16</b> clasifica un top 8 y empieza en cuartos de final. El presentador anuncia el top de cada
			categoría antes de iniciar su filtro.
		</p>
		<p>
			<b>6.6. Rondas y salidas.</b> Desde el top hasta los cuartos de final, cada competidor hace una
			sola salida por batalla. Las semifinales son de dos salidas y la final de cada categoría es de tres
			salidas:
		</p>
		<div class="tbl">
			<table>
				<thead>
					<tr><th>Ronda</th><th class="num">Salidas por competidor</th><th>Voto de empate</th></tr>
				</thead>
				<tbody>
					{#each rondas as [ronda, salidas, empate]}
						<tr><td><b>{ronda}</b></td><td class="num">{salidas}</td><td>{empate}</td></tr>
					{/each}
				</tbody>
			</table>
		</div>
		<p>
			<b>6.7. Cuadro.</b> El cuadro se arma con la puntuación del filtro: el primero contra el último
			clasificado, el segundo contra el penúltimo, y así sucesivamente. El presentador lo anuncia antes de
			iniciar las batallas.
		</p>
		<p>
			<b>6.8. Orden de las salidas.</b> En cada batalla, el presentador sortea quién hace la primera
			salida. Desde ahí, los competidores alternan sus salidas.
		</p>
		<p>
			<b>6.9. Duración de las salidas.</b> En las batallas, cada salida dura hasta <b>1 minuto</b>. El
			presentador indica el final de cada salida.
		</p>
		<p>
			<b>6.10. Música.</b> La música de los filtros y de las batallas la pone el DJ del evento. Los
			competidores no eligen canciones ni llevan pistas propias. En Soul Train, el DJ pone funk y sus
			variantes. En 80's Battles, puede mezclar los géneros de los estilos de la categoría.
		</p>
		<p>
			<b>6.11. Llamado.</b> El competidor llamado por el presentador tiene <b>60 segundos</b> para
			presentarse en el área de batalla. Si no se presenta, pierde la batalla y su oponente avanza. En el
			filtro, pierde su turno y queda por fuera del top.
		</p>
		{@render volver()}
	</section>

	<!-- 7 -->
	<section id="articulo-7" class="art">
		{@render articulo(7)}
		<p><b>7.1. Duración.</b> Cada categoría tiene un filtro de <b>50 segundos</b> por competidor.</p>
		<p>
			<b>7.2. Filtro de Soul Train.</b> Se hace en formato Soul Train. Los competidores se organizan en dos
			filas según el orden de inscripción. Cada competidor tiene <b>50 segundos</b> para ir de atrás hacia
			adelante bailando el estilo con el que se inscribió.
		</p>
		<p>
			<b>7.3. Filtro de 80's Battles.</b> Se hace en formato showcase. Cada competidor hace una salida al
			centro de <b>50 segundos</b>.
		</p>
		<p>
			<b>7.4. Inicio del tiempo.</b> En los dos filtros, el tiempo empieza a contar cuando el competidor
			comienza a bailar en pleno. El cronometrista toma el tiempo y el presentador indica el final de la
			salida.
		</p>
		<p>
			<b>7.5. Orden del filtro de 80's Battles.</b> Los competidores salen según el orden de inscripción
			(numeral 5.7).
		</p>
		<p>
			<b>7.6. Calificación del filtro.</b> Cada juez califica a cada competidor de <b>1</b> a <b>10</b>, con
			un decimal, en la planilla del <a href="#anexo-1">Anexo 1</a>. Las tres calificaciones se suman,
			sobre un máximo de <b>30 puntos</b>, y los competidores con mayor puntuación forman el top.
		</p>
		<p>
			<b>7.7. Empate en el último cupo.</b> Si hay empate en la puntuación que define el último cupo del
			top, los competidores empatados definen el cupo en una batalla de una salida cada uno, sin voto de
			empate.
		</p>
		{@render volver()}
	</section>

	<!-- 8 -->
	<section id="articulo-8" class="art">
		{@render articulo(8)}
		<p>
			<b>8.1. Panel de jueces.</b> Cada categoría tiene <b>3</b> jueces. Los mismos tres jueces califican
			el filtro y deciden todas las batallas de su categoría.
		</p>
		<p>
			<b>8.2. Perfil de los jueces.</b> Los jueces de cada categoría tienen trayectoria reconocida en los
			estilos de esa categoría.
		</p>
		<p><b>8.3. Criterios.</b> En el filtro y en las batallas, los jueces valoran:</p>
		<ol class="alpha">
			<li>
				<b>Fundamentos y autenticidad:</b> dominio de las bases del estilo inscrito y respeto por su esencia.
			</li>
			<li><b>Musicalidad:</b> relación entre el movimiento y la música que pone el DJ.</li>
			<li><b>Técnica y control:</b> limpieza de la ejecución, control corporal y manejo de las dinámicas.</li>
			<li><b>Creatividad:</b> aporte propio dentro del estilo y capacidad de no repetirse entre salidas.</li>
			<li><b>Carácter y actitud de batalla:</b> presencia, confianza y respuesta al oponente.</li>
		</ol>
		<p>
			<b>8.4. Sistema de evaluación.</b> La evaluación es por puntuación. Al final de cada batalla, cada
			juez da su voto, que vale un punto, al competidor que considera ganador. En las rondas que lo
			permiten, el juez puede votar empate.
		</p>
		<p>
			<b>8.5. Forma de votar.</b> Los tres jueces votan al mismo tiempo, a la señal del presentador.
			Señalan al competidor ganador o cruzan los brazos para indicar empate. El presentador anuncia el
			resultado.
		</p>
		<p>
			<b>8.6. Rondas con voto de empate.</b> En el top 32, el top 16 y los cuartos de final, los jueces
			pueden votar empate. Gana la batalla el competidor que obtiene <b>2</b> o <b>3</b> votos. Por
			ejemplo, si <b>2</b> jueces votan empate y solo <b>1</b> vota por uno de los competidores, gana el
			empate. Los casos posibles son:
		</p>
		<div class="tbl">
			<table>
				<thead>
					<tr><th>Votos de los jueces</th><th>Resultado</th></tr>
				</thead>
				<tbody>
					{#each votos as [v, r]}
						<tr><td>{v}</td><td><b>{r}</b></td></tr>
					{/each}
				</tbody>
			</table>
		</div>
		<p>
			<b>8.7. Ronda de desempate.</b> Cuando una batalla termina en empate, se hace una ronda de
			desempate. En ella votan los tres jueces y no se permite votar empate.
		</p>
		<p>
			<b>8.8. Salidas del desempate.</b> En la ronda de desempate, cada competidor hace <b>1</b> salida
			más, en el mismo orden de la batalla.
		</p>
		<p>
			<b>8.9. Semifinal y final.</b> De semifinales a la final no se permite votar empate. Gana la batalla
			el competidor que obtiene <b>2</b> o <b>3</b> votos.
		</p>
		<p>
			<b>8.10. Réplica.</b> En semifinal y en la final, si un juez desea ver una salida más, los tres
			jueces lo conversan y pueden conceder una réplica. La réplica se concede si y solo si los tres
			jueces están de acuerdo, por unanimidad.
		</p>
		<p>
			<b>8.11. Desarrollo de la réplica.</b> La réplica se pide antes de la votación. En ella, cada
			competidor hace <b>1</b> salida más, en el mismo orden de la batalla, y después los jueces votan sin
			empate. Cada batalla tiene como máximo una réplica.
		</p>
		{@render volver()}
	</section>

	<!-- 9 -->
	<section id="articulo-9" class="art">
		{@render articulo(9)}
		<p>
			<b>9.1. Respeto.</b> Competidores y acudientes mantienen una conducta respetuosa con jueces,
			oponentes, personal de la organización y público durante toda la jornada.
		</p>
		<p>
			<b>9.2. Espacio del oponente.</b> Durante la salida del oponente, el competidor permanece en su lado
			del área de batalla. Responde con su baile en su propia salida.
		</p>
		<p>
			<b>9.3. Contacto físico.</b> Se prohíbe tocar, empujar o golpear al oponente, así como lanzarle
			objetos.
		</p>
		<p>
			<b>9.4. Provocación.</b> Las provocaciones propias de la cultura de batalla se permiten mientras no
			incluyan gestos obscenos, insultos ni ofensas por raza, género, orientación sexual, origen, religión
			o condición física.
		</p>
		<p><b>9.5. Graduación y sanciones.</b> Las faltas se gradúan así:</p>
		<div class="tbl">
			<table>
				<thead>
					<tr><th>Nivel</th><th>Conductas</th><th>Sanción</th></tr>
				</thead>
				<tbody>
					<tr>
						<td><b>Leve</b></td>
						<td>
							Invadir el espacio del oponente durante su salida, o un gesto o expresión irrespetuosa
							aislada.
						</td>
						<td>Amonestación de los jueces.</td>
					</tr>
					<tr>
						<td><b>Grave</b></td>
						<td>
							Gesto obsceno, insulto, ofensa del numeral 9.4, o repetir una falta leve después de la
							amonestación.
						</td>
						<td>Pérdida de la batalla.</td>
					</tr>
					<tr>
						<td><b>Gravísima</b></td>
						<td>Contacto físico del numeral 9.3, agresión, sabotaje o fraude de identidad.</td>
						<td>Descalificación y retiro del recinto.</td>
					</tr>
				</tbody>
			</table>
		</div>
		<p>
			<b>9.6. Quién decide.</b> Los tres jueces de la categoría califican la falta y aplican la sanción.
			La descalificación la deciden junto con el Director del Evento.
		</p>
		<p>
			<b>9.7. Público y acompañantes.</b> La conducta del público y de los acompañantes no afecta el
			resultado de las batallas. La organización puede pedir el retiro del recinto de cualquier persona
			que ponga en riesgo la seguridad del evento.
		</p>
		{@render volver()}
	</section>

	<!-- 10 -->
	<section id="articulo-10" class="art">
		{@render articulo(10)}
		<p>
			<b>10.1. Prioridad.</b> La seguridad de los competidores es la máxima prioridad y prevalece sobre
			cualquier consideración competitiva.
		</p>
		<p>
			<b>10.2. Lesión durante una batalla.</b> Si un competidor se lesiona y no puede continuar, la
			batalla se detiene y su oponente avanza.
		</p>
		<ol class="alpha">
			<li>
				El personal de salud del evento atiende al competidor en el área de batalla. Nadie lo mueve hasta
				que ese personal lo indique.
			</li>
			<li>
				El competidor atendido solo vuelve a competir ese día, en cualquiera de las categorías, con
				autorización del personal de salud del evento.
			</li>
			<li>
				El competidor, o su acudiente, informa de inmediato a la organización cualquier lesión o
				enfermedad, aunque ocurra fuera del área de batalla.
			</li>
		</ol>
		<p>
			<b>10.3. Falla de sonido.</b> Si la música se interrumpe durante una salida por una falla de la
			organización, la salida se repite completa.
		</p>
		<p><b>10.4. Elementos prohibidos.</b> Se prohíbe llevar al área de batalla:</p>
		<ol class="alpha">
			<li>fuego en cualquier forma, incluida la pirotecnia;</li>
			<li>todo elemento que simule un arma o cualquier objeto que incite a la violencia;</li>
			<li>animales vivos, y</li>
			<li>
				líquidos, polvos, purpurina, aceite o cualquier sustancia que dañe el piso o ponga en riesgo a
				los demás competidores.
			</li>
		</ol>
		<p>
			<b>10.5. Utilería y accesorios.</b> No se permite utilería en el filtro ni en las batallas. Se
			permiten los accesorios de vestuario propios de cada estilo, como gorras, sombreros o guantes.
		</p>
		{@render volver()}
	</section>

	<!-- 11 -->
	<section id="articulo-11" class="art">
		{@render articulo(11)}
		<p>
			<b>11.1. Resultados en el evento.</b> El resultado de cada batalla se anuncia en el momento de la
			votación. El ganador de cada categoría se conoce al terminar la final.
		</p>
		<p>
			<b>11.2. Publicación de resultados.</b> Dentro de los <b>2 días calendario</b> siguientes a la
			competencia, la organización publica por los canales oficiales el top de cada categoría con las
			puntuaciones del filtro, el cuadro completo y los ganadores.
		</p>
		<p>
			<b>11.3. Decisiones definitivas.</b> El voto de los jueces es definitivo. No hay reclamación contra
			la valoración de una salida ni contra el resultado de una votación.
		</p>
		<p>
			<b>11.4. Errores de procedimiento.</b> Si un competidor, o el acudiente de un menor, considera que en
			su batalla no se aplicó este reglamento, por ejemplo con un número de salidas distinto al de la
			ronda, lo informa al Director del Evento antes de que empiece la siguiente batalla de su categoría.
			El Director del Evento decide en el momento, con los jueces de la categoría, y su decisión es
			definitiva.
		</p>
		{@render volver()}
	</section>

	<!-- 12 -->
	<section id="articulo-12" class="art">
		{@render articulo(12)}
		<p>
			<b>12.1. Premio.</b> Se premia al ganador de cada categoría. Valor del premio de cada categoría:
			<b>$1.500.000 COP</b>.
		</p>
		<p>
			<b>12.2. Forma y plazo de pago.</b> El premio se paga por transferencia bancaria. Los
			<b>10 días calendario</b> siguientes al cierre del festival, del <b>23 de noviembre</b> al
			<b>2 de diciembre de 2026</b>, se destinan a la publicación de resultados y a la entrega de los
			documentos del numeral 12.4. El plazo para el pago empieza a contar el <b>2 de diciembre de 2026</b> y
			vence el <b>12 de diciembre de 2026</b>, fecha máxima para el desembolso.
		</p>
		<p>
			<b>12.3. Proceso.</b> Una vez finalizado el evento, la organización se comunica por los canales
			oficiales para solicitar los documentos legales y poner a disposición del ganador una pasarela de
			opciones de pago, de manera que reciba su premio conforme a la ley. La prioridad es que el premio se
			entregue completo, teniendo en cuenta que, por tratarse de una transacción bancaria, pueden existir
			cargas tributarias que debe asumir el ganador.
		</p>
		<p>
			<b>12.4. Documentos.</b> Una vez el ganador escoge la opción de pago, la organización solicita estos
			documentos:
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
			<b>12.5. Retenciones.</b> Si hay lugar a retenciones de ley, se informan al ganador antes de proceder
			al pago. Esa es la razón de ofrecer la pasarela de opciones: que el ganador escoja la alternativa que
			más le convenga.
		</p>
		<p>
			<b>12.6. Documentación incompleta.</b> Si al <b>2 de diciembre de 2026</b> el ganador no ha entregado
			los documentos completos, no aplica la fecha máxima del <b>12 de diciembre de 2026</b>. En ese caso,
			el pago se hace dentro de los <b>10 días calendario</b> siguientes a la entrega completa de los
			documentos.
		</p>
		<p>
			<b>12.7. Ganador menor de edad.</b> Si el ganador es menor de edad, el premio se paga a su acudiente,
			que presenta los documentos a su nombre junto con la tarjeta de identidad o el registro civil del
			menor.
		</p>
		{@render volver()}
	</section>

	<!-- 13 -->
	<section id="articulo-13" class="art">
		{@render articulo(13)}
		<p>
			<b>13.1. Titularidad del material audiovisual.</b> La organización es titular del material
			audiovisual registrado durante el evento y puede usarlo para difusión, memoria y gestión del
			festival.
		</p>
		<p>
			<b>13.2. Uso de imagen.</b> Con la inscripción, los competidores autorizan el uso de su imagen
			captada durante el evento para esos mismos fines, sin contraprestación económica. Para los menores de
			edad, esta autorización se soporta en la declaración del acudiente (numeral 4.2).
		</p>
		<p>
			<b>13.3. Uso de la marca.</b> El uso de las marcas Battles of Giants y Cali Capital por parte de los
			competidores requiere autorización previa de la organización, que se pide al correo oficial. Nombrar
			el evento o etiquetar sus cuentas oficiales en redes sociales no requiere autorización. Los
			competidores pueden publicar en sus redes el video de sus propias batallas.
		</p>
		<p>
			<b>13.4. Datos personales.</b> La Corporación para el Arte, el Deporte y la Cultura, The Giants
			Community, NIT <b>901.750.048</b>, es responsable del tratamiento de los datos personales que se
			entregan en la inscripción y la acreditación. Los datos se tratan conforme a la Ley 1581 de 2012 y sus
			normas reglamentarias, solo para gestionar la inscripción, la acreditación, la seguridad, la
			competencia, la premiación y las comunicaciones del evento. Los titulares pueden consultar,
			actualizar, rectificar o pedir la supresión de sus datos escribiendo al correo oficial.
		</p>
		{@render volver()}
	</section>

	<!-- 14 -->
	<section id="articulo-14" class="art">
		{@render articulo(14)}
		<p>
			<b>14.1. Protección de la integridad.</b> Battles of Giants adopta todas las medidas a su alcance
			para proteger la integridad de los competidores. Aun así, esa integridad depende de múltiples
			factores que el evento no controla en su totalidad, entre ellos la preparación física, el estado de
			salud y la ejecución de cada salida.
		</p>
		<p>
			<b>14.2. Espectáculo público de las artes escénicas.</b> Battles of Giants se realiza conforme a la
			Ley 1493 de 2011 y sus normas reglamentarias sobre espectáculos públicos de las artes escénicas. El
			evento cumple con las medidas y pólizas que esa norma exige al productor, incluida la póliza de
			responsabilidad civil extracontractual.
		</p>
		<p>
			<b>14.3. Asunción voluntaria del riesgo.</b> La participación es una decisión libre y voluntaria de
			cada competidor, quien asume los riesgos propios de la práctica y vela por su seguridad de manera
			individual. En el caso de los menores, esa decisión la toma también su acudiente.
		</p>
		<p>
			<b>14.4. Responsabilidad de la organización.</b> La organización responde por aquello que está bajo
			su control y por las obligaciones que le impone la ley. Ninguna disposición de este reglamento
			excluye su responsabilidad por dolo o culpa grave (Código Civil, artículos 63 y 1522) ni limita las
			obligaciones que le asigna la Ley 1480 de 2011, cuyos artículos 42 y 43 declaran ineficaces de pleno
			derecho las cláusulas que lo hagan.
		</p>
		<p>
			<b>14.5. Acceso a la justicia.</b> Nada en este reglamento restringe el derecho de acceso a la
			administración de justicia (Constitución Política, artículo 229). Lo que el competidor asume con la
			inscripción son los riesgos propios de la práctica, en los términos del numeral 14.3.
		</p>
		<p>
			<b>14.6. Casos no previstos.</b> Las situaciones que este reglamento no contemple las resuelven el
			Director del Evento y los jueces de la categoría.
		</p>
		<p>
			<b>14.7. Cambios al reglamento.</b> La organización puede ajustar este reglamento por razones
			logísticas, técnicas o de seguridad. Todo cambio se comunica por el correo oficial a los competidores
			inscritos antes de la competencia.
		</p>
		<p>
			<b>14.8. Límite de los cambios.</b> Ningún cambio puede modificar los valores de inscripción, el
			valor de los premios ni las condiciones de pago del premio.
		</p>
		<p>
			<b>14.9. Aceptación del reglamento.</b> Al realizar la inscripción a través del formulario y efectuar
			el primer pago, el competidor, y su acudiente en el caso de un menor, aceptan el presente reglamento
			en su totalidad, junto con todos sus términos y condiciones.
		</p>
		<p>
			<b>14.10. Contacto.</b> Las dudas sobre este reglamento se atienden en
			<a href="mailto:calicapitalfest@thegiantsco.com">calicapitalfest@thegiantsco.com</a>.
		</p>

		<blockquote class="closing">
			Battles of Giants existe para que cada estilo tenga su espacio y sus representantes en Cali. Cada
			salida es una oportunidad de mostrar de dónde viene tu danza y hasta dónde la puedes llevar. Que gane
			quien mejor defienda su estilo.
		</blockquote>

		<footer class="sign">
			<p>Santiago de Cali, septiembre de 2026</p>
			<p class="sign__name">The Giants Community</p>
			<p>Corporación para el Arte, el Deporte y la Cultura</p>
			<p>NIT 901.750.048</p>
			<p class="sign__name">Cristian Camilo Pastusano Guetio</p>
			<p>Representante legal</p>
		</footer>
		{@render volver()}
	</section>

	<!-- Anexo 1 -->
	<section id="anexo-1" class="art">
		<header class="art__head">
			<p class="art__num">Anexo 1</p>
			<h2 class="font-display art__title"><DisplayText text="Planilla del filtro" /></h2>
		</header>
		<p>Cada juez diligencia una planilla por categoría (numeral 7.6).</p>
		<section class="sheet sheet--wide">
			<h3 class="sheet__title">Planilla del filtro</h3>
			<p class="sheet__fields">Nombre del juez · Categoría: Soul Train o 80's Battles</p>
			<div class="tbl">
				<table>
					<thead>
						<tr>
							<th class="num">Orden</th>
							<th>Nombre artístico</th>
							<th>Estilo</th>
							<th class="num">Puntuación (1 a 10)</th>
							<th>Observaciones</th>
						</tr>
					</thead>
					<tbody>
						{#each ["1", "2", "3", "…", "20"] as n}
							<tr><td class="num">{n}</td><td></td><td></td><td></td><td></td></tr>
						{/each}
					</tbody>
				</table>
			</div>
			<p class="sheet__fields">Firma del juez</p>
		</section>
		{@render volver()}
	</section>
</Reglamento>
