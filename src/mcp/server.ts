#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { RestManager } from '../rest/RestManager';
import { LEGEND_LEAGUE_ID } from '../util/Constants';

// ─── Client Initialization ───────────────────────────────────────────────────

const baseURL = process.env.CLASH_OF_CLANS_API_BASE_URL;
const apiKeys = process.env.CLASH_OF_CLANS_API_KEYS?.split(',').filter(Boolean) || [];
const rest = new RestManager({ ...(apiKeys.length && { keys: apiKeys }), ...(baseURL && { baseURL }) });

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toJSON(value: unknown): string {
	return JSON.stringify(value, null, 2);
}

function mcpResult(value: unknown) {
	return { content: [{ type: 'text' as const, text: toJSON(value) }] };
}

// ─── Common Schemas ───────────────────────────────────────────────────────────

const clanTagSchema = { clanTag: z.string().min(1).describe('The clan tag (e.g. "#2PP")') };
const playerTagSchema = { playerTag: z.string().min(1).describe('The player tag (e.g. "#LUV2PG2Y9")') };
const paginationSchema = {
	limit: z.number().optional().describe('Maximum results per page'),
	after: z.string().optional().describe('Pagination cursor (after)'),
	before: z.string().optional().describe('Pagination cursor (before)')
};
const locationIdSchema = {
	locationId: z.union([z.literal('global'), z.number()]).describe('Location ID (number) or "global" for worldwide'),
	limit: z.number().optional().describe('Maximum results per page')
};

// ─── Server Setup ─────────────────────────────────────────────────────────────

const server = new McpServer({ name: 'clashofclans', version: '1.0.0' });

// ─── Tool Registrations ───────────────────────────────────────────────────────

server.registerTool(
	'get_clan',
	{ description: 'Get information about a Clash of Clans clan by its tag (e.g. "#2PP").', inputSchema: clanTagSchema },
	async ({ clanTag }) => {
		const { body } = await rest.getClan(clanTag);
		return mcpResult(body);
	}
);

server.registerTool(
	'search_clans',
	{
		description: 'Search clans by name and/or filtering parameters.',
		inputSchema: {
			name: z.string().optional().describe('Clan name to search (min 3 characters)'),
			minMembers: z.number().optional().describe('Minimum member count'),
			maxMembers: z.number().optional().describe('Maximum member count'),
			minClanPoints: z.number().optional().describe('Minimum clan points'),
			minClanLevel: z.number().optional().describe('Minimum clan level'),
			warFrequency: z
				.string()
				.optional()
				.describe('War frequency filter (always, moreThanOncePerWeek, oncePerWeek, lessThanOncePerWeek, never, unknown)'),
			locationId: z.string().optional().describe('Location ID to filter by'),
			labelIds: z.string().optional().describe('Comma-separated label IDs'),
			limit: z.number().optional().describe('Maximum number of results')
		}
	},
	async (params) => {
		const { body } = await rest.getClans(params);
		return mcpResult(body);
	}
);

server.registerTool(
	'get_clan_members',
	{ description: 'Get the list of members in a clan.', inputSchema: { ...clanTagSchema, ...paginationSchema } },
	async ({ clanTag, ...opts }) => {
		const { body } = await rest.getClanMembers(clanTag, opts);
		return mcpResult(body);
	}
);

server.registerTool(
	'get_clan_war_log',
	{ description: 'Get the war log for a clan.', inputSchema: { ...clanTagSchema, ...paginationSchema } },
	async ({ clanTag, ...opts }) => {
		const { body } = await rest.getClanWarLog(clanTag, opts);
		return mcpResult(body);
	}
);

server.registerTool(
	'get_clan_war',
	{ description: 'Get information about the currently running war (normal or friendly) for a clan.', inputSchema: clanTagSchema },
	async ({ clanTag }) => {
		const { body } = await rest.getCurrentWar(clanTag);
		return mcpResult(body);
	}
);

