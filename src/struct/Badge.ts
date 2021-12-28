import { APIBadge } from '../types';

/** Represents a Clash of Clans Badge. */
export class Badge {
	/** The default badge URL. */
	public url: string;

	/** The large badge URL. */
	public large!: string;

	/** The medium badge URL. */
	public medium!: string;

	/** The small badge URL. */
	public small!: string;

	public constructor(data: APIBadge) {
		this.url = data.large;
		Object.defineProperty(this, 'large', { value: data.large });
		Object.defineProperty(this, 'medium', { value: data.medium });
		Object.defineProperty(this, 'small', { value: data.small });
	}

	/** Get unique file name of this Badge. */
	public get fileName(): string {
		return this.url.split('/').pop()!;
	}

	/** Sizes of this Badge. */
	public get sizes(): string[] {
		return [this.large, this.medium, this.small].map((url) => /\/(\d+)\//g.exec(url)![1]);
	}
}
