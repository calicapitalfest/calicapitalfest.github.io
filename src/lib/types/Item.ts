export class Item {
  id: string
  player_id: number

  constructor(id: string, player_id: number) {
    this.id = id
    this.player_id = player_id
  }
}