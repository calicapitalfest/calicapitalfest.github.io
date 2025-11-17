<script lang="ts">
	import { onMount } from "svelte";
	import { setContext } from "svelte";

	let currentSlide = 0;
	let totalSlides = 0;
	let intervalId: ReturnType<typeof setInterval>;

	// Count slides from children
	onMount(() => {
		// Get number of slides from slot content
		const slideContainer = document.querySelector('.slides-wrapper');
		if (slideContainer) {
			totalSlides = slideContainer.children.length;
		}

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
	setContext('currentSlide', { 
		get current() { return currentSlide; },
		get total() { return totalSlides; }
	});
</script>

<div class="w-full flex justify-center p-4">
	<div class="relative w-full max-w-6xl">
		<!-- Navigation arrows -->
		<button
			on:click={prevSlide}
			class="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all"
			aria-label="Previous slide"
		>
			<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
		</button>

		<button
			on:click={() => { nextSlide(); resetTimer(); }}
			class="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all"
			aria-label="Next slide"
		>
			<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
			</svg>
		</button>

		<!-- Slides container -->
		<div class="overflow-visible">
			<div 
				class="relative flex slides-wrapper" 
				style="transform: translateX(calc(-{currentSlide * 100}%)); transition: transform 0.6s ease-in-out;"
			>
				<slot />
			</div>
		</div>

		<!-- Pagination dots -->
		<div class="flex justify-center gap-2 mt-6">
			{#each Array(totalSlides) as _, index}
				<button
					on:click={() => goToSlide(index)}
					class="transition-all {currentSlide === index ? 'bg-white w-8 h-3' : 'bg-white/50 w-3 h-3'} rounded-full"
					aria-label="Go to slide {index + 1}"
				/>
			{/each}
		</div>
	</div>
</div>