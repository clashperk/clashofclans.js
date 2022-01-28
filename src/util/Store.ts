import { Store } from '../types';

export interface CacheOptions {
	sweepInterval?: number;
	ttl?: number;
}

export class CacheStore<T = any> implements Store<T> {
	private readonly ttl: number;
	private readonly sweepInterval?: number;
	private readonly store = new Map<string, { value: T; expires: number; key: string }>();

	public constructor(options?: CacheOptions) {
		this.ttl = options?.ttl ?? 0;
		this.sweepInterval = options?.sweepInterval ?? 10 * 60 * 1000;
		if (this.sweepInterval > 0) this._sweep(); // sweep expired cache
	}

	private _sweep() {
		setInterval(() => {
			for (const cache of this.store.values()) {
				if (cache.expires > 0 && Date.now() > cache.expires) {
					this.store.delete(cache.key);
				}
			}
		}, this.sweepInterval);
	}

	public set(key: string, value: T, ttl = 0) {
		const expires = ttl > 0 ? Date.now() + ttl : this.ttl > 0 ? Date.now() + this.ttl : 0;
		this.store.set(key, { value, expires, key });
		return true;
	}

	public get(key: string) {
		const data = this.store.get(key);
		if (!data) return null;

		if (data.expires > 0 && Date.now() > data.expires) {
			this.store.delete(key);
			return null;
		}
		return data.value;
	}

	public delete(key: string) {
		return this.store.delete(key);
	}

	public clear() {
		return this.store.clear();
	}
}
