import { Util } from '../util/Util.js';

/**
 * Represents a throttler that sleeps for x ms between each request.
 * ```js
 * const throttler = new QueueThrottler(1000 / 10);
 * // 10 requests per second or sleep for 100ms between each request.
 * ```
 */
export class QueueThrottler {
	private readonly sleepTime: number;

	private readonly generator = this.init();

	public constructor(sleepTime = 100) {
		this.sleepTime = sleepTime;
	}

	private async *init() {
		let lastRan = 0;
		while (true) {
			const difference = Date.now() - lastRan;
			const needToSleep = this.sleepTime - difference;
			if (needToSleep > 0) await Util.delay(needToSleep);

			lastRan = Date.now();
			yield;
		}
	}

	public async wait() {
		return this.generator.next();
	}
}

/**
 * Represents a throttler that allows x requests per second before sleeping until the next second.
 * ```js
 * const throttler = new BatchThrottler(15);
 * // 15 requests every second.
 * ```
 */
export class BatchThrottler {
	private readonly rateLimit: number;

	private readonly sleepTime: number;

	private readonly generator = this.init();

	public constructor(rateLimit = 15, sleepTime = 1_000) {
		this.rateLimit = rateLimit;
		this.sleepTime = sleepTime;
	}

	private async *init() {
		let count = 0;
		while (true) {
			if (count++ >= this.rateLimit) {
				if (this.sleepTime > 0) await Util.delay(this.sleepTime);
				count = 0;
			}

			yield;
		}
	}

	public async wait() {
		return this.generator.next();
	}
}
