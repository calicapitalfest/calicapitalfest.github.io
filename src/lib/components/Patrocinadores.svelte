<script lang="ts">
    import { onMount } from "svelte";

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

    let currentIndex = 0;
    let intervalId: ReturnType<typeof setInterval>;

    $: leftIndex = (currentIndex - 1 + sponsors.length) % sponsors.length;
    $: rightIndex = (currentIndex + 1) % sponsors.length;

    onMount(() => {
        intervalId = setInterval(() => {
            currentIndex = (currentIndex + 1) % sponsors.length;
        }, 3000);

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    });

    function goToSponsor(index: number) {
        currentIndex = index;
        if (intervalId) clearInterval(intervalId);
        intervalId = setInterval(() => {
            currentIndex = (currentIndex + 1) % sponsors.length;
        }, 3000);
    }
</script>

<div class="w-full flex justify-center pt-9 pb-0">
    <h2 class="page-title bg-gradient-to-t from-[var(--primary)]/70 to-[var(--primary)]/40 backdrop-blur-md px-8 py-3 rounded-2xl text-center max-w-[85%]">
        Apoyan
    </h2>
</div>

<div class="w-full flex justify-center p-2">
    <div class="relative w-full max-w-6xl">
        <div class="relative bg-gradient-to-t from-[var(--primary)]/90 to-[var(--secondary)]/90 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
            <!-- Left Arrow -->
            <button
                on:click={() => goToSponsor(leftIndex)}
                aria-label="Previous sponsor"
                class="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-[var(--primary)] transition-colors z-10"
            >
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <!-- Right Arrow -->
            <button
                on:click={() => goToSponsor(rightIndex)}
                aria-label="Next sponsor"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-[var(--primary)] transition-colors z-10"
            >
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
            </button>

            <div class="flex flex-col items-center justify-center gap-6">
                <div class="relative w-full h-48 flex items-center justify-center">
                    {#each sponsors as sponsor, i}
                        <div class="absolute inset-0 flex items-center justify-center transition-opacity duration-500 {i === currentIndex ? 'opacity-100' : 'opacity-0'}">
                            <img
                                src="/assets/patrocinadores/{sponsor.img}"
                                alt={sponsor.name}
                                class="max-w-full max-h-48 object-contain"
                            />
                        </div>
                    {/each}
                </div>

                <h3 class="text-2xl font-bold text-white text-center">
                    {sponsors[currentIndex].name}
                </h3>
            </div>
        </div>

        <!-- Pagination dots below gradient div -->
        <div class="flex justify-center gap-2 mt-4">
            {#each sponsors as _, index}
                <button
                    on:click={() => goToSponsor(index)}
                    aria-label={`Go to sponsor ${index + 1}`}
                    class="transition-all {currentIndex === index
                        ? 'bg-[var(--primary)]/50 w-8 h-3'
                        : 'bg-[var(--secondary)]/50 w-3 h-3'} rounded-full"
                ></button>
            {/each}
        </div>
    </div>
</div>