<script lang="ts">
	const sponsors = [
		{ name: "The Giants Co", img: "00. THEGIANTSCO.png" },
		{ name: "Artes para la paz", img: "1. artes para la paz.png" },
		{ name: "Culturas", img: "2. culturas.png" },
		{ name: "Skacepop", img: "3. skacepop.png" },
		{ name: "Palmeto", img: "4. palmeto.png" },
		{ name: "Gobernación", img: "5. gobernacion.png" },
		{ name: "Cacumen", img: "6. cacumen.png" },
		{ name: "2HAN", img: "7. 2HAN.png" },
		{ name: "Comfandi", img: "8. COMFANDI.png" },
		{ name: "Liga de Porrismo", img: "9. LIGA DE PORRISMO.PNG" }
	];
</script>

<div class="w-full flex justify-center pt-9 pb-0">
	<h2 class="page-title bg-gradient-to-t from-[var(--primary)]/70 to-[var(--primary)]/40 backdrop-blur-md px-8 py-3 rounded-2xl text-center max-w-[85%]">
		Patrocinadores
	</h2>
</div>

<div class="w-full flex justify-center p-2">
	<div class="relative w-full max-w-6xl">
		<div class="relative bg-gradient-to-t from-[var(--primary)]/90 to-[var(--secondary)]/90 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
			<div class="grid grid-cols-2 md:grid-cols-3 gap-6">
				{#each sponsors as sponsor}
					<div class="flex items-center justify-center p-4 bg-white/10 rounded-xl">
						<img
							src="/assets/patrocinadores/{sponsor.img}"
							alt={sponsor.name}
							class="max-w-full max-h-32 object-contain"
						/>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>