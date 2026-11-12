<script lang="ts">
	import { base } from "$app/paths";
	import DisplayText from "$lib/components/2026/DisplayText.svelte";
	import Reglamento from "$lib/components/2026/Reglamento.svelte";

	// Terms of the Faith Pass Instagram giveaway, text as supplied by the team.

	const secciones = [
		"Organizador",
		"Vigencia",
		"Quién puede participar",
		"Cómo participar",
		"Condiciones de validez",
		"Premio",
		"Sorteo",
		"Entrega del premio",
		"Datos personales e imagen",
		"Disposiciones finales"
	];
</script>

<svelte:head>
	<title>Términos y condiciones · Sorteo Faith Pass · Cali Capital Fest</title>
	<meta
		name="description"
		content="Términos y condiciones del sorteo de 2 Faith Pass de Cali Capital 2026 en Instagram. Sorteo en vivo el domingo 15 de noviembre de 2026 a las 5:00 p. m."
	/>
</svelte:head>

{#snippet seccion(n: number)}
	<header class="art__head">
		<h2 class="font-display art__title">{n}. <DisplayText text={secciones[n - 1]} /></h2>
	</header>
{/snippet}

<Reglamento
	back={{ href: `${base}/#paquetes`, label: "Paquetes" }}
	kicker="Términos y condiciones"
	title="Sorteo Faith Pass"
	subs={["Cali Capital 2026"]}
>
	<!-- 1 -->
	<section id="seccion-1" class="art">
		{@render seccion(1)}
		<p>
			Corporación para el Arte, el Deporte y la Cultura, The Giants Co. NIT 901.750.048. Cali, Colombia.
		</p>
	</section>

	<!-- 2 -->
	<section id="seccion-2" class="art">
		{@render seccion(2)}
		<p>
			Participan las acciones realizadas desde la publicación de la pieza oficial hasta el domingo 15 de
			noviembre de 2026 a las 5:00 p. m., hora de Colombia, momento en que inicia el en vivo del sorteo.
			Los comentarios publicados después del inicio del en vivo no entran en el sorteo.
		</p>
	</section>

	<!-- 3 -->
	<section id="seccion-3" class="art">
		{@render seccion(3)}
		<ul class="dots">
			<li>Personas residentes en Colombia.</li>
			<li>
				El sorteo está dirigido únicamente a quienes aún no han adquirido su Faith Pass. Quien ya lo haya
				comprado al momento del sorteo no puede recibir este premio.
			</li>
			<li>
				Los menores de edad pueden participar, pero en caso de resultar ganadores deberán presentar
				autorización firmada del padre, madre o acudiente.
			</li>
			<li>
				No pueden participar el equipo de trabajo de The Giants Co, los talleristas del festival ni sus
				familiares directos.
			</li>
			<li>La participación es gratuita y no exige ninguna compra ni pago.</li>
		</ul>
	</section>

	<!-- 4 -->
	<section id="seccion-4" class="art">
		{@render seccion(4)}
		<p>Para que la participación sea válida se deben cumplir los cuatro pasos:</p>
		<ol class="steps">
			<li><span>Seguir la cuenta <b>@calicapitalfest</b> en Instagram.</span></li>
			<li>
				<span>
					Publicar el video oficial de Cali Capital 2026 en las historias, etiquetando a
					<b>@calicapitalfest</b>. La etiqueta es obligatoria, es el único soporte de verificación de este
					paso.
				</span>
			</li>
			<li>
				<span>
					Repostear el video oficial en el feed del perfil y mantenerlo publicado hasta el día del sorteo.
				</span>
			</li>
			<li><span>Comentar la publicación oficial etiquetando a 2 personas.</span></li>
		</ol>
		<p>
			Se puede comentar las veces que se quiera. Cada comentario con 2 amigos diferentes cuenta como una
			oportunidad adicional.
		</p>
	</section>

	<!-- 5 -->
	<section id="seccion-5" class="art">
		{@render seccion(5)}
		<ul class="dots">
			<li>El perfil debe permanecer público hasta el anuncio del ganador.</li>
			<li>Las 2 personas etiquetadas en cada comentario deben ser reales y distintas entre sí.</li>
			<li>
				No se aceptan cuentas falsas, bots, perfiles creados para la dinámica ni cuentas sin actividad.
			</li>
			<li>No se aceptan comentarios que repitan la misma pareja de etiquetados.</li>
			<li>
				Si al verificar el ganador no se cumple alguno de los cuatro pasos, la participación queda anulada
				y se elige a otra persona.
			</li>
		</ul>
	</section>

	<!-- 6 -->
	<section id="seccion-6" class="art">
		{@render seccion(6)}
		<p>Se entregan 2 Faith Pass, uno por ganador. Una misma persona no puede ganar los dos.</p>

		<div class="box">
			<h3 class="box__title">El Faith Pass incluye</h3>
			<p>Acceso a los 12 talleres de la programación oficial de Cali Capital 2026.</p>
			<h3 class="box__title">El Faith Pass no incluye</h3>
			<p>
				Entrada al evento como público, inscripción a la competencia, batallas, transporte, alojamiento,
				alimentación ni ningún otro servicio.
			</p>
		</div>

		<p><b>Condiciones del premio:</b></p>
		<ul class="dots">
			<li>
				El premio se otorga exclusivamente a personas que no hayan adquirido previamente un Faith Pass. Si
				el seleccionado ya cuenta con uno, la organización elegirá a otra persona de forma aleatoria.
			</li>
			<li>Es personal e intransferible, no es canjeable por dinero y no se puede revender.</li>
			<li>
				Es válido únicamente para la edición 2026 del festival y no se aplaza a ediciones futuras.
			</li>
			<li>Está sujeto a los cupos y horarios de cada taller.</li>
			<li>
				La organización puede ajustar la programación, reprogramar clases o cambiar talleristas por
				fuerza mayor, sin que esto genere compensación.
			</li>
			<li>La inasistencia a un taller no da derecho a reposición.</li>
		</ul>
	</section>

	<!-- 7 -->
	<section id="seccion-7" class="art">
		{@render seccion(7)}
		<ul class="dots">
			<li>
				Se realiza en vivo por Instagram el domingo 15 de noviembre de 2026 a las 5:00 p. m., hora de
				Colombia.
			</li>
			<li>
				La selección se hace con una herramienta de elección aleatoria sobre la lista de comentarios
				válidos.
			</li>
			<li>
				Después del sorteo se verifica el cumplimiento de los requisitos. Si el seleccionado no cumple, se
				elige al siguiente de forma aleatoria.
			</li>
		</ul>
	</section>

	<!-- 8 -->
	<section id="seccion-8" class="art">
		{@render seccion(8)}
		<ul class="dots">
			<li>
				El ganador se anuncia en el en vivo y se contacta por mensaje directo desde la cuenta oficial
				<b>@calicapitalfest</b>. La organización no escribe desde otras cuentas ni solicita datos
				bancarios, claves ni pagos de ningún tipo.
			</li>
			<li>El ganador tiene 24 horas para responder. Si no lo hace, se elige a otra persona.</li>
			<li>
				La organización verificará en su base de inscritos que el ganador no haya adquirido previamente
				un Faith Pass. Si se comprueba la compra, la participación queda anulada y se elige a otra
				persona.
			</li>
			<li>
				Debe estar en Cali entre el 17 y el 22 de noviembre de 2026. Transporte, alojamiento y
				alimentación corren por su cuenta.
			</li>
			<li>
				Debe acreditarse presencialmente con documento de identidad antes de su primer taller. El nombre
				del documento debe corresponder al de la cuenta ganadora.
			</li>
			<li>
				Si es menor de edad, el premio se entrega únicamente con autorización firmada del padre, madre o
				acudiente, quien además firmará el consentimiento de participación en los talleres.
			</li>
			<li>
				Al acreditarse, el ganador firma el consentimiento informado de actividad física y declara estar
				en condiciones de salud para participar en clases de danza.
			</li>
			<li>
				El ganador debe cumplir el reglamento del festival y su código de convivencia. La organización
				puede retirar el pase, sin reposición, ante conductas que afecten a talleristas, participantes o
				al desarrollo del evento.
			</li>
		</ul>
	</section>

	<!-- 9 -->
	<section id="seccion-9" class="art">
		{@render seccion(9)}
		<ul class="dots">
			<li>
				Al participar se autoriza el tratamiento de los datos personales conforme a la Ley 1581 de 2012 y
				a la política de tratamiento de datos de The Giants Co, únicamente para los fines de esta dinámica
				y la comunicación del festival.
			</li>
			<li>
				El ganador autoriza el uso de su nombre de usuario, imagen y voz en las piezas de comunicación del
				festival, sin contraprestación económica.
			</li>
		</ul>
	</section>

	<!-- 10 -->
	<section id="seccion-10" class="art">
		{@render seccion(10)}
		<ul class="dots">
			<li>
				Esta promoción no está patrocinada, avalada ni administrada por Instagram ni por Meta, ni está
				asociada a ellos. Al participar, se libera a Instagram de cualquier responsabilidad.
			</li>
			<li>
				La organización puede modificar, suspender o cancelar la dinámica por razones de fuerza mayor,
				informándolo por sus canales oficiales.
			</li>
			<li>La participación implica la aceptación total de estos términos y condiciones.</li>
		</ul>
	</section>
</Reglamento>
