/**
 * MIT License
 *
 * Copyright (c) 2020 kyranet, discord.js
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

export class AsyncQueue {

	public get remaining(): number {
		return this.promises.length;
	}

	private readonly promises: InternalAsyncQueueDeferredPromise[] = [];

	public wait(): Promise<void> {
		const next = this.promises.length ? this.promises[this.promises.length - 1].promise : Promise.resolve();
		// eslint-disable-next-line @typescript-eslint/init-declarations
		let resolve: () => void;
		const promise = new Promise<void>(res => {
			resolve = res;
		});

		this.promises.push({
			resolve: resolve!,
			promise
		});

		return next;
	}

	public shift(): void {
		const deferred = this.promises.shift();
		if (typeof deferred !== 'undefined') deferred.resolve();
	}

}

interface InternalAsyncQueueDeferredPromise {
	resolve(): void;
	promise: Promise<void>;
}
