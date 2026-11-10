# Changelog

All notable changes to this project will be documented in this file.

## 5.1.9

### Added

- `retryOn` option, on the client and per request, sets which failures `retryLimit` retries: `statusCodes` (default `[500, 504]`) and `errorCodes`, matched against an error's `code` or `name` (default `ECONNRESET`, `EPIPE`, `UND_ERR_SOCKET`, `UND_ERR_ABORTED`, `AbortError`). The defaults add 500 to the statuses retried before. Connection errors are still only retried for GET requests.
- `onError` receives `retries`, the number of retries the request took.

### Fixed

- `onError` is called once per request with the final result. A retried request used to call it once per attempt.

## 5.1.8

### Fixed

- A GET request that fails with a connection error (`ECONNRESET`, `EPIPE`, or undici's `UND_ERR_SOCKET`) is retried on a new connection, within `retryLimit` like 504s and timeouts. With the default `retryLimit` of 0 nothing changes. Behind an anycast proxy such as Cloudflare, a route change moves open connections to an edge server that doesn't know them, and it resets them mid-request.

## 5.1.7

### Fixed

- Requests use HTTP/1.1 even when the server offers HTTP/2. undici offers both by default, and proxies such as Cloudflare choose HTTP/2, which puts every request on one connection. A reset on that connection then failed all requests in flight with `ECONNRESET`. Set the `allowH2` option to turn HTTP/2 back on.

## 5.1.6

### Changed

- Idle API connections stay open for 50 seconds instead of undici's default 4. Requests a few seconds apart reuse the connection instead of paying for a new TLS handshake each time. Set it with the `keepAliveTimeout` option.

## 5.1.5

### Changed

- Static data synced from clash-asset-library 2026.11.06.1. Abilities are stored once in `UNITS_DATA.abilities` and units point at them by key: equipment has `main_abilities` / `extra_abilities` with `main_ability_levels` / `extra_ability_levels` per level, troops and Builder Base heroes have `special_abilities` with `special_abilities_level`, and spells `give_special_ability` with `given_special_ability_level`. Equipment levels no longer carry an `abilities` array.

### Added

- `StaticAbility` and the ability fields above on the static data types, plus `die_damage` on troop levels.

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
