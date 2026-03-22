# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**clashofclans.js** is a TypeScript library wrapping the official Clash of Clans REST API (`https://api.clashofclans.com/v1`). It provides typed data structures, rate limiting, caching, and authentication via email/password or direct API keys.

## Build & Development Commands

```bash
npm run prepare        # Clean dist/ and rebuild (rimraf + tsc + ESM wrapper)
npm run build          # TypeScript compile + generate ESM wrapper
npm run lint:test      # Run ESLint checks
npm run lint:fix       # Auto-fix ESLint issues
npm test               # Run Jest tests (TZ=UTC, loads .env)
npm run test:watch     # Jest in watch mode
npm run test:bun       # Run tests with Bun runtime
```

Tests require environment variables (`EMAIL`, `PASSWORD`, optionally `BASE_URL`) configured in `.env`.

## Architecture

The library is organized in four layers under `src/`:

1. **Client** (`client/`) — `Client` is the main EventEmitter-based entry point. Users instantiate it, call `login()`, then use methods like `getClan()`, `getPlayer()`, `getClanWar()`, etc. `PollingClient` extends Client for event-based polling (deprecated).

2. **REST** (`rest/`) — `RESTManager` orchestrates API calls. `RequestHandler` handles HTTP requests using native fetch, with retry logic, key rotation, and rate limiting. `Throttler` provides `QueueThrottler` and `BatchThrottler` implementations. `HTTPError` wraps API errors with reason codes.

3. **Structures** (`struct/`) — ~24 classes (Clan, Player, ClanWar, ClanMember, Unit, etc.) that wrap raw API responses into typed objects with helper methods.

4. **Types** (`types/`) — `api.ts` defines raw API response interfaces (prefixed `API*`), `lib.ts` defines library-facing types (ClientOptions, SearchOptions, etc.).

5. **Utilities** (`util/`) — `Constants.ts` has the API base URL and static game data (troop/spell/hero lists, league info). `Store.ts` provides a cache implementation. `raw.json` contains static unit/game data.

## Key Patterns

- **Dual output**: CommonJS (`dist/index.js`) + ESM wrapper (`dist/index.mjs`) via `gen-esm-wrapper`
- **Experimental decorators** are enabled and used (see `Decorators.ts`)
- **Event system**: Client emits `CLIENT_EVENTS.DEBUG`/`ERROR`; RESTManager emits `REST_EVENTS.DEBUG`/`ERROR`/`RATE_LIMITED`
- **Authentication flow**: `Client.login()` can auto-create API keys via email/password, or accept pre-existing keys
- **Node.js >= 20** required (uses native fetch)

## Test Structure

Tests live alongside source as `*.spec.ts` files in `src/`. Jest config is in `jest.config.json` using `ts-jest`. Tests hit the real API (not mocked), so valid credentials are needed.
