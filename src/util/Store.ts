import { Store } from '../types';

export interface CacheOptions {
	sweepInterval?: number;
	ttl?: number;
}

export class CacheStore<T> implements Store {
	private readonly ttl: number;
	private readonly maxSize?: number;
	private readonly sweepInterval?: number;
	private readonly store = new Map<string, { value: unknown; expires: number; key: string }>();

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

	public async set(key: string, value: T, ttl?: number) {
		const expires = ttl && ttl > 0 ? Date.now() + ttl : this.ttl > 0 ? Date.now() + this.ttl : 0;
		return Promise.resolve().then(() => {
			return this.store.set(key, { value, expires, key });
		});
	}

	public async get(key: string) {
		return Promise.resolve().then(() => {
			const data = this.store.get(key);
			if (!data) return null;

			if (data.expires > 0 && Date.now() > data.expires) {
				this.store.delete(key);
				return null;
			}
			return data.value as T;
		});
	}

	public async delete(key: string) {
		return Promise.resolve().then(() => {
			return this.store.delete(key);
		});
	}

	public async clear() {
		return Promise.resolve().then(() => {
			return this.store.clear();
		});
	}
}
