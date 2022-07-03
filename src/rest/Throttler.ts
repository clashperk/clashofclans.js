import { Util } from '../util/Util';

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
		// eslint-disable-next-line
		while (true) {
			await Util.delay(this.sleepTime);
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

	public constructor(rateLimit = 15, sleepTime = 1000) {
		this.rateLimit = rateLimit;
		this.sleepTime = sleepTime;
	}

	private async *init() {
		let count = 0;
		// eslint-disable-next-line
		while (true) {
			if (count++ >= this.rateLimit) {
				await Util.delay(this.sleepTime);
				count = 0;
			}
			yield;
		}
	}

	public async wait() {
		return this.generator.next();
	}
}
