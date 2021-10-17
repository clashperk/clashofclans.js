export class Unit {
	public name: string;
	public level: number;
	public maxLevel: number;
	public village: 'home' | 'builderBase';

	public constructor(data: any) {
		this.name = data.name;
		this.level = data.level;
		this.maxLevel = data.maxLevel;
		this.village = data.village;
	}
}

export class Troop extends Unit {
	public superTroopIsActive: boolean;

	public constructor(data: any) {
		super(data);
		this.superTroopIsActive = data.superTroopIsActive;
	}
}

export class Spell extends Unit {}

export class Hero extends Unit {}
