import { Util } from './util/Util';

describe('util', () => {
	it('should always be UTC', () => {
		expect(new Date().getTimezoneOffset()).toBe(0);
	});

	it('should forward to next month if date is in past', async () => {
		const timestamp = new Date('2024-03-25T05:01');

		const { endTime, startTime } = Util.getSeason(timestamp);

		const expectedEndTime = new Date('2024-04-29T05:00').toISOString();
		const expectedStartTime = new Date('2024-03-25T05:00').toISOString();

		expect(endTime.toISOString()).toBe(expectedEndTime);
		expect(startTime.toISOString()).toBe(expectedStartTime);
	});

	it('should return the correct season against a date', async () => {
		const timestamp = new Date('2024-03-16T05:01');

		const { endTime, startTime } = Util.getSeason(timestamp);
		const expectedEndTime = new Date('2024-03-25T05:00').toISOString();
		const expectedStartTime = new Date('2024-02-26T05:00').toISOString();

		expect(endTime.toISOString()).toBe(expectedEndTime);
		expect(startTime.toISOString()).toBe(expectedStartTime);
	});

	it('should forward to the next year at the end of the year', async () => {
		const timestamp = new Date('2024-12-30T05:01');

		const { endTime, startTime } = Util.getSeason(timestamp);

		const expectedEndTime = new Date('2025-01-27T05:00').toISOString();
		const expectedStartTime = new Date('2024-12-30T05:00').toISOString();

		expect(endTime.toISOString()).toBe(expectedEndTime);
		expect(startTime.toISOString()).toBe(expectedStartTime);
	});
});
