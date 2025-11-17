<script lang="ts">
	import Item from "$lib/components/Slideshow/Item.svelte";
	import Slide from "$lib/components/Slideshow/Slide.svelte";
	import Slideshow from "$lib/components/Slideshow/Slideshow.svelte";
	import Title from "$lib/components/Slideshow/Title.svelte";
</script>

<div class="w-full flex justify-center pt-8 pb-4">
	<h1 class="text-4xl md:text-6xl font-bold text-white bg-black/50 backdrop-blur-md px-8 py-4 rounded-2xl">Talleres Locales y Nacionales</h1>
</div>

<Slideshow>
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
				title=""
				subtitle="Registro y lanzamiento oficial"
				color="#22C55E"
				time="5:00 PM"
			/>
			<Item
				event="Taller Nacional"
				title="Diego Casas"
				subtitle="Kidultz"
				color="#9333EA"
				time="6:00 PM"
			/>
			<Item
				event="Taller Local"
				title="Valoyes x Tian"
				subtitle="The Giants Co"
				color="#2563EB"
				time="7:30 PM"
			/>
			<Item
				event="Taller Nacional"
				title="De los Ríos"
				subtitle="Medellín"
				color="#9333EA"
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
				title=""
				subtitle="Registro y apertura"
				color="#22C55E"
				time="4:00 PM"
			/>
			<Item
				event="Taller Local"
				title="Lupy x Daniel Gonzales"
				subtitle="Kimera x Kirei"
				color="#2563EB"
				time="4:30 PM"
			/>
			<Item
				event="Taller Local"
				title="George Ríos"
				subtitle="Agua Blanca Baila"
				color="#2563EB"
				time="6:00 PM"
			/>
			<Item
				event="Taller Local"
				title="Mariana Herrera x Ángel Rayo"
				subtitle="Fire Dance Complex"
				color="#2563EB"
				time="7:30 PM"
			/>
			<Item
				event="Taller Nacional"
				title="Baby Fox"
				subtitle="Bogotá"
				color="#9333EA"
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
				title=""
				subtitle="Registro y apertura"
				color="#22C55E"
				time="5:00 PM"
			/>
			<Item
				event="Taller Nacional"
				title="Alex x Juanes"
				subtitle="2Han Dance Contest"
				color="#9333EA"
				time="6:00 PM"
			/>
			<Item
				event="Taller Nacional"
				title="Erwin"
				subtitle="Bogotá"
				color="#9333EA"
				time="7:30 PM"
			/>
			<Item
				event="Taller Local"
				title="Andrea Acevedo x Gekko"
				subtitle="Kidultz x Inception"
				color="#2563EB"
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
				title=""
				subtitle="Registro & Legalización"
				color="#22C55E"
				time="6:00 PM"
			/>
			<Item
				title="🎤 Talking with Giants"
				subtitle="Henry Link & Mr Wiggles"
				event="Electric Boogaloos | Rock Steady Crew | Elite Force Crew | The Giants Co | Internacional"
				description="¿Cómo evolucionamos a Cali como una Capital de la Industria Artística, cultura y deportiva de Latam y el Mundo?"
				color="#CA8A04"
				time="7:30 PM"
				highlight={true}
			/>
			<Item
				title="🎉 Meat & Great"
				subtitle="Calle de Sabor"
				event="Actividad de Ciudad"
				color="#DB2777"
				time="8:30 PM"
			/>
		</div>
	</Slide>
</Slideshow>