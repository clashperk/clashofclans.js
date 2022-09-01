import { setInterval } from 'node:timers';
import type { Store } from '../types';

export type CacheOptions = {
    /**
     * How frequently to remove data from cache that are older than the lifetime/ttl (in milliseconds, 0 for never)
     *
     * To prevent high CPU usage, set a higher value (\>= 30 seconds)
     *
     * @default 120000 (2 minutes)
     */
    sweepInterval?: number;
    /**
     * How long a data should stay in the cache until it is considered sweepable (in milliseconds, 0 for forever)
     *
     * @default 0
     */
    ttl?: number;
};

export class CacheStore<T> implements Store<T> {
    private readonly ttl: number;

    private readonly sweepInterval: number;

    private readonly store = new Map<string, { expires: number; key: string; value: T }>();

    public constructor(options?: CacheOptions) {
        this.ttl = options?.ttl ?? 0;
        this.sweepInterval = options?.sweepInterval ?? 2 * 60 * 1_000;
        if (this.sweepInterval > 0) this._sweep(); // sweep expired cache
    }

    private _sweep() {
        setInterval(() => {
            for (const cache of this.store.values()) {
                if (cache.expires > 0 && Date.now() > cache.expires) {
                    this.store.delete(cache.key);
                }
            }
        }, Math.max(this.sweepInterval, 30 * 1_000));
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
        this.store.clear();
    }
}
