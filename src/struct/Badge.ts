import { APIBadge } from '../types';

/** Represents a Clash of Clans Badge. */
export class Badge {
	private readonly _data!: APIBadge;

	/** The default badge URL. */
	public url: string;

	public constructor(data: APIBadge) {
		Object.defineProperty(this, '_data', { value: data });
		this.url = data.large;
	}

	/** The large badge URL. */
	public get large() {
		return this._data.large;
	}

	/** The medium badge URL. */
	public get medium() {
		return this._data.medium;
	}

	/** The small badge URL. */
	public get small() {
		return this._data.small;
	}

	/** Get unique hash of this Badge. */
	public get hash() {
		return this.url.split('/').pop();
	}
}
