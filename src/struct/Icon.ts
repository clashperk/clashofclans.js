import { APIIcon } from '../types';

/** Represents a Clash of Clans Icon. */
export class Icon {
	/** The default icon URL. */
	public url: string;

	/** The medium icon URL. */
	public medium!: string;

	/** The small icon URL. */
	public small!: string;

	/** The tiny icon URL. */
	public tiny!: string;

	public constructor(data: APIIcon) {
		this.url = data.medium ?? data.small;
		Object.defineProperty(this, 'medium', { value: data.medium ?? data.small });
		Object.defineProperty(this, 'tiny', { value: data.tiny ?? data.small });
		Object.defineProperty(this, 'small', { value: data.small });
	}

	/** Get unique file name of this Icon. */
	public get fileName(): string {
		return this.url.split('/').pop()!;
	}

	/** Sizes of this Icon. */
	public get sizes(): string[] {
		return [this.medium, this.small, this.tiny].map((url) => /\/(\d+)\//g.exec(url)![1]);
	}
}
