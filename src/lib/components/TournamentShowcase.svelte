<script lang="ts">
    import * as utils from "$lib/tournamentUtils.js";
    import { SvelteFlow, Controls, Panel, Background } from "@xyflow/svelte";
    import MatchNode from "./MatchNode.svelte";
    import "@xyflow/svelte/dist/style.css";
    import { Item } from "$lib/types/Item";
    import { players, matches, depth } from "$lib/global";

    $depth = 0;

    let { collectionId = "" } = $props();

    const nodeTypes = { matchNode: MatchNode };

    let nodes = $derived(utils.nodesGenerator($depth, $matches));

    let edges = $derived(utils.edgesGenerator($depth, $matches));

    import { onMount, tick } from "svelte";
    import { loadGame } from "$lib/global";
    import { collection } from "firebase/firestore";

    let svelteflow: any;

    async function clickFitViewButton() {
        await tick();
        requestAnimationFrame(() => {
            // look for button inside the SvelteFlow element first, then globally
            const btn =
                svelteflow?.querySelector?.(".svelte-flow__controls-fitview") ??
                document.querySelector(".svelte-flow__controls-fitview");

            if (btn instanceof HTMLElement) {
                btn.click();
                return;
            }
        });
    }

    onMount(() => {
        (async () => {
            await loadGame(collectionId);
            await clickFitViewButton();
        })();

        let lastActivityTime = Date.now();
        let fitViewInterval;

        // Track user activity
        const updateActivity = () => {
            lastActivityTime = Date.now();
        };

        // Events to track for user activity
        const activityEvents = [
            "mousedown",
            "mousemove",
            "keypress",
            "scroll",
            "touchstart",
            "click",
        ];

        // Add activity listeners
        activityEvents.forEach((event) => {
            document.addEventListener(event, updateActivity, true);
        });

        // Check every 1 second if user has been inactive for 5+ seconds
        const checkInactivity = () => {
            const now = Date.now();
            const timeSinceActivity = now - lastActivityTime;
            const fiveSecondsInMs = 5000;

            // Only trigger fit view if user has been inactive for 5+ seconds
            if (timeSinceActivity >= fiveSecondsInMs) {
                clickFitViewButton();
                // Reset timer so it doesn't trigger again immediately
                lastActivityTime = now;
            }
        };

        fitViewInterval = setInterval(checkInactivity, 1000);

        // Cleanup function
        return () => {
            clearInterval(fitViewInterval);
            // Remove activity listeners
            activityEvents.forEach((event) => {
                document.removeEventListener(event, updateActivity, true);
            });
        };
    });

    $inspect($matches);
</script>

<div style="width: 100%; height: 85vh">
    <SvelteFlow
        bind:this={svelteflow}
        bind:nodes
        bind:edges
        {nodeTypes}
        proOptions={{ hideAttribution: true }}
        fitView
    >
        <Controls />
    </SvelteFlow>
</div>

<style>
    :global(.svelte-flow) {
        background: transparent !important;
    }
    :global(.svelte-flow__controls) {
        display: none !important;
    }
</style>
