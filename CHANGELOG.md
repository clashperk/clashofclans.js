# Changelog

All notable changes to this project will be documented in this file.

## 5.1.1

### Fixed

- Barbarian's level 1 to 2 research time is 30 minutes, not instant.

### Changed

- Static data synced from clash-asset-library 2026.10.28.1 (game build 18.647.6). It now stores each unit level's cost and time as the price of reaching that level; `upgrade.cost` / `upgrade.time` keep their meaning (from each level to the next).

## 5.1.0

### Added

- `Util.getLeagueSeason`, `Util.getLeagueSeasonById` and `Util.getLeagueSeasons` for 28-day trophy league seasons. The id is the season's start date (`YYYY-MM-DD`); `getLeagueSeasonById` also accepts the legacy `YYYY-MM` ids.
- `Util.getMonth`, `Util.getMonthById` and `Util.getMonths` for UTC calendar months (`YYYY-MM`, 1st 00:00 UTC).

### Changed

- `Season.id` falls back to the league season's start date instead of the drifting `YYYY-MM` id.
- `Client.getLeagueGroup` accepts a numeric `seasonId`, matching `currentLeagueSeasonId`.

### Deprecated

- `Util.getSeason`, `Util.getSeasonId` and `Util.getSeasonById`. Their `YYYY-MM` id advances one month per 28-day season, so it runs ahead of the calendar and two seasons can end in the same month.
