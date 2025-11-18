<script lang="ts">
    import TournamentShowcase from "$lib/components/TournamentShowcase.svelte";
    import { players, matches, depth } from "$lib/global";

    // Firebase Functions
    import { loadGame, pushGame } from "$lib/global";

    import { onMount } from "svelte";
    onMount(async () => {
        await loadGame("fromeighties");
    });
</script>

<div class="w-full flex justify-center pt-9 pb-0">
	<h2 class="page-title bg-gradient-to-t from-[var(--primary)]/70 to-[var(--primary)]/40 backdrop-blur-md px-8 py-3 rounded-2xl text-center max-w-[85%]">Soul Train Battles</h2>
</div>

<div
    class="absolute bottom-1 w-full"
>
    <TournamentShowcase collectionId={"fromeighties"} />
</div>
