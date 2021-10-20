import { APIIcon } from '../types';

/** Represents a Clash of Clans Icon. */
export class Icon {
	/** The default icon URL. */
	public url: string;

	/** The tiny icon URL. */
	public tiny: string;

	/** The small icon URL. */
	public small: string;

	/** The medium icon URL. */
	public medium: string;

	public constructor(data: APIIcon) {
		this.url = data.medium ?? data.small;
		this.medium = data.medium ?? data.small;
		this.small = data.small;
		this.tiny = data.tiny ?? data.small;
	}

	/** Get unique hash of this Badge. */
	public get hash() {
		return this.url.split('/').pop();
	}
}
