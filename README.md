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

- [Documentation](https://clashofclans.js.org/api/)
- [Clash of Clans Developer Website](https://developer.clashofclans.com/)
- [Clash of Clans API Community Discord](https://discord.gg/Eaja7gJ)

### Example

```js
const { Client } = require('clashofclans.js');
const client = new Client({ keys: ['API_KEY'] });

(async function() {
	const data = await client.locations('#8QU8J9LP', { limit: 1 });
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
(async function() {
	const data = await client.clan('#WRONG_TAG');
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
- **504:** Request Timeout.

## Methods

| Methods                                                               | Description                       |
| --------------------------------------------------------------------- | --------------------------------- |
| [init(options)](https://clashofclans.js.org/api#Client#init)                                         | Initialize Extension class and create keys |
| [parseTag(tag)](https://clashofclans.js.org/api#Client#parseTag)                                     | Parse a clan or player Tag |
| [clans([options])](https://clashofclans.js.org/api#Client#clans)                                     | Search clans |
| [clan(clanTag)](https://clashofclans.js.org/api#Client#clan)                                         | Get clan information |
| [clanMembers(clanTag, [options])](https://clashofclans.js.org/api#Client#clanMembers)                | List clan members |
| [detailedClanMembers(members)](https://clashofclans.js.org/api#Client#detailedClanMembers)           | Detailed clan members |
| [clanWarLog(clanTag, [options])](https://clashofclans.js.org/api#Client#clanWarLog)                  | Retrieve clan's clan war log |
| [currentClanWar(clanTag, [options])](https://clashofclans.js.org/api#Client#currentClanWar)          | Information about clan's current clan war |
| [clanWarLeague(clanTag)](https://clashofclans.js.org/api#Client#clanWarLeague)                       | Information about clan's current clan war league group |
| [clanWarLeagueWar(warTag)](https://clashofclans.js.org/api#Client#clanWarLeagueWar)                  | Information about individual clan war league war |
| [player(playerTag)](https://clashofclans.js.org/api#Client#player)                                   | Get player information |
| [verifyPlayerToken(playerTag, token)](https://clashofclans.js.org/api#Client#verifyPlayerToken)      | Verify player API token |
| [leagues([options])](https://clashofclans.js.org/api#Client#leagues)                                 | List Leagues |
| [league(leagueId)](https://clashofclans.js.org/api#Client#league)                                    | Get league information |
| [leagueSeason(leagueId, [options])](https://clashofclans.js.org/api#Client#leagueSeason)             | Get league seasons |
| [leagueRanking(leagueId, seasonId, [options])](https://clashofclans.js.org/api#Client#leagueRanking) | Get league season rankings |
| [warLeagues([options])](https://clashofclans.js.org/api#Client#warLeagues)                           | List war leagues |
| [warLeague(leagueId)](https://clashofclans.js.org/api#Client#warLeague)                              | Get war league information |
| [locations([options])](https://clashofclans.js.org/api#Client#locations)                             | List locations |
| [location(locationId)](https://clashofclans.js.org/api#Client#location)                              | Get information about specific location |
| [clanRanks(locationId, [options])](https://clashofclans.js.org/api#Client#clanRanks)                 | Get clan rankings for a specific location |
| [playerRanks(locationId, [options])](https://clashofclans.js.org/api#Client#playerRanks)             | Get player rankings for a specific location |
| [versusClanRanks(locationId, [options])](https://clashofclans.js.org/api#Client#versusClanRanks)     | Get clan versus rankings for a specific location |
| [versusPlayerRanks(locationId, [options])](https://clashofclans.js.org/api#Client#versusPlayerRanks) | Get player versus rankings for a specific location |
| [clanLabels([options])](https://clashofclans.js.org/api#Client#clanLabels)                           | List clan labels |
| [playerLabels([options])](https://clashofclans.js.org/api#Client#playerLabels)                       | List player labels |
| [goldPassSeason()](https://clashofclans.js.org/api#Client#goldPassSeason)                            | Get information about the current gold pass season |

### Create API Token

This method is for creating API keys for the external IP the code is running on. Therefore no static IP is required and always ready to be deployed on Serverless platform like Heroku.

```js
const { Client } = require('clashofclans.js');
const client = new Client();

(async () => {
	await client.init({ email: '', password: '' });
	// you would have to run the `init` method just for once.
    
	const data = await client.clan('#2PP');
	console.log(data);
})();
```

### Disclaimer
> This content is not affiliated with, endorsed, sponsored, or specifically approved by Supercell and Supercell is not responsible for it. For more information see [Supercell’s Fan Content Policy](https://supercell.com/en/fan-content-policy/).
