<script lang="ts">
	import Item from "$lib/components/Slideshow/Item.svelte";
	import Slide from "$lib/components/Slideshow/Slide.svelte";
	import Slideshow from "$lib/components/Slideshow/Slideshow.svelte";
	import Title from "$lib/components/Slideshow/Title.svelte";
</script>

<div class="w-full flex justify-center pt-9 pb-0">
	<h2 class="page-title bg-gradient-to-t from-[var(--primary)]/70 to-[var(--primary)]/40 backdrop-blur-md px-8 py-3 rounded-2xl text-center max-w-[85%]">Cronograma Talleres</h2>
</div>

<Slideshow totalSlides={6}>
	<!-- Slide 1: Martes 18 -->
	<Slide>
		<Title 
			title="Lanzamiento y Talleres"
			subtitle="Palmetto Plaza"
			date="18/11/2025" 
		/>
		<div class="space-y-2">
			<Item
				event=""
				title=" "
				subtitle="Registro y lanzamiento oficial"
				color="#22C55E"
				time="5:00 PM"
			/>
			<Item
				event="Taller Nacional"
				title="Diego Casas"
				subtitle="Kidultz"
				color="#F57A94"
				time="6:00 PM"
			/>
			<Item
				event="Taller Local"
				title="Valoyes x Tian"
				subtitle="The Giants Co"
				color="#1CA3DD"
				time="7:30 PM"
			/>
			<Item
				event="Taller Nacional"
				title="De los Ríos"
				subtitle="Medellín"
				color="#F57A94"
				time="9:00 PM"
			/>
		</div>
	</Slide>

	<!-- Slide 2: Miércoles 19 -->
	<Slide>
		<Title 
			title="Talleres Locales"
			subtitle="The Giants Co - Las Pilas"
			date="19/11/2025" 
		/>
		<div class="space-y-2">
			<Item
				event=""
				title=" "
				subtitle="Registro y apertura"
				color="#22C55E"
				time="4:00 PM"
			/>
			<Item
				event="Taller Local"
				title="Lupy x Daniel Gonzales"
				subtitle="Kimera x Kirei"
				color="#1CA3DD"
				time="4:30 PM"
			/>
			<Item
				event="Taller Local"
				title="George Ríos"
				subtitle="Agua Blanca Baila"
				color="#1CA3DD"
				time="6:00 PM"
			/>
			<Item
				event="Taller Local"
				title="Mariana Herrera x Ángel Rayo"
				subtitle="Fire Dance Complex"
				color="#1CA3DD"
				time="7:30 PM"
			/>
			<Item
				event="Taller Nacional"
				title="Baby Fox"
				subtitle="Bogotá"
				color="#F57A94"
				time="9:00 PM"
			/>
		</div>
	</Slide>

	<!-- Slide 3: Jueves 20 -->
	<Slide>
		<Title 
			title="Talleres Nacionales"
			subtitle="The Giants Co - Las Pilas"
			date="20/11/2025" 
		/>
		<div class="space-y-2">
			<Item
				event=""
				title=" "
				subtitle="Registro y apertura"
				color="#22C55E"
				time="5:00 PM"
			/>
			<Item
				event="Taller Nacional"
				title="Alex x Juanes"
				subtitle="2Han Dance Contest"
				color="#F57A94"
				time="6:00 PM"
			/>
			<Item
				event="Taller Nacional"
				title="Erwin"
				subtitle="Bogotá"
				color="#F57A94"
				time="7:30 PM"
			/>
			<Item
				event="Taller Local"
				title="Andrea Acevedo x Gekko"
				subtitle="Kidultz x Inception"
				color="#1CA3DD"
				time="9:00 PM"
			/>
		</div>
	</Slide>

	<!-- Slide 4: Viernes 21 -->
	<Slide>
		<Title 
			title="Conversatorio & Fiesta"
			subtitle="Centro Cultural Comfandi"
			date="21/11/2025" 
		/>
		<div class="space-y-2">
			<Item
				event=""
				title=" "
				subtitle="Registro & Legalización"
				color="#22C55E"
				time="6:00 PM"
			/>
			<Item
				title="🎤 Talking with Giants"
				subtitle="Henry Link & Mr Wiggles"
				event="Electric Boogaloos | Rock Steady Crew | Elite Force Crew | The Giants Co | Internacional"
				description="¿Cómo evolucionamos a Cali como una Capital de la Industria Artística, cultura y deportiva de Latam y el Mundo?"
				color="#EAAC2A"
				time="7:30 PM"
			/>
			<Item
				title="🎉 Meat & Great"
				subtitle="Calle de Sabor"
				event="Actividad de Ciudad"
				color="#FF6EEF"
				time="8:30 PM"
			/>
		</div>
	</Slide>

	<!-- Slide 5: Sábado 22 (Workshops) -->
	<Slide>
		<Title 
			title="The Biggest Workshops"
			subtitle="Centro Cultural Comfandi"
			date="22/11/2025"
			badge="COVER"
			badge_color="purple"
		/>
		<div class="space-y-2">
			<Item
				event=""
				title=" "
				subtitle="Registro"
				color="#22C55E"
				time="8:30 AM"
			/>
			<Item
				event="Taller Internacional"
				title="Henry Link"
				subtitle="ELITE FORCE CREW - U.S.A"
				color="#F04E40"
				time="9:00 AM"
			/>
			<Item
				event="Taller Internacional"
				title="Mr Wiggles"
				subtitle="ELECTRIC BOOGALOOS & ROCK STEADY CREW - U.S.A"
				color="#F04E40"
				time="10:30 AM"
			/>
		</div>
	</Slide>

	<!-- Slide 7: Domingo 23 (Workshops) -->
	<Slide>
		<Title 
			title="The Biggest Workshops"
			subtitle="Coliseo de Hockey"
			date="23/11/2025"
			badge="COVER"
			badge_color="purple"
		/>
		<div class="space-y-2">
			<Item
				event=""
				title=" "
				subtitle="Registro"
				color="#22C55E"
				time="8:00 AM"
			/>
			<Item
				event="Taller Internacional"
				title="Gunmin"
				subtitle="JUST JERK - COREA"
				color="#F04E40"
				time="9:00 AM"
			/>
			<Item
				event="Taller Internacional"
				title="Audrey Lane"
				subtitle="JAM REPUBLIC - U.S.A"
				color="#F04E40"
				time="10:30 AM"
			/>
			<Item
				event="Taller Internacional"
				title="Melvin Tim Tim"
				subtitle="LEGACY ENTERTAIMENT GROUP - U.S.A"
				color="#F04E40"
				time="12:00 PM"
			/>
		</div>
	</Slide>
</Slideshow>