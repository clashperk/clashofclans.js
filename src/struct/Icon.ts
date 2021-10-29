import { APIIcon } from '../types';

/** Represents a Clash of Clans Icon. */
export class Icon {
	private readonly _data!: APIIcon;

	/** The default icon URL. */
	public url: string;

	public constructor(data: APIIcon) {
		Object.defineProperty(this, '_data', { value: data });
		this.url = data.medium ?? data.small;
	}

	/** The medium icon URL. */
	public get medium() {
		return this._data.medium ?? this._data.small;
	}

	/** The tiny icon URL. */
	public get tiny() {
		return this._data.tiny ?? this._data.small;
	}

	/** The small icon URL. */
	public get small() {
		return this._data.small;
	}

	/** Get unique hash of this Badge. */
	public get hash(): string {
		return this.url.split('/').pop()!;
	}
}
