<script lang="ts">
	import { onMount } from "svelte";
	import { AngleRightOutline, AngleLeftOutline } from "flowbite-svelte-icons";

	const judges = [
		{ name: "Audrey Lane", crew: "JAM REPUBLIC - U.S.A", img: "audrey.png" },
		{ name: "Gunmin", crew: "JUST JERK - COREA", img: "gunmin.png" },
		{ name: "Henry Link", crew: "ELITE FORCE CREW - U.S.A", img: "henry link.png" },
		{ name: "Mr Wiggles", crew: "ELECTRIC BOOGALOOS & ROCK STEADY CREW - U.S.A", img: "mr wiggles.png" },
		{ name: "Melvin Tim Tim", crew: "LEGACY ENTERTAINMENT GROUP - U.S.A", img: "tim tim.png" }
	];

	let currentIndex = 0;
	let intervalId: ReturnType<typeof setInterval>;
	let isTransitioning = false;

	$: leftIndex = (currentIndex - 1 + judges.length) % judges.length;
	$: rightIndex = (currentIndex + 1) % judges.length;

	onMount(() => {
		intervalId = setInterval(() => {
			changeJudge((currentIndex + 1) % judges.length);
		}, 4000);

		return () => {
			if (intervalId) clearInterval(intervalId);
		};
	});

	function changeJudge(newIndex: number) {
		isTransitioning = true;
		setTimeout(() => {
			currentIndex = newIndex;
		}, 100);
		setTimeout(() => {
			isTransitioning = false;
		}, 150);
	}

	function goToJudge(index: number) {
		if (intervalId) clearInterval(intervalId);
		changeJudge(index);
		intervalId = setInterval(() => {
			changeJudge((currentIndex + 1) % judges.length);
		}, 4000);
	}
</script>

<div class="w-full flex justify-center pt-9 pb-0">
	<h2 class="page-title bg-gradient-to-t from-[var(--primary)]/70 to-[var(--primary)]/40 backdrop-blur-md px-8 py-3 rounded-2xl text-center max-w-[85%]">
		Jurados Internacionales
	</h2>
</div>

<div class="w-full flex justify-center p-2">
	<div class="relative w-full max-w-6xl">
		<div class="relative bg-gradient-to-t from-[var(--primary)]/90 to-[var(--secondary)]/90 backdrop-blur-md rounded-3xl pb-4 shadow-2xl min-h-[500px] flex flex-col items-center justify-center overflow-hidden">
			<div class="relative w-full h-[450px] md:h-[520px]">
				<div 
					class="absolute left-0 right-0 w-full h-full flex justify-center"
					style="bottom: -150px;"
				>
					<div 
						class="w-full h-full bg-contain bg-bottom bg-center bg-no-repeat opacity-70"
						style="background-image: url('/assets/piso curvo2.png');"
					></div>
				</div>

				<div class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/5 w-[70%] h-full opacity-50 scale-75 flex items-center justify-center">
					<img
						src="/assets/{judges[leftIndex].img}"
						alt={judges[leftIndex].name}
						class="max-w-full max-h-full object-contain filter brightness-50"
					/>
				</div>

				<div class="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[70%] h-full z-10 flex items-center justify-center">
					{#key currentIndex}
						<img
							src="/assets/{judges[currentIndex].img}"
							alt={judges[currentIndex].name}
							class="max-w-full max-h-full object-contain animate-fade-in"
						/>
					{/key}
				</div>

				<div class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/5 w-[70%] h-full opacity-50 scale-75 flex items-center justify-center">
					<img
						src="/assets/{judges[rightIndex].img}"
						alt={judges[rightIndex].name}
						class="max-w-full max-h-full object-contain filter brightness-50"
					/>
				</div>
			</div>

			<div class="relative flex items-center justify-center w-full">
				<button
					on:click={() => goToJudge(leftIndex)}
					aria-label="Previous judge"
					class="absolute left-4 bg-white/50 rounded-full p-2 text-white hover:text-[var(--primary)] transition-colors"
				>
					<AngleLeftOutline class="w-10 h-10" />
				</button>

				<div class="text-center">
					<h3 class="text-3xl md:text-4xl font-bold text-white mb-2">
						{judges[currentIndex].name}
					</h3>
					<p class="text-white/90 text-lg md:text-xl">
						{judges[currentIndex].crew}
					</p>
				</div>

				<button
					on:click={() => goToJudge(rightIndex)}
					aria-label="Next judge"
					class="absolute right-4 bg-white/50 rounded-full p-2 text-white hover:text-[var(--primary)] transition-colors"
				>
					<AngleRightOutline class="w-10 h-10" />
				</button>
			</div>
		</div>

		<div class="flex justify-center gap-2 mt-4">
			{#each judges as _, index}
				<button
					on:click={() => goToJudge(index)}
					aria-label={`Go to judge ${index + 1}`}
					class="transition-all {currentIndex === index
						? 'bg-[var(--primary)]/50 w-8 h-3'
						: 'bg-[var(--secondary)]/50 w-3 h-3'} rounded-full"
				></button>
			{/each}
		</div>
	</div>
</div>

<style>
	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.animate-fade-in {
		animation: fade-in 0.5s ease-out;
	}
</style>