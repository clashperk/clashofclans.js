process.env.TZ = 'UTC';
import { Util } from './util/Util';

describe('util', () => {
	it('should always be UTC', () => {
		expect(new Date().getTimezoneOffset()).toBe(0);
	});

	it('should forward to next month if the given date is in the past', async () => {
		const timestamp = new Date('2024-03-25T05:01');

		const { endTime, startTime } = Util.getSeason(timestamp);

		const expectedEndTime = new Date('2024-04-29T05:00').toISOString();
		const expectedStartTime = new Date('2024-03-25T05:00').toISOString();

		expect(endTime.toISOString()).toBe(expectedEndTime);
		expect(startTime.toISOString()).toBe(expectedStartTime);
	});

	it('should not forward to next month even if the given date is in the past', async () => {
		const timestamp = new Date('2024-03-25T05:01');

		const { endTime, startTime } = Util.getSeason(timestamp, false);

		const expectedEndTime = new Date('2024-03-25T05:00').toISOString();
		const expectedStartTime = new Date('2024-02-26T05:00').toISOString();

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

		const { endTime, startTime, seasonId } = Util.getSeason(timestamp);

		const expectedStartTime = new Date('2024-12-30T05:00').toISOString();
		const expectedEndTime = new Date('2025-01-27T05:00').toISOString();

		expect(endTime.toISOString()).toBe(expectedEndTime);
		expect(startTime.toISOString()).toBe(expectedStartTime);
		expect(seasonId).toBe('2025-01');
	});

	it('should pass October 2025', async () => {
		const timestamp = new Date('2025-10-20T05:00');
		const { endTime, startTime, seasonId } = Util.getSeason(timestamp);

		const expectedEndTime = new Date('2025-11-03T05:00').toISOString();
		const expectedStartTime = new Date('2025-10-06T05:00').toISOString();

		expect(endTime.toISOString()).toBe(expectedEndTime);
		expect(startTime.toISOString()).toBe(expectedStartTime);
		expect(seasonId).toBe('2025-10');
	});

	it('should pass November 2025', async () => {
		const timestamp = new Date('2025-11-20T05:00');
		const { endTime, startTime, seasonId } = Util.getSeason(timestamp);

		const expectedStartTime = new Date('2025-11-03T05:00').toISOString();
		const expectedEndTime = new Date('2025-12-01T05:00').toISOString();

		expect(startTime.toISOString()).toBe(expectedStartTime);
		expect(endTime.toISOString()).toBe(expectedEndTime);
		expect(seasonId).toBe('2025-11');
	});

	it('should pass December 2025', async () => {
		const timestamp = new Date('2025-12-01T05:00');
		const { endTime, startTime, seasonId } = Util.getSeason(timestamp);

		const expectedStartTime = new Date('2025-12-01T05:00').toISOString();
		const expectedEndTime = new Date('2025-12-29T05:00').toISOString();

		expect(startTime.toISOString()).toBe(expectedStartTime);
		expect(endTime.toISOString()).toBe(expectedEndTime);
		expect(seasonId).toBe('2025-12');
	});

	it('should pass Jan 2026', async () => {
		const timestamp = new Date('2026-01-01T05:00');
		const { endTime, startTime, seasonId } = Util.getSeason(timestamp);

		const expectedStartTime = new Date('2025-12-29T05:00').toISOString();
		const expectedEndTime = new Date('2026-01-26T05:00').toISOString();

		expect(startTime.toISOString()).toBe(expectedStartTime);
		expect(endTime.toISOString()).toBe(expectedEndTime);
		expect(seasonId).toBe('2026-01');
	});

	it('should pass Feb 2026', async () => {
		const timestamp = new Date('2026-01-27T05:00');
		const { endTime, startTime, seasonId } = Util.getSeason(timestamp);

		const expectedStartTime = new Date('2026-01-26T05:00').toISOString();
		const expectedEndTime = new Date('2026-02-23T05:00').toISOString();

		expect(startTime.toISOString()).toBe(expectedStartTime);
		expect(endTime.toISOString()).toBe(expectedEndTime);
		expect(seasonId).toBe('2026-02');
	});

	it('should pass Aug 2025 (seasonId)', async () => {
		const { endTime, startTime, seasonId } = Util.getSeasonById('2025-08');

		const expectedStartTime = new Date('2025-07-28T05:00').toISOString();
		const expectedEndTime = new Date('2025-08-25T05:00').toISOString();

		expect(startTime.toISOString()).toBe(expectedStartTime);
		expect(endTime.toISOString()).toBe(expectedEndTime);
		expect(seasonId).toBe('2025-08');
	});

	it('should pass March 2024 (seasonId)', async () => {
		const { endTime, startTime, seasonId } = Util.getSeasonById('2024-03');

		const expectedEndTime = new Date('2024-03-25T05:00').toISOString();
		const expectedStartTime = new Date('2024-02-26T05:00').toISOString();

		expect(endTime.toISOString()).toBe(expectedEndTime);
		expect(startTime.toISOString()).toBe(expectedStartTime);
		expect(seasonId).toBe('2024-03');
	});

	it('should pass Sep 2025 (seasonId)', async () => {
		const { endTime, startTime, seasonId } = Util.getSeasonById('2025-09');

		const expectedStartTime = new Date('2025-08-25T05:00').toISOString();
		const expectedEndTime = new Date('2025-10-06T05:00').toISOString();

		expect(startTime.toISOString()).toBe(expectedStartTime);
		expect(endTime.toISOString()).toBe(expectedEndTime);
		expect(seasonId).toBe('2025-09');
	});

	it('should pass October 2025 (seasonId)', async () => {
		const { endTime, startTime, seasonId } = Util.getSeasonById('2025-10');

		const expectedStartTime = new Date('2025-10-06T05:00').toISOString();
		const expectedEndTime = new Date('2025-11-03T05:00').toISOString();

		expect(startTime.toISOString()).toBe(expectedStartTime);
		expect(endTime.toISOString()).toBe(expectedEndTime);
		expect(seasonId).toBe('2025-10');
	});

	it('should pass Dec 2025 (seasonId)', async () => {
		const { endTime, startTime, seasonId } = Util.getSeasonById('2025-12');

		const expectedStartTime = new Date('2025-12-01T05:00').toISOString();
		const expectedEndTime = new Date('2025-12-29T05:00').toISOString();

		expect(startTime.toISOString()).toBe(expectedStartTime);
		expect(endTime.toISOString()).toBe(expectedEndTime);
		expect(seasonId).toBe('2025-12');
	});

	it('should pass Jan 2026 (seasonId)', async () => {
		const { endTime, startTime, seasonId } = Util.getSeasonById('2026-01');

		const expectedStartTime = new Date('2025-12-29T05:00').toISOString();
		const expectedEndTime = new Date('2026-01-26T05:00').toISOString();

		expect(startTime.toISOString()).toBe(expectedStartTime);
		expect(endTime.toISOString()).toBe(expectedEndTime);
		expect(seasonId).toBe('2026-01');
	});

	it('should pass Feb 2026 (seasonId)', async () => {
		const { endTime, startTime, seasonId } = Util.getSeasonById('2026-02');

		const expectedStartTime = new Date('2026-01-26T05:00').toISOString();
		const expectedEndTime = new Date('2026-02-23T05:00').toISOString();

		expect(startTime.toISOString()).toBe(expectedStartTime);
		expect(endTime.toISOString()).toBe(expectedEndTime);
		expect(seasonId).toBe('2026-02');
	});
});
