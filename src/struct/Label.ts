import { Icon } from './Icon';
import { APILabel } from '../types';

/** Represents a Clan or Player Label. */
export class Label {
	/** The label's unique Id. */
	public id: number;

	/** The label's name. */
	public name: string;

	/** The label's icon. */
	public icon: Icon;

	public constructor(data: APILabel) {
		this.id = data.id;
		this.name = data.name;
		this.icon = new Icon(data.iconUrls);
	}
}
