<script lang="ts">
	import { onMount } from "svelte";
	import { setContext } from "svelte";
	import { AngleRightOutline, AngleLeftOutline } from "flowbite-svelte-icons";

	let currentSlide = 0;
	export let totalSlides: number = 1;
	let intervalId: ReturnType<typeof setInterval>;

	// Count slides from children
	onMount(() => {
		// Get number of slides from slot content
		// const slideContainer = document.querySelector(".slides-wrapper");
		// if (slideContainer) {
		// 	totalSlides = slideContainer.children.length;
		// }

		// Auto-cycle every 5 seconds
		intervalId = setInterval(() => {
			nextSlide();
		}, 5000);

		return () => {
			if (intervalId) clearInterval(intervalId);
		};
	});

	function nextSlide() {
		currentSlide = (currentSlide + 1) % totalSlides;
	}

	function prevSlide() {
		currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
		resetTimer();
	}

	function goToSlide(index: number) {
		currentSlide = index;
		resetTimer();
	}

	function resetTimer() {
		if (intervalId) clearInterval(intervalId);
		intervalId = setInterval(() => {
			nextSlide();
		}, 5000);
	}

	// Provide slide index to children
	setContext("currentSlide", {
		get current() {
			return currentSlide;
		},
		get total() {
			return totalSlides;
		},
	});
</script>

<!-- Pagination dots -->

<div class="flex justify-center gap-2 mt-6">
	{#each Array(totalSlides) as _, index}
		<button
			on:click={() => goToSlide(index)}
			aria-label={`Go to slide ${index + 1}`}
			class="transition-all {currentSlide === index
				? 'bg-[var(--primary)]/50 w-8 h-3'
				: 'bg-[var(--secondary)]/50 w-3 h-3'} rounded-full"
		></button>
	{/each}
</div>
<div class="w-full flex justify-center p-2">
	<div class="relative w-full max-w-6xl">
		<!-- Navigation arrows -->
		<div
			class="pointer-events-none absolute inset-0 flex justify-between items-center z-20"
		>
			<button
				on:click={prevSlide}
				aria-label="Previous slide"
				class="pointer-events-auto sticky left-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-all"
			>
				<AngleLeftOutline class="w-6 h-6 text-white" />
			</button>

			<button
				on:click={() => {
					nextSlide();
					resetTimer();
				}}
				aria-label="Next slide"
				class="pointer-events-auto sticky right-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-all"
			>
				<AngleRightOutline class="w-6 h-6 text-white" />
			</button>
		</div>

		<!-- Slides container -->
		<div class="overflow-visible">
			<div
				class="relative flex slides-wrapper"
				style="transform: translateX(calc(-{currentSlide *
					100}%)); transition: transform 0.6s ease-in-out;"
			>
				<slot />
			</div>
		</div>
	</div>
</div>
