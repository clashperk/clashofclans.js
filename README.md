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
    * [.clans(name, option)](#Client+clans) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.clan(clanTag)](#Client+clan) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.clanMembers(clanTag, option)](#Client+clanMembers) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.clanWarlog(clanTag, option)](#Client+clanWarlog) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.currentWar(clanTag, option)](#Client+currentWar) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.clanWarLeague(clanTag)](#Client+clanWarLeague) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.clanWarLeagueWarTags(clanTag)](#Client+clanWarLeagueWarTags) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.player(playerTag)](#Client+player) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.leagues(option)](#Client+leagues) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.leagueId(leagueId)](#Client+leagueId) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.leagueSeasons(leagueId, option)](#Client+leagueSeasons) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.leagueRanking(leagueId, seasonId, option)](#Client+leagueRanking) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.warLeagues(option)](#Client+warLeagues) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.warLeagueId(leagueId)](#Client+warLeagueId) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.locations(option)](#Client+locations) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.locationId(locationId)](#Client+locationId) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.clanRanks(locationId, option)](#Client+clanRanks) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.playerRanks(locationId, option)](#Client+playerRanks) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.versusClanRanks(locationId, option)](#Client+versusClanRanks) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.versusPlayerRanks(locationId, option)](#Client+versusPlayerRanks) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.clanLabels(option)](#Client+clanLabels) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.playerLabels(option)](#Client+playerLabels) ⇒ <code>Promise.&lt;Object&gt;</code>

<a name="new_Client_new"></a>

### new Client(option)

| Param | Type | Description |
| --- | --- | --- |
| option | [<code>ClientOption</code>](#ClientOption) | API Options |

**Example**
```js
const { Client } = require('clashofclans.js');
const client = new Client({ token: '', timeout: 5000 });
```
<a name="Client+clans"></a>

### client.clans(name, option) ⇒ <code>Promise.&lt;Object&gt;</code>
Search clans

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Search clans by name. If name is used as part of search query, it needs to be at least three characters long. Name search parameter is interpreted as wild card search, so it may appear anywhere in the clan name. |
| option | [<code>ClanSearchOption</code>](#ClanSearchOption) | Optional options |

**Example**
```js
client.clans('air hounds', { limit: 10 });
```
<a name="Client+clan"></a>

### client.clan(clanTag) ⇒ <code>Promise.&lt;Object&gt;</code>
Get clan information

| Param | Type | Description |
| --- | --- | --- |
| clanTag | <code>string</code> | Tag of the clan. |

**Example**
```js
client.clan('#8QU8J9LP');
```
<a name="Client+clanMembers"></a>

### client.clanMembers(clanTag, option) ⇒ <code>Promise.&lt;Object&gt;</code>
List clan members

| Param | Type | Description |
| --- | --- | --- |
| clanTag | <code>string</code> | Tag of the clan. |
| option | [<code>SearchOption</code>](#SearchOption) | Optional options |

**Example**
```js
client.clanMembers('#8QU8J9LP', { limit: 10 });
```
<a name="Client+clanWarlog"></a>

### client.clanWarlog(clanTag, option) ⇒ <code>Promise.&lt;Object&gt;</code>
Retrieve clan's clan war log

| Param | Type | Description |
| --- | --- | --- |
| clanTag | <code>string</code> | Tag of the clan. |
| option | [<code>SearchOption</code>](#SearchOption) | Optional options |

**Example**
```js
client.clanWarlog('#8QU8J9LP', { limit: 10 });
```
<a name="Client+currentWar"></a>

### client.currentWar(clanTag, option) ⇒ <code>Promise.&lt;Object&gt;</code>
Retrieve information about clan's current clan war

| Param | Type | Description |
| --- | --- | --- |
| clanTag | <code>string</code> | Tag of the clan. |
| option | [<code>SearchOption</code>](#SearchOption) | Optional options |

**Example**
```js
client.currentWar('#8QU8J9LP');
```
<a name="Client+clanWarLeague"></a>

### client.clanWarLeague(clanTag) ⇒ <code>Promise.&lt;Object&gt;</code>
Retrieve information about clan's current clan war league group

| Param | Type | Description |
| --- | --- | --- |
| clanTag | <code>string</code> | Tag of the clan. |

**Example**
```js
client.clanWarLeague('#8QU8J9LP');
```
<a name="Client+clanWarLeagueWarTags"></a>

### client.clanWarLeagueWarTags(clanTag) ⇒ <code>Promise.&lt;Object&gt;</code>
Retrieve information about individual clan war league war

| Param | Type | Description |
| --- | --- | --- |
| clanTag | <code>string</code> | Tag of the clan. |

**Example**
```js
client.clanWarLeagueWarTags('#8QU8J9LP');
```
<a name="Client+player"></a>

### client.player(playerTag) ⇒ <code>Promise.&lt;Object&gt;</code>
Get player information.

| Param | Type | Description |
| --- | --- | --- |
| playerTag | <code>string</code> | Tag of the player. |

**Example**
```js
client.player('#8QU8J9LP');
```
<a name="Client+leagues"></a>

### client.leagues(option) ⇒ <code>Promise.&lt;Object&gt;</code>
List Leagues

| Param | Type | Description |
| --- | --- | --- |
| option | [<code>SearchOption</code>](#SearchOption) | Optional options |

**Example**
```js
client.leagues();
```
<a name="Client+leagueId"></a>

### client.leagueId(leagueId) ⇒ <code>Promise.&lt;Object&gt;</code>
Get league information

| Param | Type | Description |
| --- | --- | --- |
| leagueId | <code>string</code> | Identifier of the league. |

**Example**
```js
client.leagueId('29000022');
```
<a name="Client+leagueSeasons"></a>

### client.leagueSeasons(leagueId, option) ⇒ <code>Promise.&lt;Object&gt;</code>
Get league seasons. Note that league season information is available only for Legend League.

| Param | Type | Description |
| --- | --- | --- |
| leagueId | <code>string</code> | Identifier of the league. |
| option | [<code>SearchOption</code>](#SearchOption) | Optional options |

**Example**
```js
client.leagueSeasons('29000022', { limit: 10 });
```
<a name="Client+leagueRanking"></a>

### client.leagueRanking(leagueId, seasonId, option) ⇒ <code>Promise.&lt;Object&gt;</code>
Get league season rankings. Note that league season information is available only for Legend League.

| Param | Type | Description |
| --- | --- | --- |
| leagueId | <code>string</code> | Identifier of the league. |
| seasonId | <code>string</code> | Identifier of the season. |
| option | [<code>SearchOption</code>](#SearchOption) | Optional options |

**Example**
```js
client.leagueRanking('29000022', '2020-03', { limit: 10 });
```
<a name="Client+warLeagues"></a>

### client.warLeagues(option) ⇒ <code>Promise.&lt;Object&gt;</code>
List war leagues

| Param | Type | Description |
| --- | --- | --- |
| option | [<code>SearchOption</code>](#SearchOption) | Optional options |

**Example**
```js
client.warLeagues();
```
<a name="Client+warLeagueId"></a>

### client.warLeagueId(leagueId) ⇒ <code>Promise.&lt;Object&gt;</code>
Get war league information

| Param | Type | Description |
| --- | --- | --- |
| leagueId | <code>string</code> | Identifier of the league. |

**Example**
```js
client.warLeagueId('48000018');
```
<a name="Client+locations"></a>

### client.locations(option) ⇒ <code>Promise.&lt;Object&gt;</code>
List locations

| Param | Type | Description |
| --- | --- | --- |
| option | [<code>SearchOption</code>](#SearchOption) | Optional options |

**Example**
```js
client.locations();
// OR
client.locations({ limit: 10 });
```
<a name="Client+locationId"></a>

### client.locationId(locationId) ⇒ <code>Promise.&lt;Object&gt;</code>
Get information about specific location

| Param | Type | Description |
| --- | --- | --- |
| locationId | <code>string</code> | Identifier of the location to retrieve. |

**Example**
```js
client.locationId('32000107');
```
<a name="Client+clanRanks"></a>

### client.clanRanks(locationId, option) ⇒ <code>Promise.&lt;Object&gt;</code>
Get clan rankings for a specific location

| Param | Type | Description |
| --- | --- | --- |
| locationId | <code>string</code> | Identifier of the location to retrieve. |
| option | [<code>SearchOption</code>](#SearchOption) | Optional options |

**Example**
```js
client.clanRanks('32000107', { limit: 10 });
```
<a name="Client+playerRanks"></a>

### client.playerRanks(locationId, option) ⇒ <code>Promise.&lt;Object&gt;</code>
Get player rankings for a specific location

| Param | Type | Description |
| --- | --- | --- |
| locationId | <code>string</code> | Identifier of the location to retrieve. |
| option | [<code>SearchOption</code>](#SearchOption) | Optional options |

**Example**
```js
client.playerRanks('32000107', { limit: 10 });
```
<a name="Client+versusClanRanks"></a>

### client.versusClanRanks(locationId, option) ⇒ <code>Promise.&lt;Object&gt;</code>
Get clan versus rankings for a specific location

| Param | Type | Description |
| --- | --- | --- |
| locationId | <code>string</code> | Identifier of the location to retrieve. |
| option | [<code>SearchOption</code>](#SearchOption) | Optional options |

**Example**
```js
client.versusClanRanks('32000107', { limit: 10 });
```
<a name="Client+versusPlayerRanks"></a>

### client.versusPlayerRanks(locationId, option) ⇒ <code>Promise.&lt;Object&gt;</code>
Get player versus rankings for a specific location

| Param | Type | Description |
| --- | --- | --- |
| locationId | <code>string</code> | Identifier of the location to retrieve. |
| option | [<code>SearchOption</code>](#SearchOption) | Optional options |

**Example**
```js
client.versusPlayerRanks('32000107', { limit: 10 });
```
<a name="Client+clanLabels"></a>

### client.clanLabels(option) ⇒ <code>Promise.&lt;Object&gt;</code>
List clan labels

| Param | Type | Description |
| --- | --- | --- |
| option | [<code>SearchOption</code>](#SearchOption) | Optional options |

**Example**
```js
client.clanLabels();
```
<a name="Client+playerLabels"></a>

### client.playerLabels(option) ⇒ <code>Promise.&lt;Object&gt;</code>
List player labels

| Param | Type | Description |
| --- | --- | --- |
| option | [<code>SearchOption</code>](#SearchOption) | Optional options |

**Example**
```js
client.playerLabels();
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