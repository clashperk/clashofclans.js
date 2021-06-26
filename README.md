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

## Create API Token

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

### Links

- [Documentation](https://clashofclans.js.org/)
- [Clash of Clans Developer Website](https://developer.clashofclans.com/)
- [Clash of Clans API Community Discord](https://discord.gg/Eaja7gJ)

### Disclaimer
> This content is not affiliated with, endorsed, sponsored, or specifically approved by Supercell and Supercell is not responsible for it. For more information see [Supercell’s Fan Content Policy](https://supercell.com/en/fan-content-policy/).
