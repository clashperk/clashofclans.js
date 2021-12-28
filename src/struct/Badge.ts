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

	/** Get unique hash of this Badge. */
	public get hash(): string {
		return this.url.split('/').pop()!;
	}
}
