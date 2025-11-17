import type { Item } from '$lib/types/Item'

export class Match {
    id: string
    items: Item[]
    winner: number

    constructor(id: string, items: Item[], winner: number) {
        this.id = id
        this.items = items
        this.winner = winner
    }
}