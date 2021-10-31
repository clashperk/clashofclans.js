<div align="center">

[![Logo](https://i.imgur.com/RHkfYVm.png.png)](https://clashofclans.js.org/)

### JavaScript library for interacting with the Clash of Clans API

[![ESLint](https://github.com/clashperk/clashofclans.js/actions/workflows/node.js.yml/badge.svg)](https://github.com/clashperk/clashofclans.js/actions/workflows/node.js.yml)
[![Docs](https://github.com/clashperk/clashofclans.js/actions/workflows/docs.yml/badge.svg)](https://github.com/clashperk/clashofclans.js/actions/workflows/docs.yml)
[![Logo](https://img.shields.io/npm/v/clashofclans.js.svg?maxAge=3600)](https://www.npmjs.com/package/clashofclans.js)

</div>

### Installation

- **`npm i clashofclans.js`**
- **Node.js v14.0.0 or newer is required.**

### Links

- [Clash of Clans Developer Website](https://developer.clashofclans.com/)
- [Clash of Clans API Community Discord](https://discord.gg/Eaja7gJ)

### Example

```js
const { Client } = require("clashofclans.js");
const client = new Client({ keys: ["API_KEY"] });

(async function () {
  const data = await client.locations("#8QU8J9LP", { limit: 1 });
  console.log(data);
})();
```

### Response

```json
{
  "items": [
    {
      "id": 32000000,
      "name": "Europe",
      "isCountry": false
    }
  ],
  "paging": {},
  "statusCode": 200,
  "ok": true,
  "maxAge": 600000
}
```

### What is **`maxAge`**?

The `maxAge` ([Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)) is the maximum amount of time in milliseconds (converted) which shows how long until a fresh data is available.

### Validation

It's recommended to see if a data is available before performing operations or reading data from it.
You can check this with `data.ok` property.

```js
(async function () {
  const data = await client.clan("#WRONG_TAG");
  console.log(data);
  if (!data.ok) return; // Invalid Tag
})();
```

```json
{
  "reason": "notFound",
  "statusCode": 404,
  "ok": false,
  "maxAge": 600000
}
```

### Status Codes

- **200:** Successful Response.
- **400:** Client provided incorrect parameters for the request.
- **403:** Access denied, either because of missing/incorrect credentials or used API token does not grant access to the requested resource.
- **404:** Resource was not found.
- **429:** Request was throttled, because amount of requests was above the threshold defined for the used API token.
- **500:** Unknown error happened when handling the request.
- **503:** Service is temporarily unavailable because of maintenance.
- **504:** Gateway Request Timeout.

## Documentation

| Methods                                                               | Description                                            |
| --------------------------------------------------------------------- | ------------------------------------------------------ |
| [init(options)](#Client+init)                                         | Initialize Extension class and create keys             |
| [parseTag(tag)](#Client+parseTag)                                     | Parse a clan or player Tag                             |
| [clans([options])](#Client+clans)                                     | Search clans                                           |
| [clan(clanTag)](#Client+clan)                                         | Get clan information                                   |
| [clanMembers(clanTag, [options])](#Client+clanMembers)                | List clan members                                      |
| [detailedClanMembers(members)](#Client+detailedClanMembers)           | Detailed clan members                                  |
| [clanWarLog(clanTag, [options])](#Client+clanWarLog)                  | Retrieve clan's clan war log                           |
| [currentClanWar(clanTag, [options])](#Client+currentClanWar)          | Information about clan's current clan war              |
| [clanWarLeague(clanTag)](#Client+clanWarLeague)                       | Information about clan's current clan war league group |
| [clanWarLeagueWar(warTag)](#Client+clanWarLeagueWar)                  | Information about individual clan war league war       |
| [player(playerTag)](#Client+player)                                   | Get player information                                 |
| [verifyPlayerToken(playerTag, token)](#Client+verifyPlayerToken)      | Verify player API token                                |
| [leagues([options])](#Client+leagues)                                 | List Leagues                                           |
| [league(leagueId)](#Client+league)                                    | Get league information                                 |
| [leagueSeason(leagueId, [options])](#Client+leagueSeason)             | Get league seasons                                     |
| [leagueRanking(leagueId, seasonId, [options])](#Client+leagueRanking) | Get league season rankings                             |
| [warLeagues([options])](#Client+warLeagues)                           | List war leagues                                       |
| [warLeague(leagueId)](#Client+warLeague)                              | Get war league information                             |
| [locations([options])](#Client+locations)                             | List locations                                         |
| [location(locationId)](#Client+location)                              | Get information about specific location                |
| [clanRanks(locationId, [options])](#Client+clanRanks)                 | Get clan rankings for a specific location              |
| [playerRanks(locationId, [options])](#Client+playerRanks)             | Get player rankings for a specific location            |
| [versusClanRanks(locationId, [options])](#Client+versusClanRanks)     | Get clan versus rankings for a specific location       |
| [versusPlayerRanks(locationId, [options])](#Client+versusPlayerRanks) | Get player versus rankings for a specific location     |
| [clanLabels([options])](#Client+clanLabels)                           | List clan labels                                       |
| [playerLabels([options])](#Client+playerLabels)                       | List player labels                                     |
| [goldPassSeason()](#Client+goldPassSeason)                            | Get information about the current gold pass season     |

<a name="new_Client_new"></a>

### new Client([options])

Represents Clash of Clans API

In order to access the API, you need a developer account and a key for your application.

[https://developer.clashofclans.com](https://developer.clashofclans.com)

| Param     | Type                                         | Default         | Description    |
| --------- | -------------------------------------------- | --------------- | -------------- |
| [options] | [<code>ClientOptions</code>](#ClientOptions) | <code>{}</code> | Client Options |

**Example**

```js
const { Client } = require("clashofclans.js");
```

<a name="Client+init"></a>

### client.init(options)

Initialize Extension class and create keys

| Param   | Type                                               | Description                 |
| ------- | -------------------------------------------------- | --------------------------- |
| options | [<code>ExtensionOptions</code>](#ExtensionOptions) | Required extension options. |

**Example**

```js
const { Client } = require("clashofclans.js");
const client = new Client();
(async () => {
  await client.init({ email: "", password: "" });
  // you would have to run the `init` method just for once.

  const data = await client.clan("#2PP");
  console.log(data);
})();
```

<a name="Client+parseTag"></a>

### client.parseTag(tag)

Parse a clan or player Tag

**Throws:** <code>TypeError</code> The "tag" argument must be of type string.

| Param | Type                | Description             |
| ----- | ------------------- | ----------------------- |
| tag   | <code>string</code> | Tag of clans or players |

**Example**

```js
// Fix Lowercase, Zero and Missing Hash #
client.parseTag("PccVqqGO"); // #PCCVQQG0
```

<a name="Client+clans"></a>

### client.clans([options])

Search clans

| Param     | Type                                                 | Default         | Description                                                                                                                                                                                                                                             |
| --------- | ---------------------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [options] | [<code>ClanSearchOptions</code>](#ClanSearchOptions) | <code>{}</code> | Search clans by name or filtering parameters. **- If name is used as part of search query, it needs to be at least three characters long.** **- Name search parameter is interpreted as wild card search, so it may appear anywhere in the clan name.** |

**Example**

```js
client.clans({ name: "air hounds", limit: 10 });
// or
client.clans({ minMembers: 40, maxMembers: 50 });
```

<a name="Client+clan"></a>

### client.clan(clanTag)

Get clan information

| Param   | Type                | Description      |
| ------- | ------------------- | ---------------- |
| clanTag | <code>string</code> | Tag of the clan. |

**Example**

```js
client.clan("#8QU8J9LP");
```

<a name="Client+clanMembers"></a>

### client.clanMembers(clanTag, [options])

List clan members

| Param     | Type                       | Default         | Description      |
| --------- | -------------------------- | --------------- | ---------------- |
| clanTag   | <code>string</code>        |                 | Tag of the clan. |
| [options] | [<code>SearchOptions</code>](#SearchOptions) | <code>{}</code> | Optional options |

**Example**

```js
client.clanMembers("#8QU8J9LP", { limit: 10 });
```

<a name="Client+detailedClanMembers"></a>

### client.detailedClanMembers(members)

Detailed clan members

| Param   | Type                           | Description     |
| ------- | ------------------------------ | --------------- |
| members | <code>{ tag: string }[]</code> | List of members |

**Example**

```js
const data = await client.clan("#8QU8J9LP");
client.detailedClanMembers(data.memberList);
```

<a name="Client+clanWarLog"></a>

### client.clanWarLog(clanTag, [options])

Retrieve clan's clan war log

| Param     | Type                       | Default         | Description      |
| --------- | -------------------------- | --------------- | ---------------- |
| clanTag   | <code>string</code>        |                 | Tag of the clan. |
| [options] | [<code>SearchOptions</code>](#SearchOptions) | <code>{}</code> | Optional options |

**Example**

```js
client.clanWarLog("#8QU8J9LP", { limit: 10 });
```

<a name="Client+currentClanWar"></a>

### client.currentClanWar(clanTag, [options])

Retrieve information about clan's current clan war

| Param     | Type                       | Default         | Description      |
| --------- | -------------------------- | --------------- | ---------------- |
| clanTag   | <code>string</code>        |                 | Tag of the clan. |
| [options] | [<code>SearchOptions</code>](#SearchOptions) | <code>{}</code> | Optional options |

**Example**

```js
client.currentClanWar("#8QU8J9LP");
```

<a name="Client+clanWarLeague"></a>

### client.clanWarLeague(clanTag)

Retrieve information about clan's current clan war league group

| Param   | Type                | Description      |
| ------- | ------------------- | ---------------- |
| clanTag | <code>string</code> | Tag of the clan. |

**Example**

```js
client.clanWarLeague("#8QU8J9LP");
```

<a name="Client+clanWarLeagueWar"></a>

### client.clanWarLeagueWar(warTag)

Retrieve information about individual clan war league war

| Param  | Type                | Description            |
| ------ | ------------------- | ---------------------- |
| warTag | <code>string</code> | WarTag of a CWL round. |

**Example**

```js
client.clanWarLeagueWar("#2QJQPYLJU");
```

<a name="Client+player"></a>

### client.player(playerTag)

Get player information.

| Param     | Type                | Description        |
| --------- | ------------------- | ------------------ |
| playerTag | <code>string</code> | Tag of the player. |

**Example**

```js
client.player("#9Q92C8R20");
```

<a name="Client+verifyPlayerToken"></a>

### client.verifyPlayerToken(playerTag, token)

Verify player API token that can be found from the game settings. This API call can be used to check that players own the game accounts they claim to own as they need to provide the one-time use API token that exists inside the game.

| Param     | Type                | Description        |
| --------- | ------------------- | ------------------ |
| playerTag | <code>string</code> | Tag of the player. |
| token     | <code>string</code> | Player API token.  |

**Example**

```js
client.verifyPlayerToken("#9Q92C8R20", "pd3NN9x2");
```

<a name="Client+leagues"></a>

### client.leagues([options])

List Leagues

| Param     | Type                       | Default         | Description      |
| --------- | -------------------------- | --------------- | ---------------- |
| [options] | [<code>SearchOptions</code>](#SearchOptions) | <code>{}</code> | Optional options |

**Example**

```js
client.leagues();
```

<a name="Client+league"></a>

### client.league(leagueId)

Get league information

| Param    | Type                | Description               |
| -------- | ------------------- | ------------------------- |
| leagueId | <code>string</code> | Identifier of the league. |

**Example**

```js
client.league("29000022");
```

<a name="Client+leagueSeason"></a>

### client.leagueSeason(leagueId, [options])

Get league seasons. Note that league season information is available only for Legend League.

| Param     | Type                       | Default         | Description               |
| --------- | -------------------------- | --------------- | ------------------------- |
| leagueId  | <code>string</code>        |                 | Identifier of the league. |
| [options] | [<code>SearchOptions</code>](#SearchOptions) | <code>{}</code> | Optional options          |

**Example**

```js
client.leagueSeason("29000022", { limit: 10 });
```

<a name="Client+leagueRanking"></a>

### client.leagueRanking(leagueId, seasonId, [options])

Get league season rankings. Note that league season information is available only for Legend League.

| Param     | Type                       | Default         | Description               |
| --------- | -------------------------- | --------------- | ------------------------- |
| leagueId  | <code>string</code>        |                 | Identifier of the league. |
| seasonId  | <code>string</code>        |                 | Identifier of the season. |
| [options] | [<code>SearchOptions</code>](#SearchOptions) | <code>{}</code> | Optional options          |

**Example**

```js
client.leagueRanking("29000022", "2020-03", { limit: 10 });
```

<a name="Client+warLeagues"></a>

### client.warLeagues([options])

List war leagues

| Param     | Type                       | Default         | Description      |
| --------- | -------------------------- | --------------- | ---------------- |
| [options] | [<code>SearchOptions</code>](#SearchOptions) | <code>{}</code> | Optional options |

**Example**

```js
client.warLeagues();
```

<a name="Client+warLeague"></a>

### client.warLeague(leagueId)

Get war league information

| Param    | Type                | Description               |
| -------- | ------------------- | ------------------------- |
| leagueId | <code>string</code> | Identifier of the league. |

**Example**

```js
client.warLeague("48000018");
```

<a name="Client+locations"></a>

### client.locations([options])

List locations

| Param     | Type                       | Default         | Description      |
| --------- | -------------------------- | --------------- | ---------------- |
| [options] | [<code>SearchOptions</code>](#SearchOptions) | <code>{}</code> | Optional options |

**Example**

```js
client.locations();
// OR
client.locations({ limit: 10 });
```

<a name="Client+location"></a>

### client.location(locationId)

Get information about specific location

| Param      | Type                | Description                             |
| ---------- | ------------------- | --------------------------------------- |
| locationId | <code>string</code> | Identifier of the location to retrieve. |

**Example**

```js
client.location("32000107");
```

<a name="Client+clanRanks"></a>

### client.clanRanks(locationId, [options])

Get clan rankings for a specific location

| Param      | Type                                                   | Default         | Description                             |
| ---------- | ------------------------------------------------------ | --------------- | --------------------------------------- |
| locationId | <code>string</code> \| <code>&#x27;global&#x27;</code> |                 | Identifier of the location to retrieve. |
| [options]  | [<code>SearchOptions</code>](#SearchOptions)                             | <code>{}</code> | Optional options                        |

**Example**

```js
client.clanRanks("32000107", { limit: 10 });
```

<a name="Client+playerRanks"></a>

### client.playerRanks(locationId, [options])

Get player rankings for a specific location

| Param      | Type                                                   | Default         | Description                             |
| ---------- | ------------------------------------------------------ | --------------- | --------------------------------------- |
| locationId | <code>string</code> \| <code>&#x27;global&#x27;</code> |                 | Identifier of the location to retrieve. |
| [options]  | [<code>SearchOptions</code>](#SearchOptions)                             | <code>{}</code> | Optional options                        |

**Example**

```js
client.playerRanks("32000107", { limit: 10 });
```

<a name="Client+versusClanRanks"></a>

### client.versusClanRanks(locationId, [options])

Get clan versus rankings for a specific location

| Param      | Type                                                   | Default         | Description                             |
| ---------- | ------------------------------------------------------ | --------------- | --------------------------------------- |
| locationId | <code>string</code> \| <code>&#x27;global&#x27;</code> |                 | Identifier of the location to retrieve. |
| [options]  | [<code>SearchOptions</code>](#SearchOptions)                             | <code>{}</code> | Optional options                        |

**Example**

```js
client.versusClanRanks("32000107", { limit: 10 });
```

<a name="Client+versusPlayerRanks"></a>

### client.versusPlayerRanks(locationId, [options])

Get player versus rankings for a specific location

| Param      | Type                                                   | Default         | Description                             |
| ---------- | ------------------------------------------------------ | --------------- | --------------------------------------- |
| locationId | <code>string</code> \| <code>&#x27;global&#x27;</code> |                 | Identifier of the location to retrieve. |
| [options]  | [<code>SearchOptions</code>](#SearchOptions)                             | <code>{}</code> | Optional options                        |

**Example**

```js
client.versusPlayerRanks("32000107", { limit: 10 });
```

<a name="Client+clanLabels"></a>

### client.clanLabels([options])

List clan labels

| Param     | Type                       | Default         | Description      |
| --------- | -------------------------- | --------------- | ---------------- |
| [options] | [<code>SearchOptions</code>](#SearchOptions) | <code>{}</code> | Optional options |

**Example**

```js
client.clanLabels();
```

<a name="Client+playerLabels"></a>

### client.playerLabels([options])

List player labels

| Param     | Type                            | Default         | Description      |
| --------- | ------------------------------- | --------------- | ---------------- |
| [options] | [<code>SearchOptions</code>](#SearchOptions) | <code>{}</code> | Optional options |

**Example**

```js
client.playerLabels();
```

<a name="Client+goldPassSeason"></a>

### client.goldPassSeason()

Get information about the current gold pass season.

<a name="ClientOptions"></a>

## ClientOptions

Base Client Options

| Name      | Type                | Description                    |
| --------- | ------------------- | ------------------------------ |
| keys      | <code>string</code> | Clash of Clans API keys(s)     |
| timeout   | <code>number</code> | Request timeout in millisecond |
| [baseURL] | <code>string</code> | Clash of Clans API Base URL    |

<a name="SearchOptions"></a>

## SearchOptions

Search Options

| Name   | Type                | Description                                                                                                                                                                                           |
| ------ | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| limit  | <code>number</code> | Limit the number of items returned in the response.                                                                                                                                                   |
| after  | <code>string</code> | Return only items that occur after this marker. Before marker can be found from the response, inside the 'paging' property. Note that only after or before can be specified for a request, not both.  |
| before | <code>string</code> | Return only items that occur before this marker. Before marker can be found from the response, inside the 'paging' property. Note that only after or before can be specified for a request, not both. |

<a name="ClanSearchOptions"></a>

## ClanSearchOptions

Clan Search Options

**- If name is used as part of search query, it needs to be at least three characters long.**

**- Name search parameter is interpreted as wild card search, so it may appear anywhere in the clan name.**

| Name          | Type                | Description                                                                                                                                                                                           |
| ------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name          | <code>string</code> | Search clans by name.                                                                                                                                                                                 |
| warFrequency  | <code>string</code> | Filter by clan war frequency                                                                                                                                                                          |
| locationId    | <code>string</code> | Filter by clan location identifier. For list of available locations, refer to getLocations operation                                                                                                  |
| minMembers    | <code>number</code> | Filter by minimum number of clan members                                                                                                                                                              |
| maxMembers    | <code>number</code> | Filter by maximum number of clan members                                                                                                                                                              |
| minClanPoints | <code>number</code> | Filter by minimum amount of clan points.                                                                                                                                                              |
| minClanLevel  | <code>number</code> | Filter by minimum clan level.                                                                                                                                                                         |
| limit         | <code>number</code> | Limit the number of items returned in the response.                                                                                                                                                   |
| after         | <code>string</code> | Return only items that occur after this marker. Before marker can be found from the response, inside the 'paging' property. Note that only after or before can be specified for a request, not both.  |
| before        | <code>string</code> | Return only items that occur before this marker. Before marker can be found from the response, inside the 'paging' property. Note that only after or before can be specified for a request, not both. |
| labelIds      | <code>string</code> | Comma separatered list of label IDs to use for filtering results.                                                                                                                                     |

<a name="ExtensionOptions"></a>

## ExtensionOptions

Extension client options

| Param            | Type                | Default                                             | Description                |
| ---------------- | ------------------- | --------------------------------------------------- | -------------------------- |
| email            | <code>string</code> |                                                     | Developer account Email    |
| password         | <code>string</code> |                                                     | Developer account Password |
| [keyCount]       | <code>number</code> | <code>1</code>                                      | Number of Key(s)           |
| [keyName]        | <code>string</code> | <code>Created by clashofclans.js client</code>      | Name of the Key(s)         |
| [keyDescription] | <code>string</code> | <code>new Date().toUTCString()</code>               | Description of the Key(s)  |
| [baseURL]        | <code>string</code> | <code>https://developer.clashofclans.com/api</code> | Developer Site Base URL    |

### Disclaimer

> This content is not affiliated with, endorsed, sponsored, or specifically approved by Supercell and Supercell is not responsible for it. For more information see [Supercell’s Fan Content Policy](https://supercell.com/en/fan-content-policy/).
