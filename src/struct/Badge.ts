import { APIBadge } from '../types';

/** Represents a Clash of Clans Badge. */
export class Badge {
	/** The default icon URL. */
	public url: string;

	public large: string;
	public medium: string;
	public small: string;

	public constructor(data: APIBadge) {
		this.url = data.large;
		this.large = data.large;
		this.medium = data.medium;
		this.small = data.small;
	}

	/** Get unique hash of this Badge. */
	public get hash() {
		return this.url.split('/').pop();
	}
}
