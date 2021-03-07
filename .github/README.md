# Powerful JavaScript library for interacting with the Clash of Clans API

## Installation
- **Node.js v14.0.0 or newer is required.**
- **NPM Version `npm i clashofclans.js`**
- **GitHub Version `npm i clashperk/clashofclans.js`**
- **For Node.js 12.x `npm i clashperk/clashofclans.js#stable`**

## Client
Represents Clash of Clans API

* [new Client(options)](#new_Client_new)
* [.fetch(path, options)](#Client+fetch)
* [.clans(options)](#Client+clans)
* [.clan(clanTag)](#Client+clan)
* [.clanMembers(clanTag, options)](#Client+clanMembers)
* [.detailedClanMembers(members)](#Client+detailedClanMembers)      
* [.clanWarLog(clanTag, options)](#Client+clanWarLog)        
* [.currentClanWar(clanTag, options)](#Client+currentClanWar)
* [.clanWarLeague(clanTag)](#Client+clanWarLeague)
* [.clanWarLeagueWar(warTag)](#Client+clanWarLeagueWar)     
* [.player(playerTag)](#Client+player)
* [.verifyPlayerToken(playerTag, token)](#Client+verifyPlayerToken)
* [.leagues(options)](#Client+leagues)
* [.league(leagueId)](#Client+league)
* [.leagueSeason(leagueId, options)](#Client+leagueSeason)
* [.leagueRanking(leagueId, seasonId, options)](#Client+leagueRanking)
* [.warLeagues(options)](#Client+warLeagues)
* [.warLeague(leagueId)](#Client+warLeague)
* [.locations(options)](#Client+locations)
* [.location(locationId)](#Client+location)
* [.clanRanks(locationId, options)](#Client+clanRanks)
* [.playerRanks(locationId, options)](#Client+playerRanks)
* [.versusClanRanks(locationId, options)](#Client+versusClanRanks)
* [.versusPlayerRanks(locationId, options)](#Client+versusPlayerRanks)
* [.clanLabels(options)](#Client+clanLabels)
* [.playerLabels(options)](#Client+playerLabels)

<a name="new_Client_new"></a>

### new Client(options)

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>ClientOptions</code>](#ClientOptions) | API Options |

**Example**
```js
const { Client } = require('clashofclans.js');
const client = new Client({ token: [''], timeout: 5000 });

(async function() {
	// Search Clan
	const data = await client.clan('#8QU8J9LP');
	console.log(data);

	// Verify Player API Token
	const token = await client.verifyPlayerToken('#9Q92C8R20', 'pd3NN9x2');
	if (token.status === 'ok') console.log('Verified!');
})();
```

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

<a name="maxAge"></a>

### maxAge
The `maxAge` ([Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)) is the maximum amount of time in milliseconds (converted) which shows how long until a fresh data is available.

### Validation
It's recommended to see if a data is available before performing operations or reading data from it. 
You can check this with `data.ok` property.

```js
(async function() {
	const data = await client.clan('WRONG_TAG');
	console.log(data);
	if (!data.ok) return console.log('INVALID TAG');
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
<a name="Status+Codes"></a>

### Status Codes
- **200:** Successful Response.
- **400:** Client provided incorrect parameters for the request.
- **403:** Access denied, either because of missing/incorrect credentials or used API token does not grant access to the requested resource.
- **404:** Resource was not found.
- **429:** Request was throttled, because amount of requests was above the threshold defined for the used API token.
- **500:** Unknown error happened when handling the request.
- **503:** Service is temporarily unavailable because of maintenance.
- **504:** Request Timeout.

<a name="Client+fetch"></a>

### client.fetch(path)
Fetch any Endpoint

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Request URL |

**Example**
```js
client.fetch('/locations').then(data => console.log(data)));
```
<a name="Client+clans"></a>

### client.clans(options)
Search clans

| Param | Type | Description |
| --- | --- | --- |
| options | <code>string</code> \| [<code>ClanSearchOptions</code>](#ClanSearchOptions) | Search clans by name or filtering parameters. If name is used as part of search query, it needs to be at least three characters long. Name search parameter is interpreted as wild card search, so it may appear anywhere in the clan name. |  

**Example**
```js
client.clans('air hounds');
// or
client.clans({ name: 'air hounds', limit: 10 });
// or
client.clans({ minMembers: 40, maxMembers: 50 });
```
<a name="Client+clan"></a>

### client.clan(clanTag)
Get clan information

| Param | Type | Description |
| --- | --- | --- |
| clanTag | <code>string</code> | Tag of the clan. |

**Example**
```js
client.clan('#8QU8J9LP');
```
<a name="Client+clanMembers"></a>

### client.clanMembers(clanTag, options)
List clan members

| Param | Type | Description |
| --- | --- | --- |
| clanTag | <code>string</code> | Tag of the clan. |
| options | [<code>SearchOptions</code>](#SearchOptions) | Optional options |

**Example**
```js
client.clanMembers('#8QU8J9LP', { limit: 10 });
```
<a name="Client+detailedClanMembers"></a>

### client.detailedClanMembers(members)
Detailed clan members

| Param | Type | Description |
| --- | --- | --- |
| members | <code>{ tag: string }[]</code> | List of members |

**Example**
```js
const data = await client.clan('#8QU8J9LP');
client.detailedClanMembers(data.memberList);
```
<a name="Client+clanWarLog"></a>

### client.clanWarLog(clanTag, options)
Retrieve clan's clan war log

| Param | Type | Description |
| --- | --- | --- |
| clanTag | <code>string</code> | Tag of the clan. |
| options | [<code>SearchOptions</code>](#SearchOptions) | Optional options |

**Example**
```js
client.clanWarLog('#8QU8J9LP', { limit: 10 });
```
<a name="Client+currentClanWar"></a>

### client.currentClanWar(clanTag, options)
Retrieve information about clan's current clan war

| Param | Type | Description |
| --- | --- | --- |
| clanTag | <code>string</code> | Tag of the clan. |
| options | [<code>SearchOptions</code>](#SearchOptions) | Optional options |

**Example**
```js
client.currentClanWar('#8QU8J9LP');
```
<a name="Client+clanWarLeague"></a>

### client.clanWarLeague(clanTag)
Retrieve information about clan's current clan war league group

| Param | Type | Description |
| --- | --- | --- |
| clanTag | <code>string</code> | Tag of the clan. |

**Example**
```js
client.clanWarLeague('#8QU8J9LP');
```
<a name="Client+clanWarLeagueWar"></a>

### client.clanWarLeagueWar(warTag)
Retrieve information about individual clan war league war

| Param | Type | Description |
| --- | --- | --- |
| warTag | <code>string</code> | WarTag of a CWL round. |

**Example**
```js
client.clanWarLeagueWar('#2QJQPYLJU');
```
<a name="Client+player"></a>

### client.player(playerTag)
Get player information.

| Param | Type | Description |
| --- | --- | --- |
| playerTag | <code>string</code> | Tag of the player. |

**Example**
```js
client.player('#9Q92C8R20');
```
<a name="Client+verifyPlayerToken"></a>

### client.verifyPlayerToken(playerTag, token)
Verify player API token that can be found from the game settings. This API call can be used to check that players own the game accounts they claim to own as they need to provide the one-time use API token that exists inside the game.

| Param | Type | Description |
| --- | --- | --- |
| playerTag | <code>string</code> | Tag of the player. |
| token | <code>string</code> | Player API token. |

**Example**
```js
client.verifyPlayerToken('#9Q92C8R20', 'pd3NN9x2');
```

<a name="Client+leagues"></a>

### client.leagues(options)
List Leagues

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>SearchOptions</code>](#SearchOptions) | Optional options |

**Example**
```js
client.leagues();
```
<a name="Client+league"></a>

### client.league(leagueId)
Get league information

| Param | Type | Description |
| --- | --- | --- |
| leagueId | <code>string</code> | Identifier of the league. |

**Example**
```js
client.league('29000022');
```
<a name="Client+leagueSeason"></a>

### client.leagueSeason(leagueId, options)
Get league seasons. Note that league season information is available only for Legend League.

| Param | Type | Description |
| --- | --- | --- |
| leagueId | <code>string</code> | Identifier of the league. |
| options | [<code>SearchOptions</code>](#SearchOptions) | Optional options |

**Example**
```js
client.leagueSeason('29000022', { limit: 10 });
```
<a name="Client+leagueRanking"></a>

### client.leagueRanking(leagueId, seasonId, options)
Get league season rankings. Note that league season information is available only for Legend League.

| Param | Type | Description |
| --- | --- | --- |
| leagueId | <code>string</code> | Identifier of the league. |
| seasonId | <code>string</code> | Identifier of the season. |
| options | [<code>SearchOptions</code>](#SearchOptions) | Optional options |

**Example**
```js
client.leagueRanking('29000022', '2020-03', { limit: 10 });
```
<a name="Client+warLeagues"></a>

### client.warLeagues(options)
List war leagues

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>SearchOptions</code>](#SearchOptions) | Optional options |

**Example**
```js
client.warLeagues();
```
<a name="Client+warLeague"></a>

### client.warLeague(leagueId)
Get war league information

| Param | Type | Description |
| --- | --- | --- |
| leagueId | <code>string</code> | Identifier of the league. |

**Example**
```js
client.warLeague('48000018');
```
<a name="Client+locations"></a>

### client.locations(options)
List locations

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>SearchOptions</code>](#SearchOptions) | Optional options |

**Example**
```js
client.locations();
// OR
client.locations({ limit: 10 });
```
<a name="Client+location"></a>

### client.location(locationId)
Get information about specific location

| Param | Type | Description |
| --- | --- | --- |
| locationId | <code>string</code> | Identifier of the location to retrieve. |

**Example**
```js
client.location('32000107');
```
<a name="Client+clanRanks"></a>

### client.clanRanks(locationId, options)
Get clan rankings for a specific location

| Param | Type | Description |
| --- | --- | --- |
| locationId | <code>string</code> | Identifier of the location to retrieve. |
| options | [<code>SearchOptions</code>](#SearchOptions) | Optional options |

**Example**
```js
client.clanRanks('32000107', { limit: 10 });
```
<a name="Client+playerRanks"></a>

### client.playerRanks(locationId, options)
Get player rankings for a specific location

| Param | Type | Description |
| --- | --- | --- |
| locationId | <code>string</code> | Identifier of the location to retrieve. |
| options | [<code>SearchOptions</code>](#SearchOptions) | Optional options |

**Example**
```js
client.playerRanks('32000107', { limit: 10 });
```
<a name="Client+versusClanRanks"></a>

### client.versusClanRanks(locationId, options)
Get clan versus rankings for a specific location

| Param | Type | Description |
| --- | --- | --- |
| locationId | <code>string</code> | Identifier of the location to retrieve. |
| options | [<code>SearchOptions</code>](#SearchOptions) | Optional options |

**Example**
```js
client.versusClanRanks('32000107', { limit: 10 });
```
<a name="Client+versusPlayerRanks"></a>

### client.versusPlayerRanks(locationId, options)
Get player versus rankings for a specific location

| Param | Type | Description |
| --- | --- | --- |
| locationId | <code>string</code> | Identifier of the location to retrieve. |
| options | [<code>SearchOptions</code>](#SearchOptions) | Optional options |

**Example**
```js
client.versusPlayerRanks('32000107', { limit: 10 });
```
<a name="Client+clanLabels"></a>

### client.clanLabels(options)
List clan labels

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>SearchOptions</code>](#SearchOptions) | Optional options |

**Example**
```js
client.clanLabels();
```
<a name="Client+playerLabels"></a>

### client.playerLabels(options)
List player labels

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>SearchOptions</code>](#SearchOptions) | Optional options |

**Example**
```js
client.playerLabels();
```
<a name="ClientOptions"></a>

## ClientOptions

| Param | Type | Description |
| --- | --- | --- |
| token | <code>string \| string[]</code> | Clash of Clans API Token |
| timeout | <code>number</code> | Request timeout in millisecond |
| baseURL | <code>string</code> | API Base URL |

<a name="ClanSearchOptions"></a>

## ClanSearchOptions

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Search clans by name. If name is used as part of search query, it needs to be at least three characters long. Name search parameter is interpreted as wild card search, so it may appear anywhere in the clan name. |
| warFrequency | <code>string</code> | Filter by clan war frequency |
| locationId | <code>string</code> | Filter by clan location identifier. For list of available locations, refer to getLocations operation |
| minMembers | <code>number</code> | Filter by minimum number of clan members |
| maxMembers | <code>number</code> | Filter by maximum number of clan members |
| minClanPoints | <code>number</code> | Filter by minimum amount of clan points. |
| minClanLevel | <code>number</code> | Filter by minimum clan level. |
| limit | <code>number</code> | Limit the number of items returned in the response. |
| after | <code>string</code> | Return only items that occur after this marker. Before marker can be found from the response, inside the 'paging' property. Note that only after or before can be specified for a request, not both. |
| before | <code>string</code> | Return only items that occur before this marker. Before marker can be found from the response, inside the 'paging' property. Note that only after or before can be specified for a request, not both. |
| labelIds | <code>string</code> | Comma separatered list of label IDs to use for filtering results. |

<a name="SearchOptions"></a>

## SearchOptions

| Param | Type | Description |
| --- | --- | --- |
| limit | <code>number</code> | Limit the number of items returned in the response. |
| after | <code>string</code> | Return only items that occur after this marker. Before marker can be found from the response, inside the 'paging' property. Note that only after or before can be specified for a request, not both. |
| before | <code>string</code> | Return only items that occur before this marker. Before marker can be found from the response, inside the 'paging' property. Note that only after or before can be specified for a request, not both. |

## License
**MIT License**

**Copyright (c) 2020 - 2021 ClashPerk**