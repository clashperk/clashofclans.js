<div align="center">
	<h1>Powerful JavaScript library for interacting with the Clash of Clans API</h1>
	<p>
		<a href="https://www.npmjs.com/package/clashofclans.js/">
			<img src="https://nodei.co/npm/clashofclans.js.png" alt="NPM Info" />
		</a>
	</p>
</div>

## Client
Represents Clash of Clans API

* [Client](#Client)
    * [new Client(option)](#new_Client_new)
    * [.clans(clan)](#Client+clans)
    * [.clan(clanTag)](#Client+clan)
    * [.clanMembers(clanTag, option)](#Client+clanMembers)
    * [.clanWarlog(clanTag, option)](#Client+clanWarlog)
    * [.currentWar(clanTag, option)](#Client+currentWar)
    * [.clanWarLeague(clanTag)](#Client+clanWarLeague)
    * [.clanWarLeagueWarTags(warTag)](#Client+clanWarLeagueWarTags)
    * [.player(playerTag)](#Client+player)
    * [.leagues(option)](#Client+leagues)
    * [.leagueId(leagueId)](#Client+leagueId)
    * [.leagueSeasons(leagueId, option)](#Client+leagueSeasons)
    * [.leagueRanking(leagueId, seasonId, option)](#Client+leagueRanking)
    * [.warLeagues(option)](#Client+warLeagues)
    * [.warLeagueId(leagueId)](#Client+warLeagueId)
    * [.locations(option)](#Client+locations)
    * [.locationId(locationId)](#Client+locationId)
    * [.clanRanks(locationId, option)](#Client+clanRanks)
    * [.playerRanks(locationId, option)](#Client+playerRanks)
    * [.versusClanRanks(locationId, option)](#Client+versusClanRanks)
    * [.versusPlayerRanks(locationId, option)](#Client+versusPlayerRanks)
    * [.clanLabels(option)](#Client+clanLabels)
    * [.playerLabels(option)](#Client+playerLabels)

<a name="new_Client_new"></a>

### new Client(option)

| Param | Type | Description |
| --- | --- | --- |
| option | [<code>ClientOption</code>](#ClientOption) | API Options |

**Example**
```js
const { Client } = require('clashofclans.js');
const client = new Client({ token: '' });
```

```js
(async function() {
	const data = await client.locations({ limit: 1 })
	console.log(data);
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
    "paging": {
        "cursors": {
            "after": "eyJwb3MiOjF9"
        }
    },
    "status": 200,
    "ok": true,
    "maxAge": 600
}
```

<a name="maxAge"></a>

### maxAge
The `maxAge` ([Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)) is the maximum amount of time in seconds which shows how long until a fresh data is available.

```js
(async function() {
	const data = await client.clan('WRONG_TAG');
	console.log(data);
	// if (!data.ok) return console.log('INVALID TAG');
})();
```

```json
{
    "reason": "notFound",
    "status": 404,
    "ok": false,
    "maxAge": 600
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
- **503:** Service is temprorarily unavailable because of maintenance.
- **504:** Request Timeout.

<a name="Client+clans"></a>

### client.clans(name, option)
Search clans

| Param | Type | Description |
| --- | --- | --- |
| clan | <code>string</code> or [<code>ClanSearchOption</code>](#ClanSearchOption) | Search clans by name or filtering parameters. If name is used as part of search query, it needs to be at least three characters long. Name search parameter is interpreted as wild card search, so it may appear anywhere in the clan name. |

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
client.clan('#8QU8J9LP')
    .then(data => console.log(data))
    .catch(error => console.error(error));
```
<a name="Client+clanMembers"></a>

### client.clanMembers(clanTag, option)
List clan members

| Param | Type | Description |
| --- | --- | --- |
| clanTag | <code>string</code> | Tag of the clan. |
| option | [<code>SearchOption</code>](#SearchOption) | Optional options |

**Example**
```js
client.clanMembers('#8QU8J9LP', { limit: 10 })
    .then(data => console.log(data))
    .catch(error => console.error(error));
```
<a name="Client+clanWarlog"></a>

### client.clanWarlog(clanTag, option)
Retrieve clan's clan war log

| Param | Type | Description |
| --- | --- | --- |
| clanTag | <code>string</code> | Tag of the clan. |
| option | [<code>SearchOption</code>](#SearchOption) | Optional options |

**Example**
```js
client.clanWarlog('#8QU8J9LP', { limit: 10 })
    .then(data => console.log(data))
    .catch(error => console.error(error));
```
<a name="Client+currentWar"></a>

### client.currentWar(clanTag, option)
Retrieve information about clan's current clan war

| Param | Type | Description |
| --- | --- | --- |
| clanTag | <code>string</code> | Tag of the clan. |
| option | [<code>SearchOption</code>](#SearchOption) | Optional options |

**Example**
```js
client.currentWar('#8QU8J9LP')
    .then(data => console.log(data))
    .catch(error => console.error(error));
```
<a name="Client+clanWarLeague"></a>

### client.clanWarLeague(clanTag)
Retrieve information about clan's current clan war league group

| Param | Type | Description |
| --- | --- | --- |
| clanTag | <code>string</code> | Tag of the clan. |

**Example**
```js
client.clanWarLeague('#8QU8J9LP')
    .then(data => console.log(data))
    .catch(error => console.error(error));
```
<a name="Client+clanWarLeagueWarTags"></a>

### client.clanWarLeagueWarTags(clanTag)
Retrieve information about individual clan war league war

| Param | Type | Description |
| --- | --- | --- |
| warTag | <code>string</code> | WarTag of a CWL round. |

**Example**
```js
client.clanWarLeagueWarTags('#2QJQPYLJU')
    .then(data => console.log(data))
    .catch(error => console.error(error));
```
<a name="Client+player"></a>

### client.player(playerTag)
Get player information.

| Param | Type | Description |
| --- | --- | --- |
| playerTag | <code>string</code> | Tag of the player. |

**Example**
```js
client.player('#9Q92C8R20')
    .then(data => console.log(data))
    .catch(error => console.error(error));
```
<a name="Client+leagues"></a>

### client.leagues(option)
List Leagues

| Param | Type | Description |
| --- | --- | --- |
| option | [<code>SearchOption</code>](#SearchOption) | Optional options |

**Example**
```js
client.leagues()
    .then(data => console.log(data))
    .catch(error => console.error(error));
```
<a name="Client+leagueId"></a>

### client.leagueId(leagueId)
Get league information

| Param | Type | Description |
| --- | --- | --- |
| leagueId | <code>string</code> | Identifier of the league. |

**Example**
```js
client.leagueId('29000022')
    .then(data => console.log(data))
    .catch(error => console.error(error));
```
<a name="Client+leagueSeasons"></a>

### client.leagueSeasons(leagueId, option)
Get league seasons. Note that league season information is available only for Legend League.

| Param | Type | Description |
| --- | --- | --- |
| leagueId | <code>string</code> | Identifier of the league. |
| option | [<code>SearchOption</code>](#SearchOption) | Optional options |

**Example**
```js
client.leagueSeasons('29000022', { limit: 10 })
    .then(data => console.log(data))
    .catch(error => console.error(error));
```
<a name="Client+leagueRanking"></a>

### client.leagueRanking(leagueId, seasonId, option)
Get league season rankings. Note that league season information is available only for Legend League.

| Param | Type | Description |
| --- | --- | --- |
| leagueId | <code>string</code> | Identifier of the league. |
| seasonId | <code>string</code> | Identifier of the season. |
| option | [<code>SearchOption</code>](#SearchOption) | Optional options |

**Example**
```js
client.leagueRanking('29000022', '2020-03', { limit: 10 })
    .then(data => console.log(data))
    .catch(error => console.error(error));
```
<a name="Client+warLeagues"></a>

### client.warLeagues(option)
List war leagues

| Param | Type | Description |
| --- | --- | --- |
| option | [<code>SearchOption</code>](#SearchOption) | Optional options |

**Example**
```js
client.warLeagues()
    .then(data => console.log(data))
    .catch(error => console.error(error));
```
<a name="Client+warLeagueId"></a>

### client.warLeagueId(leagueId)
Get war league information

| Param | Type | Description |
| --- | --- | --- |
| leagueId | <code>string</code> | Identifier of the league. |

**Example**
```js
client.warLeagueId('48000018')
    .then(data => console.log(data))
    .catch(error => console.error(error));
```
<a name="Client+locations"></a>

### client.locations(option)
List locations

| Param | Type | Description |
| --- | --- | --- |
| option | [<code>SearchOption</code>](#SearchOption) | Optional options |

**Example**
```js
client.locations()
    .then(data => console.log(data))
    .catch(error => console.error(error));
// OR
client.locations({ limit: 10 })
    .then(data => console.log(data))
    .catch(error => console.error(error));
```
<a name="Client+locationId"></a>

### client.locationId(locationId)
Get information about specific location

| Param | Type | Description |
| --- | --- | --- |
| locationId | <code>string</code> | Identifier of the location to retrieve. |

**Example**
```js
client.locationId('32000107')
    .then(data => console.log(data))
    .catch(error => console.error(error));
```
<a name="Client+clanRanks"></a>

### client.clanRanks(locationId, option)
Get clan rankings for a specific location

| Param | Type | Description |
| --- | --- | --- |
| locationId | <code>string</code> | Identifier of the location to retrieve. |
| option | [<code>SearchOption</code>](#SearchOption) | Optional options |

**Example**
```js
client.clanRanks('32000107', { limit: 10 })
    .then(data => console.log(data))
    .catch(error => console.error(error));
```
<a name="Client+playerRanks"></a>

### client.playerRanks(locationId, option)
Get player rankings for a specific location

| Param | Type | Description |
| --- | --- | --- |
| locationId | <code>string</code> | Identifier of the location to retrieve. |
| option | [<code>SearchOption</code>](#SearchOption) | Optional options |

**Example**
```js
client.playerRanks('32000107', { limit: 10 })
    .then(data => console.log(data))
    .catch(error => console.error(error));
```
<a name="Client+versusClanRanks"></a>

### client.versusClanRanks(locationId, option)
Get clan versus rankings for a specific location

| Param | Type | Description |
| --- | --- | --- |
| locationId | <code>string</code> | Identifier of the location to retrieve. |
| option | [<code>SearchOption</code>](#SearchOption) | Optional options |

**Example**
```js
client.versusClanRanks('32000107', { limit: 10 })
    .then(data => console.log(data))
    .catch(error => console.error(error));
```
<a name="Client+versusPlayerRanks"></a>

### client.versusPlayerRanks(locationId, option)
Get player versus rankings for a specific location

| Param | Type | Description |
| --- | --- | --- |
| locationId | <code>string</code> | Identifier of the location to retrieve. |
| option | [<code>SearchOption</code>](#SearchOption) | Optional options |

**Example**
```js
client.versusPlayerRanks('32000107', { limit: 10 })
    .then(data => console.log(data))
    .catch(error => console.error(error));
```
<a name="Client+clanLabels"></a>

### client.clanLabels(option)
List clan labels

| Param | Type | Description |
| --- | --- | --- |
| option | [<code>SearchOption</code>](#SearchOption) | Optional options |

**Example**
```js
client.clanLabels()
    .then(data => console.log(data))
    .catch(error => console.error(error));
```
<a name="Client+playerLabels"></a>

### client.playerLabels(option)
List player labels

| Param | Type | Description |
| --- | --- | --- |
| option | [<code>SearchOption</code>](#SearchOption) | Optional options |

**Example**
```js
client.playerLabels()
    .then(data => console.log(data))
    .catch(error => console.error(error));
```

<hr>

<a name="ClientOption"></a>

## ClientOption : <code>Object</code>

| Param | Type | Description |
| --- | --- | --- |
| token | <code>string</code> | Clash of Clans API Token |
| timeout | <code>number</code> | Request timeout in millisecond |

<a name="ClanSearchOption"></a>

## ClanSearchOption : <code>Object</code>

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

<a name="SearchOption"></a>

## SearchOption : <code>Object</code>

| Param | Type | Description |
| --- | --- | --- |
| limit | <code>number</code> | Limit the number of items returned in the response. |
| after | <code>string</code> | Return only items that occur after this marker. Before marker can be found from the response, inside the 'paging' property. Note that only after or before can be specified for a request, not both. |
| before | <code>string</code> | Return only items that occur before this marker. Before marker can be found from the response, inside the 'paging' property. Note that only after or before can be specified for a request, not both. |
