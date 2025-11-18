<script lang="ts">
	import Item from "$lib/components/Slideshow/Item.svelte";
	import Slide from "$lib/components/Slideshow/Slide.svelte";
	import Slideshow from "$lib/components/Slideshow/Slideshow.svelte";
	import Title from "$lib/components/Slideshow/Title.svelte";
</script>

<div class="w-full flex justify-center pt-8 pb-0">
	<h2 class="page-title bg-gradient-to-t from-[var(--primary)]/70 to-[var(--primary)]/40 backdrop-blur-md px-8 py-3 rounded-2xl text-center max-w-[85%]">Cronograma Batallas</h2>
</div>

<Slideshow totalSlides={2}>
	<!-- Slide 6: Sábado 22 (Competitions) -->
	<Slide>
		<Title 
			title="Competencias Grupales"
			subtitle="Coliseo de Hockey"
			date="22/11/2025"
			badge="COVER"
			badge_color="purple"
		/>
		<div class="space-y-2">
			<Item
				event="League of Giants"
				title=""
				subtitle="Apertura"
				color="#22C55E"
				time="2:00 PM"
			/>
			<Item
				event="Filtro Categoría"
				title="Street Dance"
				subtitle=""
				color="#1CA2DC"
				time="3:00 PM"
			/>
			<Item
				event="Filtro Categoría"
				title="Kpop DC"
				subtitle=""
				color="#1CA2DC"
				time="5:00 PM"
			/>
			<Item
				event="Batallas de Freestyle Dance"
				title="From 80's Battles"
				subtitle="Filtro"
				color="#FF6EEF"
				time="7:00 PM"
			/>
		</div>
	</Slide>

	<!-- Slide 8: Domingo 23 (Finals) -->
	<Slide>
		<Title 
			title="Finales"
			subtitle="Coliseo de Hockey"
			date="23/11/2025"
			badge="COVER"
			badge_color="purple"
		/>
		<div class="space-y-2">
			<Item
				event="League of Giants"
				title=""
				subtitle="Registro"
				color="#22C55E"
				time="2:00 PM"
			/>
			<Item
				event="Finales"
				title="Street Dance"
				subtitle=""
				color="#1CA2DC"
				time="3:00 PM"
			/>
			<Item
				event="Finales"
				title="Kpop DC"
				subtitle=""
				color="#1CA2DC"
				time="5:00 PM"
			/>
			<Item
				event="Batallas de Freestyle Dance"
				title="Soul Train"
				subtitle="Filtro"
				color="#FF6EEF"
				time="6:00 PM"
			/>
			<Item
				event="Top 16"
				title="From 80's"
				subtitle=""
				color="#FF6EEF"
				time="7:00 PM"
			/>
			<Item
				event="Top 16"
				title="Soul Train"
				subtitle=""
				color="#FF6EEF"
				time="8:00 PM"
			/>
			<Item
				title="🏆 PREMIACIONES"
				subtitle=""
				event=""
				color="#EAAC2A"
				time="9:00 PM"
			/>
		</div>
	</Slide>
</Slideshow>