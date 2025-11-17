<script lang="ts">
	import Slide from "$lib/components/Slideshow/Slide.svelte";
	import Slideshow from "$lib/components/Slideshow/Slideshow.svelte";
	
	const locations = [
		{
			name: "Palmetto Plaza Shopping Mall",
			address: "Calle 5 #36-135, Cali",
			embed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3982.5466585709377!2d-76.543372!3d3.4129053!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e30a6af05707fc1%3A0xd083a753c7398fb8!2sPalmetto%20Plaza%20Shopping%20Mall!5e0!3m2!1sen!2sco!4v1234567890"
		},
		{
			name: "Centro de Eventos Las Pilas",
			address: "The Giants Co - Las Pilas, Cali",
			embed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3982.5838719144853!2d-76.5404098!3d3.4060985!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e30a6ad651f18ab%3A0x58bc4eb07d0cd2aa!2sEvent%20Center%20Las%20Pilas!5e0!3m2!1sen!2sco!4v1234567890"
		},
		{
			name: "Centro Cultural Comfandi",
			address: "Carrera 5 #6-05, Cali",
			embed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3982.3544698373566!2d-76.5369395!3d3.4482429!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e30a6648642e841%3A0x54954be67666e642!2sComfandi%20Cultural%20Center!5e0!3m2!1sen!2sco!4v1234567890"
		},
		{
			name: "Coliseo de Hockey Miguel Calero",
			address: "Calle 5 #50-11, Cali",
			embed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3982.5055854819644!2d-76.5407222!3d3.4220133!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e30a6a2d9b2e2a9%3A0xc51f5a920dfc9acd!2sColiseum%20Hockey%20Online%20Miguel%20Calero!5e0!3m2!1sen!2sco!4v1234567890"
		},
		{
			name: "La Calle del Sabor",
			address: "Calle 6 #24-82, Cali",
			embed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3982.333544850825!2d-76.536546!3d3.4517961!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e30a7798f20c4df%3A0xcdcfa617d0f5d386!2sLa%20Calle%20del%20Sabor!5e0!3m2!1sen!2sco!4v1234567890"
		}
	];
</script>

<div class="w-full flex justify-center pt-9 pb-0">
	<h2 class="page-title bg-gradient-to-t from-[var(--primary)]/70 to-[var(--primary)]/40 backdrop-blur-md px-8 py-3 rounded-2xl text-center max-w-[85%]">Ubicaciones</h2>
</div>

<Slideshow totalSlides={locations.length}>
	{#each locations as location}
		<Slide>
			<div class="space-y-4">
				<div class="text-center mb-4">
					<h3 class="text-2xl md:text-3xl font-bold text-white mb-2">{location.name}</h3>
					<p class="text-white/80 text-sm md:text-base">{location.address}</p>
				</div>
				<div class="w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden border-2 border-white/20">
					<iframe
						src={location.embed}
						width="100%"
						height="100%"
						style="border:0;"
						loading="lazy"
						referrerpolicy="no-referrer-when-downgrade"
						title={location.name}
					></iframe>
				</div>
			</div>
		</Slide>
	{/each}
</Slideshow>