import { Util } from '../util/Util';

/**
 * Represents a throttler that sleeps for x ms between each request.
 * ```js
 * const throttler = new QueueThrottler(1000 / 10);
 * // 10 requests per second or sleep for 100ms between each request.
 * ```
 */
export class QueueThrottler {
	private lastRun?: number;
	private readonly sleepTime: number;
	private readonly promises: DeferredPromise[] = [];

	public constructor(sleepTime = 100) {
		this.sleepTime = sleepTime;
	}

	public get remaining() {
		return this.promises.length;
	}

	public async throttle() {
		if (this.lastRun) {
			const difference = Date.now() - this.lastRun;
			const needToSleep = this.sleepTime - difference;
			if (needToSleep > 0) await Util.delay(needToSleep);
		}

		this.lastRun = Date.now();
		return this.shift();
	}

	public wait() {
		const next = this.promises.length ? this.promises[this.promises.length - 1].promise : Promise.resolve();
		let resolve: () => void;
		const promise = new Promise<void>((res) => {
			resolve = res;
		});
		this.promises.push({ resolve: resolve!, promise });
		return next;
	}

	private shift() {
		const deferred = this.promises.shift();
		if (typeof deferred !== 'undefined') deferred.resolve();
	}
}

/**
 * Represents a throttler that allows x requests per second before sleeping until the next second.
 * ```js
 * const throttler = new BatchThrottler(30);
 * // 30 requests every second.
 * ```
 */
export class BatchThrottler {
	#taskLogs: number[] = []; // eslint-disable-line
	private readonly rateLimit: number;

	public constructor(rateLimit = 10) {
		this.rateLimit = rateLimit;
	}

	public async wait() {
		return Promise.resolve();
	}

	public async throttle() {
		while (true) { // eslint-disable-line
			const now = Date.now();

			while (this.#taskLogs.length) {
				if (now - this.#taskLogs[0] > 1000) {
					this.#taskLogs.shift();
				} else {
					break;
				}
			}

			if (this.#taskLogs.length < this.rateLimit) break;
			await Util.delay(1000);
		}
		this.#taskLogs.push(Date.now());
	}
}

export interface DeferredPromise {
	resolve(): void;
	promise: Promise<void>;
}
