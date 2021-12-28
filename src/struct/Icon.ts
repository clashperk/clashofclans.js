import { APIIcon } from '../types';

/** Represents a Clash of Clans Icon. */
export class Icon {
	/** The default icon URL. */
	public url: string;

	/** The medium icon URL. */
	public medium!: string;

	/** The tiny icon URL. */
	public tiny!: string;

	/** The small icon URL. */
	public small!: string;

	public constructor(data: APIIcon) {
		this.url = data.medium ?? data.small;
		Object.defineProperty(this, 'medium', { value: data.medium ?? data.small });
		Object.defineProperty(this, 'tiny', { value: data.tiny ?? data.small });
		Object.defineProperty(this, 'small', { value: data.small });
	}

	/** Get unique hash of this Badge. */
	public get fileName(): string {
		return this.url.split('/').pop()!;
	}
}
