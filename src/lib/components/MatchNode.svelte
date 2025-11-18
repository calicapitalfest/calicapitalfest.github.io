<!-- lockombia/src/lib/components/MatchNode.svelte -->
<script lang="ts">
    import { Handle, Position, type NodeProps } from "@xyflow/svelte";

    // Variable props
    import { players, matches } from "$lib/global";
    import { Item } from "$lib/types/Item";
    import { Match } from "$lib/types/Match";

    let { data }: NodeProps = $props();
    let dlevel = data.dlevel;
    let j = data.j;
    // @ts-ignore:
    let id = `${j + 2 ** dlevel - 1}`;
    // Match logic function
    function matchIndex(id:string) {
        let idx = $matches.findIndex((match) => match.id === id);
        if (idx === -1) {
            // no existing match → append a new one
            const items: Item[] = [];
            $matches = [...$matches, new Match(id, items, 0)];
            idx = $matches.length - 1;
        }
        return idx;
    }
    function playerIndex(player_id:number) {
        return $players.findIndex((player) => player.id === player_id);
    }

    // Constants
    const matchWidth = "200px";
    const playerHeight = "50px";
    const flipDurationMs = 100;
    let i = matchIndex(id);

    //
    let emptyStyle = $derived(
        $matches[i].items.length > 0
            ? ""
            : "box-sizing: border-box; border: 1px dashed gray; background-color: lightgray",
    );
    import { countryToEmoji } from "$lib/countryFlags";

    $effect(() => {
        if ($matches[i].id != id) {
            i = matchIndex(id);
        }
    });
</script>

<div
    class="match flex flex-col items-center justify-center h-full w-full"
    style="--player-height: 50px;"
>
    <Handle type="target" position={Position.Left} />
    <Handle type="source" position={Position.Right} />

    {#if dlevel === 0}
        <div
            class="title"
        >
            <p style="font-weight:bold;font-size:1.8rem;text-align:center;">
                Final
            </p>
        </div>
    {/if}

    {#if dlevel === 1}
        <div
            class="title"
        >
            <p style="font-weight:bold;font-size:1.8rem;text-align:center;">
                Semifinal
            </p>
        </div>
    {/if}

    {#if $matches[i].items.length == 0}
        <div class="player flex items-center justify-center"></div>
    {/if}

    

    {#each $matches[i].items as item (item.id)}
        {@const k = playerIndex(item.player_id)}

        {#if k + 1 != $matches[i].winner}
            <div class="player flex items-center justify-center relative">
                <!-- vertical ruler -->
                <div
                    class="absolute left-0 top-0 h-full w-[10px] bg-[var(--color-primary-800)]"
                ></div>

                <p class="player-name text-center">
                    {countryToEmoji($players[k].info.country)}
                    {$players[k].name}
                </p>
            </div>
        {:else}
            <div class="winner flex items-center justify-center relative">
                <!-- vertical ruler -->
                <div
                    class="absolute left-0 top-0 h-full w-[10px] bg-[var(--color-primary-500)]"
                ></div>

                <p class="player-name text-center">
                    {countryToEmoji($players[k].info.country)}
                    {$players[k].name}
                </p>
            </div>
        {/if}
    {/each}
</div>

<style>
    .match {
        min-height: 60px;
        width: 200px;
        gap: 0; /* ensure no gap; overrides any utility classes if necessary */
    }

    /* player box */
    .player {
        /* choose one border style — avoid double borders */
        border-bottom: 1px solid black;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        z-index: 1;
        width: 100%;
        height: var(--player-height);
        background-color: var(--primary);
    }

    .title {
        /* choose one border style — avoid double borders */
        border-bottom: 1px solid black;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        z-index: 1;
        width: 100%;
        height: 30px;
        background-color: var(--primary);
        opacity: 70%;
    }

    /* reset paragraph default margins and center vertically */
    .player-name {
        margin: 0;
        padding: 0 0.25rem;
        line-height: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        font-size: x-large;
        font-weight: bold;
    }

    .winner {
        border-bottom: 1px solid black;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        z-index: 1;
        width: 100%;
        height: var(--player-height);
        background-color: var(--secondary);
    }
</style>
