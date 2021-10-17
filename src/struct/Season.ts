export class Season {
	public id: string;
	public rank: number;
	public trophies: number;

	public constructor(data: any) {
		this.id = data.id;
		this.rank = data.rank;
		this.trophies = data.trophies;
	}
}
