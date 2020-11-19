export class Throttler {

	private sleepTime: number;
	private lastRun: number;

	public constructor(rateLimit = 10) {
		this.sleepTime = 1000 / rateLimit;
		this.lastRun = Date.now();
	}

	public wait(ms: number) {
		return new Promise(res => setTimeout(res, ms));
	}

	public async throttle() {
		const difference = Date.now() - this.lastRun;
		const needToSleep = this.sleepTime - difference;

		if (needToSleep > 0) await this.wait(needToSleep);

		this.lastRun = Date.now();
		return Promise.resolve();
	}

}