server.registerTool(
	'get_current_war',
	{
		description: 'Get the currently running war for a clan. Automatically handles both normal wars and Clan War League (CWL).',
		inputSchema: clanTagSchema
	},
	async ({ clanTag }) => {
		const { body } = await rest.getCurrentWar(clanTag);
		return mcpResult(body);
	}
);

server.registerTool(
	'get_clan_war_league_group',
	{ description: 'Get information about the Clan War League (CWL) group for a clan.', inputSchema: clanTagSchema },
	async ({ clanTag }) => {
		const { body } = await rest.getClanWarLeagueGroup(clanTag);
		return mcpResult(body);
	}
);

server.registerTool(
	'get_league_wars',
	{ description: 'Get the active CWL wars (last 2 rounds) for a clan.', inputSchema: clanTagSchema },
	async ({ clanTag }) => {
		const { body: group } = await rest.getClanWarLeagueGroup(clanTag);
		const rounds = group.rounds.filter((r) => !r.warTags.includes('#0'));
		const warTags = rounds
			.slice(-2)
			.flatMap((r) => r.warTags)
			.reverse();
		const wars = (await Promise.allSettled(warTags.map((tag) => rest.getClanWarLeagueRound(tag))))
			.filter((r) => r.status === 'fulfilled')
			.map((r) => (r as PromiseFulfilledResult<{ body: unknown }>).value.body);
		return mcpResult(wars);
	}
);

server.registerTool(
	'get_capital_raid_seasons',
	{ description: 'Get the Clan Capital raid seasons for a clan.', inputSchema: { ...clanTagSchema, ...paginationSchema } },
	async ({ clanTag, ...opts }) => {
		const { body } = await rest.getCapitalRaidSeasons(clanTag, opts);
		return mcpResult(body);
	}
);

server.registerTool(
	'get_player',
	{ description: 'Get detailed information about a player by their tag.', inputSchema: playerTagSchema },
	async ({ playerTag }) => {
		const { body } = await rest.getPlayer(playerTag);
		return mcpResult(body);
	}
);

server.registerTool(
	'get_players',
	{
		description: 'Get information about multiple players by their tags (fetched in parallel).',
		inputSchema: { playerTags: z.array(z.string()).min(1).describe('Array of player tags') }
	},
	async ({ playerTags }) => {
		const results = (await Promise.allSettled(playerTags.map((tag) => rest.getPlayer(tag))))
			.filter((r) => r.status === 'fulfilled')
			.map((r) => (r as PromiseFulfilledResult<{ body: unknown }>).value.body);
		return mcpResult(results);
	}
);

server.registerTool(
	'verify_player_token',
	{
		description: "Verify a player's API token from their in-game settings.",
		inputSchema: { ...playerTagSchema, token: z.string().min(1).describe('The API token from game settings') }
	},
	async ({ playerTag, token }) => {
		const { body } = await rest.verifyPlayerToken(playerTag, token);
		return mcpResult({ verified: body.status === 'ok' });
	}
);

server.registerTool(
	'get_player_ranks',
	{ description: 'Get player trophy rankings for a location. Use "global" for worldwide rankings.', inputSchema: locationIdSchema },
	async ({ locationId, limit }) => {
		const { body } = await rest.getPlayerRanks(locationId, { limit });
		return mcpResult(body);
	}
);

server.registerTool(
	'get_clan_ranks',
	{ description: 'Get clan trophy rankings for a location. Use "global" for worldwide rankings.', inputSchema: locationIdSchema },
	async ({ locationId, limit }) => {
		const { body } = await rest.getClanRanks(locationId, { limit });
		return mcpResult(body);
	}
);

server.registerTool(
	'get_builder_base_player_ranks',
	{ description: 'Get Builder Base player rankings for a location.', inputSchema: locationIdSchema },
	async ({ locationId, limit }) => {
		const { body } = await rest.getBuilderBasePlayerRanks(locationId, { limit });
		return mcpResult(body);
	}
);

