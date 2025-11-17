<script lang="ts">
    import { fly } from "svelte/transition";
    import { base } from "$app/paths";
    import { ButtonGroup, Button } from "flowbite-svelte";
    let navVisible = false;
    import { EyeOutline, EyeSlashOutline } from "flowbite-svelte-icons";
</script>

<header class="sticky top-0 left-0 right-0 z-50 max-h-[25vh] h-32">
    <div
        class="flex justify-center items-center w-full h-full py-2 backdrop-blur-md bg-gradient-to-t from-[var(--primary)]/40 to-[var(--secondary)]/40 shadow-md"
    >
        <!-- Hamburger Button -->
        <div class="absolute left-4 top-1/2 -translate-y-1/2">
            <Button
                onclick={() => (navVisible = !navVisible)}
                class="p-2 bg-[var(--primary)]/20 hover:bg-primary-500 *:h-[1.2rem] *:w-[1.2rem] rounded-xl"
            >
                {#if !navVisible}
                    <EyeOutline />
                {:else}
                    <EyeSlashOutline class=""/>
                {/if}
            </Button>
        </div>

        <!-- Logo -->
        <div
            class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
            <a href="{base}/" aria-label="Go to homepage">
                <img
                    src="assets/banner.png"
                    alt="Banner"
                    class="h-32 object-contain cursor-pointer"
                />
            </a>
        </div>
    </div>
    {#if navVisible}
        <div transition:fly="{{x:-500, duration:400}}">
            <ButtonGroup
            class="*:ring-primary-700! *:rounded-t-none *:rounded-b-md *:border-0 *:border-primary-200 *:bg-[var(--primary)]/50 *:hover:bg-black/70 *:px-1" 
        >
            <Button href="{base}/">Cronograma</Button>
            <Button href="{base}/soultrain">Soul Train</Button>
            <Button href="{base}/fromeighties">From 80's</Button>
        </ButtonGroup>
        </div>
    {/if}
</header>
