export class Player {
	id: number;
	name: string;
	info: Record<string, any>; // or: { [key: string]: any }

	constructor(id: number, name: string, info: Record<string, any>) {
		this.id = id;
		this.name = name;
		this.info = info;
	}
}