server.registerTool(
	'get_builder_base_clan_ranks',
	{ description: 'Get Builder Base clan rankings for a location.', inputSchema: locationIdSchema },
	async ({ locationId, limit }) => {
		const { body } = await rest.getBuilderBaseClanRanks(locationId, { limit });
		return mcpResult(body);
	}
);

server.registerTool(
	'get_clan_capital_ranks',
	{ description: 'Get Clan Capital rankings for a location.', inputSchema: locationIdSchema },
	async ({ locationId, limit }) => {
		const { body } = await rest.getClanCapitalRanks(locationId, { limit });
		return mcpResult(body);
	}
);

server.registerTool(
	'get_locations',
	{
		description: 'Get a list of all available in-game locations (countries and regions).',
		inputSchema: { limit: z.number().optional().describe('Maximum results per page') }
	},
	async ({ limit }) => {
		const { body } = await rest.getLocations({ limit });
		return mcpResult(body);
	}
);

server.registerTool('get_war_leagues', { description: 'Get a list of all Clan War League tiers.', inputSchema: {} }, async () => {
	const { body } = await rest.getWarLeagues();
	return mcpResult(body);
});

server.registerTool('get_league_tiers', { description: 'Get a list of all trophy league tiers.', inputSchema: {} }, async () => {
	const { body } = await rest.getLeagueTiers();
	return mcpResult(body);
});

server.registerTool('get_capital_leagues', { description: 'Get a list of all Clan Capital league tiers.', inputSchema: {} }, async () => {
	const { body } = await rest.getCapitalLeagues();
	return mcpResult(body);
});

server.registerTool(
	'get_builder_base_leagues',
	{ description: 'Get a list of all Builder Base league tiers.', inputSchema: {} },
	async () => {
		const { body } = await rest.getBuilderBaseLeagues();
		return mcpResult(body);
	}
);

server.registerTool(
	'get_league_seasons',
	{
		description: 'Get the available Legend League season IDs.',
		inputSchema: { limit: z.number().optional().describe('Maximum results per page') }
	},
	async ({ limit }) => {
		const { body } = await rest.getLeagueSeasons(LEGEND_LEAGUE_ID, { limit });
		return mcpResult(body);
	}
);

server.registerTool(
	'get_season_rankings',
	{
		description: 'Get player rankings for a specific Legend League season.',
		inputSchema: {
			seasonId: z.string().min(1).describe('Season ID (e.g. "2024-06")'),
			limit: z.number().optional().describe('Maximum results per page')
		}
	},
	async ({ seasonId, limit }) => {
		const { body } = await rest.getSeasonRankings(LEGEND_LEAGUE_ID, seasonId, { limit });
		return mcpResult(body);
	}
);

server.registerTool(
	'get_gold_pass_season',
	{ description: 'Get information about the current Gold Pass season.', inputSchema: {} },
	async () => {
		const { body } = await rest.getGoldPassSeason();
		return mcpResult(body);
	}
);

server.registerTool('get_clan_labels', { description: 'Get the list of all available clan labels.', inputSchema: {} }, async () => {
	const { body } = await rest.getClanLabels();
	return mcpResult(body);
});

server.registerTool('get_player_labels', { description: 'Get the list of all available player labels.', inputSchema: {} }, async () => {
	const { body } = await rest.getPlayerLabels();
	return mcpResult(body);
});

server.registerTool(
	'get_battle_log',
	{ description: "Get a player's recent attack and defense battle log.", inputSchema: playerTagSchema },
	async ({ playerTag }) => {
		const { body } = await rest.getBattleLog(playerTag);
		return mcpResult(body);
	}
);

server.registerTool(
	'get_league_history',
	{ description: "Get a player's Legend League season history.", inputSchema: playerTagSchema },
	async ({ playerTag }) => {
		const { body } = await rest.getLeagueHistory(playerTag);
		return mcpResult(body);
	}
);

// ─── Entry Point ──────────────────────────────────────────────────────────────

async function main() {
	const transport = new StdioServerTransport();
	await server.connect(transport);
}

main().catch((err) => {
	console.error(err instanceof Error ? err.message : err);
	process.exit(1);
});
