# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## 3.0.2 (15-01-2023)

### Bug Fixes

- Conflict with the same name of builder base and home base troops. (#123)
- Fix the issue with the `Client#getLeagueWar()` method.
- Typings and documentation for clan capital.
- Fix the issue with the `Clan#clanCapital` property.

### Features

- Added `Client#getCapitalRaidSeasons()` method.
- Added `Client#getCapitalLeagues()` method.
- Added `Client#getClanCapitalRanks()` method.
- Added new Super Troops in raw.json file.

### Breaking Changes

- Using PascalCase instead of SCREAMING_SNAKE_CASE ([#115](https://github.com/clashperk/clashofclans.js/pull/115))
- `Client#events` and `EventManager` have been removed in favor of `PollingClient` ([#117](https://github.com/clashperk/clashofclans.js/pull/117), [#127](https://github.com/clashperk/clashofclans.js/pull/127))

## 2.8.0 (2022-07-22)

### Features

- Better Throttler with JS generator function. ([#111](https://github.com/clashperk/clashofclans.js/pull/111))
- Updated raw data from game files. ([#111](https://github.com/clashperk/clashofclans.js/pull/111))
- New method Util#parseArmyLink has been added. ([#110](https://github.com/clashperk/clashofclans.js/pull/110))

## 2.7.0 (2022-05-22)

### Features

- Some useful QOL methods have been added. ([#106](https://github.com/clashperk/clashofclans.js/pull/106))

## 2.6.1 (2022-02-03)

### Bug Fixes

- New value and typings `notInWar` added for `ClanWarLeagueGroup#state` ([#101](https://github.com/clashperk/clashofclans.js/pull/101))
- Throw error if `Util.formatTag` / `Util.parseTag` is called with invalid argument ([#102](https://github.com/clashperk/clashofclans.js/pull/101))

## 2.6.0 (2022-01-29)

## Features

- Replaced Keyv with customizable cache store ([#99](https://github.com/clashperk/clashofclans.js/pull/99))
- Guide for [Internal Caching](https://clashofclans.js.org/guide/internal-caching)

## 2.5.2 (2022-01-23)

### Bug Fixes

- Fix `ClanWar#attacksPerMembers` property ([#97](https://github.com/clashperk/clashofclans.js/pull/97))
- Bump `node-fetch` from 2.6.6 to 2.6.7 ([#96](https://github.com/clashperk/clashofclans.js/pull/96))

## 2.5.1 (2022-01-11)

### Bug Fixes

- Typings for `ClanWarLeagueGroup#state` property. ([#94](https://github.com/clashperk/clashofclans.js/pull/94))

## 2.5.0 (2021-12-30)

### Bug Fixes

- Fix caching issue with unnecessary/invalid query params. ([#91](https://github.com/clashperk/clashofclans.js/pull/91))
- Added necessary methods to `RESTManager` class. ([#92](https://github.com/clashperk/clashofclans.js/pull/92))

## 2.4.0 (2021-12-28)

### Features

- `ClanWar#getClanWarLeagueGroup`, `ClanWar#isCWL` and `ClanWar#isFriendly` are now available. ([#87](https://github.com/clashperk/clashofclans.js/pull/87))
- `RESTOptions#rejectIfNotValid` added to perform `res.ok` operations over `RESTManager` methods. [Know more?](https://clashofclans.js.org/guide/access-raw-data#easy-access) ([#87](https://github.com/clashperk/clashofclans.js/pull/87))
- `Icon#fileName` and `Icon#sizes` are now available in `Icon` class. ([#87](https://github.com/clashperk/clashofclans.js/pull/87))
- `Badge#fileName` and `Badge#sizes` are now available in `Badge` class. ([#87](https://github.com/clashperk/clashofclans.js/pull/87))

### Deprecations

- `ClanWarMember#previousBestOpponentAttack` has been deprecated. Use `ClanWarAttack#previousBestAttack` instead. ([#87](https://github.com/clashperk/clashofclans.js/pull/87))

## 2.3.0 (2021-12-17)

### Features

- BigInt literals issue fixed. ([#84](https://github.com/clashperk/clashofclans.js/pull/84))
- Some Utility methods renamed. ([#84](https://github.com/clashperk/clashofclans.js/pull/84))
  - `Util.encodeTag()` to `Util.encodeURI()`
  - `Util.encodeTagToId()` to `Util.encodeTag()`
  - `Util.decodeIdToTag()` to `Util.decodeTag()`
- Added `dps`, `resourceType`, `trainingTime` and `regenerationTime` to the `Unit` class. ([#85](https://github.com/clashperk/clashofclans.js/pull/85))

## 2.2.0 (2021-12-16)

### Bug Fixes

- Show units as per in-game orders. ([#82](https://github.com/clashperk/clashofclans.js/pull/82)) ([6e23d2f](https://github.com/clashperk/clashofclans.js/commit/95cf3001059fd3ede9262e249814178631660d5b))
- Season end time utility method. ([#82](https://github.com/clashperk/clashofclans.js/pull/82)) ([6e23d2f](https://github.com/clashperk/clashofclans.js/commit/95cf3001059fd3ede9262e249814178631660d5b))
- Updated raw files for new Troops. ([#82](https://github.com/clashperk/clashofclans.js/pull/82)) ([6e23d2f](https://github.com/clashperk/clashofclans.js/commit/95cf3001059fd3ede9262e249814178631660d5b))

### Features

- Added `seasonal`, `boostable` and `isLoaded` property to `Unit` class. ([#82](https://github.com/clashperk/clashofclans.js/pull/82)) ([6e23d2f](https://github.com/clashperk/clashofclans.js/commit/95cf3001059fd3ede9262e249814178631660d5b))

## 2.1.0 (2021-12-06)

### Bug Fixes

- Consistency of `ClanWar.attacksPerMember` property. ([#75](https://github.com/clashperk/clashofclans.js/pull/75)) ([6e23d2f](https://github.com/clashperk/clashofclans.js/commit/6e23d2fe0373f56268ffa55d5ac2807c9a2dc2fc))

### Features

- More utility methods added to `Util` class. ([#76](https://github.com/clashperk/clashofclans.js/pull/76)) ([ff41115](https://github.com/clashperk/clashofclans.js/commit/ff4111530d6293ef1fc54aa916436130fc30a09c))

  - `Util.formatTag(tag: string): string`
  - `Util.formatDate(date: string): Date`
  - `Util.isValidTag(tag: string): boolean`
  - `Util.encodeTagToId(tag: string): string` (Removed on 2.3.0)
  - `Util.decodeIdToTag(id: string): string` (Removed on 2.3.0)

- Support of async/await for custom events ([#79](https://github.com/clashperk/clashofclans.js/pull/79)) ([ff41115](https://github.com/clashperk/clashofclans.js/commit/a23db3786bcca44b8547c70f27773bdb1216f990))

## 2.0.2 (2021-11-30)

### Bug Fixes

- Return `null` for `RankedPlayer.clan` if they are not in the clan. ([#73](https://github.com/clashperk/clashofclans.js/pull/73)) ([ba82327](https://github.com/clashperk/clashofclans.js/commit/ba8232740f4ca9af2bcc7971aca3574612ef25b6))
- `OverrideOptions` added for `Client#getClans` and `RESTManager#getClans` ([#73](https://github.com/clashperk/clashofclans.js/pull/73)) ([ba82327](https://github.com/clashperk/clashofclans.js/commit/ba8232740f4ca9af2bcc7971aca3574612ef25b6))
- `SeasonRankedPlayer` class for legend league ranking. ([#73](https://github.com/clashperk/clashofclans.js/pull/73)) ([ba82327](https://github.com/clashperk/clashofclans.js/commit/ba8232740f4ca9af2bcc7971aca3574612ef25b6))

## 2.0.1 (2021-11-27)

### Bug Fixes

- IP retrieval method and Event Loop ([#70](https://github.com/clashperk/clashofclans.js/issues/70)) ([82b84ba](https://github.com/clashperk/clashofclans.js/commit/82b84ba5d96505c43b75e53aa07f547ef0b77778))

## 2.0.0 (2021-11-26)

This new version is a complete TypeScript rewrite to convert everything from plain (literal JSON) objects to class (constructor) objects and support a lot more features.

### Features

- HTTP Request Request Retries ([#26](https://github.com/clashperk/clashofclans.js/issues/26)) ([94585f3](https://github.com/clashperk/clashofclans.js/commit/94585f3a84a7175b2d07872f9eb9e42372b95e12))
- Event Manager and Custom Events ([#37](https://github.com/clashperk/clashofclans.js/issues/37)) ([5027ae6](https://github.com/clashperk/clashofclans.js/commit/5027ae663a8e07175e17384c7e5706f4a1a7afb4))
- Email Password Login ([#31](https://github.com/clashperk/clashofclans.js/issues/31)) ([4153cd3](https://github.com/clashperk/clashofclans.js/commit/4153cd37ea0e1c71550b9e892105b84d5a407e23))
- Queue Throttler and Batch Throttler ([#34](https://github.com/clashperk/clashofclans.js/issues/34)) ([3a8f051](https://github.com/clashperk/clashofclans.js/commit/3a8f051552e93b98f89bc7d524acdecddf242718))
- Override Request Options ([#36](https://github.com/clashperk/clashofclans.js/issues/36)) ([42d7fdd](https://github.com/clashperk/clashofclans.js/commit/42d7fdd36262cc46f23b731f8cffb9daea19d3b0))
- Internal Caching Options ([#53](https://github.com/clashperk/clashofclans.js/issues/53)) ([984451d](https://github.com/clashperk/clashofclans.js/commit/30ea3240c11866008d0dae514468c0fdbb34ffd0))
- Additional Properties for Player Units ([#65](https://github.com/clashperk/clashofclans.js/pull/65)) ([aa1696](https://github.com/clashperk/clashofclans.js/commit/aa1696243d96d4fed0250b4282c60522a6482343))
