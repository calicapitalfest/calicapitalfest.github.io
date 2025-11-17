<script lang="ts">
    import { fly } from "svelte/transition";
    import { base } from "$app/paths";
    import { ButtonGroup, Button } from "flowbite-svelte";
    let navVisible = true;
    import { EyeOutline, EyeSlashOutline } from "flowbite-svelte-icons";
</script>

<header class="sticky top-0 left-0 right-0 z-50 max-h-[25vh] h-52">
    <div
        class="flex justify-center items-center w-full h-full py-2 backdrop-blur-md bg-black/40 shadow-md"
    >
        <!-- Hamburger Button -->
        <div class="absolute left-4 top-1/2 -translate-y-1/2">
            <Button
                onclick={() => (navVisible = !navVisible)}
                class="p-2 bg-black/10 hover:bg-primary-500 *:h-[1.8rem] *:w-[1.8rem]"
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
                    src="assets/banner.svg"
                    alt="Banner"
                    class="h-32 object-contain cursor-pointer"
                />
            </a>
        </div>
    </div>
    {#if navVisible}
        <div transition:fly="{{x:-500, duration:400}}">
            <ButtonGroup
            class="*:mx-[0.4px] shadow-md *:ring-primary-700! *:rounded-t-none *:rounded-b-md *:border-0 *:border-primary-200 *:bg-black/50 *:divide-x *:hover:bg-black/10" 
        >
            <Button href="{base}/">Inicio</Button>
            <Button href="{base}/locking">Locking</Button>
            <Button href="{base}/openStyle">Open Style</Button>
        </ButtonGroup>
        </div>
    {/if}
</header>
