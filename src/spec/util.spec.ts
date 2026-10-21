process.env.TZ = 'UTC';
import { Util } from '../util/Util';

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

	// tournament window
	it('should get the correct tournament window for a Wednesday', async () => {
		const timestamp = new Date('2024-03-20T10:00'); // Wednesday

		const { endTime, startTime } = Util.getTournamentWindow(timestamp);

		const expectedStartTime = new Date('2024-03-18T05:00').toISOString(); // Last Monday 5 AM UTC
		const expectedEndTime = new Date('2024-03-25T05:00').toISOString(); // Next Monday 5 AM UTC

		expect(startTime.toISOString()).toBe(expectedStartTime);
		expect(endTime.toISOString()).toBe(expectedEndTime);
	});

	it('should get the correct tournament window for a Monday after 5 AM', async () => {
		const timestamp = new Date('2024-03-18T10:00'); // Monday after 5 AM

		const { endTime, startTime } = Util.getTournamentWindow(timestamp);

		const expectedStartTime = new Date('2024-03-18T05:00').toISOString(); // Last Monday 5 AM UTC
		const expectedEndTime = new Date('2024-03-25T05:00').toISOString(); // Next Monday 5 AM UTC

		expect(startTime.toISOString()).toBe(expectedStartTime);
		expect(endTime.toISOString()).toBe(expectedEndTime);
	});

	it('should get the correct tournament window for a Monday before 5 AM', async () => {
		const timestamp = new Date('2024-03-18T04:00'); // Monday before 5 AM

		const { endTime, startTime } = Util.getTournamentWindow(timestamp);

		const expectedStartTime = new Date('2024-03-11T05:00').toISOString(); // Last Monday 5 AM UTC (a week earlier)
		const expectedEndTime = new Date('2024-03-18T05:00').toISOString(); // Next Monday 5 AM UTC

		expect(startTime.toISOString()).toBe(expectedStartTime);
		expect(endTime.toISOString()).toBe(expectedEndTime);
	});

	it('should get the correct tournament window for a Sunday', async () => {
		const timestamp = new Date('2024-03-17T10:00'); // Sunday

		const { endTime, startTime } = Util.getTournamentWindow(timestamp);

		const expectedStartTime = new Date('2024-03-11T05:00').toISOString(); // Last Monday 5 AM UTC
		const expectedEndTime = new Date('2024-03-18T05:00').toISOString(); // Next Monday 5 AM UTC

		expect(startTime.toISOString()).toBe(expectedStartTime);
		expect(endTime.toISOString()).toBe(expectedEndTime);
	});

	it('should pass 5am Monday', async () => {
		const timestamp = new Date('2025-10-06T05:00');

		const { endTime, startTime } = Util.getTournamentWindow(timestamp);

		const expectedStartTime = new Date('2025-10-06T05:00').toISOString(); // Last Monday 5 AM UTC
		const expectedEndTime = new Date('2025-10-13T05:00').toISOString(); // Next Monday 5 AM UTC

		expect(startTime.toISOString()).toBe(expectedStartTime);
		expect(endTime.toISOString()).toBe(expectedEndTime);
	});

	it('should pass 4:59am Monday', async () => {
		const timestamp = new Date('2025-10-06T04:59');

		const { endTime, startTime } = Util.getTournamentWindow(timestamp);

		const expectedStartTime = new Date('2025-09-29T05:00').toISOString();
		const expectedEndTime = new Date('2025-10-06T05:00').toISOString();

		expect(startTime.toISOString()).toBe(expectedStartTime);
		expect(endTime.toISOString()).toBe(expectedEndTime);
	});

	it('should pass End of year', async () => {
		const timestamp = new Date('2025-12-30T05:00');

		const { endTime, startTime } = Util.getTournamentWindow(timestamp);

		const expectedStartTime = new Date('2025-12-29T05:00').toISOString();
		const expectedEndTime = new Date('2026-01-05T05:00').toISOString();

		expect(startTime.toISOString()).toBe(expectedStartTime);
		expect(endTime.toISOString()).toBe(expectedEndTime);
	});

	it('should pass End of year (ID)', async () => {
		const { endTime, startTime } = Util.getTournamentWindowById('2025-12-30');

		const expectedStartTime = new Date('2025-12-29T05:00').toISOString();
		const expectedEndTime = new Date('2026-01-05T05:00').toISOString();

		expect(startTime.toISOString()).toBe(expectedStartTime);
		expect(endTime.toISOString()).toBe(expectedEndTime);
	});
	describe('getLeagueSeason', () => {
		const legacyIds: [string, string][] = [
			['2025-09', '2025-08-25'],
			['2025-10', '2025-10-06'],
			['2025-11', '2025-11-03'],
			['2025-12', '2025-12-01'],
			['2026-01', '2025-12-29'],
			['2026-02', '2026-01-26'],
			['2026-03', '2026-02-23'],
			['2026-04', '2026-03-23'],
			['2026-05', '2026-04-20'],
			['2026-06', '2026-05-18'],
			['2026-07', '2026-06-15'],
			['2026-08', '2026-07-13'],
			['2026-09', '2026-08-10'],
			['2026-10', '2026-09-07'],
			['2026-11', '2026-10-05']
		];

		it.each(legacyIds)('maps legacy id %s to start date %s', (legacyId, id) => {
			expect(Util.getLeagueSeasonById(legacyId).id).toBe(id);
			expect(Util.getLeagueSeason(Util.getSeasonById(legacyId).startTime).id).toBe(id);
		});

		it('starts each season at Monday 05:00 UTC, inclusive', () => {
			expect(Util.getLeagueSeason(new Date('2026-11-02T05:00:00.000Z')).id).toBe('2026-11-02');
			expect(Util.getLeagueSeason(new Date('2026-11-02T04:59:59.999Z')).id).toBe('2026-10-05');
		});

		it('gives two seasons ending in the same month different ids', () => {
			const first = Util.getLeagueSeason(new Date('2026-10-21T00:00:00.000Z'));
			const second = Util.getLeagueSeason(new Date('2026-11-10T00:00:00.000Z'));

			expect(first).toEqual({
				id: '2026-10-05',
				startTime: new Date('2026-10-05T05:00:00.000Z'),
				endTime: new Date('2026-11-02T05:00:00.000Z')
			});
			expect(second).toEqual({
				id: '2026-11-02',
				startTime: new Date('2026-11-02T05:00:00.000Z'),
				endTime: new Date('2026-11-30T05:00:00.000Z')
			});
		});

		it('covers the 6-week transition season', () => {
			const season = Util.getLeagueSeason(new Date('2025-09-15T00:00:00.000Z'));

			expect(season.id).toBe('2025-08-25');
			expect(season.endTime.toISOString()).toBe('2025-10-06T05:00:00.000Z');
		});

		it('uses the last-Monday rule before the transition', () => {
			expect(Util.getLeagueSeason(new Date('2024-03-25T05:00:00.000Z'))).toEqual({
				id: '2024-03-25',
				startTime: new Date('2024-03-25T05:00:00.000Z'),
				endTime: new Date('2024-04-29T05:00:00.000Z')
			});
			expect(Util.getLeagueSeason(new Date('2024-03-25T04:59:59.999Z')).id).toBe('2024-02-26');
		});

		it('looks a season up by its start date', () => {
			expect(Util.getLeagueSeasonById('2026-10-05')).toEqual(Util.getLeagueSeason(new Date('2026-10-05T05:00:00.000Z')));
		});

		it('lists consecutive seasons newest first', () => {
			const seasons = Util.getLeagueSeasons(4, new Date('2025-11-10T00:00:00.000Z'));

			expect(seasons.map((season) => season.id)).toEqual(['2025-11-03', '2025-10-06', '2025-08-25', '2025-07-28']);
			for (let i = 1; i < seasons.length; i++) {
				expect(seasons[i].endTime).toEqual(seasons[i - 1].startTime);
			}
		});
	});

	describe('getMonth', () => {
		it('returns the UTC calendar month', () => {
			expect(Util.getMonth(new Date('2026-10-21T12:00:00.000Z'))).toEqual({
				id: '2026-10',
				startTime: new Date('2026-10-01T00:00:00.000Z'),
				endTime: new Date('2026-11-01T00:00:00.000Z')
			});
		});

		it('starts each month at 00:00 UTC, inclusive', () => {
			expect(Util.getMonth(new Date('2026-11-01T00:00:00.000Z')).id).toBe('2026-11');
			expect(Util.getMonth(new Date('2026-10-31T23:59:59.999Z')).id).toBe('2026-10');
		});

		it('rolls over the year', () => {
			expect(Util.getMonthById('2026-12').endTime.toISOString()).toBe('2027-01-01T00:00:00.000Z');
		});

		it('lists consecutive months newest first', () => {
			const months = Util.getMonths(3, new Date('2027-01-15T00:00:00.000Z'));

			expect(months.map((month) => month.id)).toEqual(['2027-01', '2026-12', '2026-11']);
		});
	});
});
