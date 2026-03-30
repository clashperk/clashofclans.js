#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ErrorCode, ListToolsRequestSchema, McpError } from '@modelcontextprotocol/sdk/types.js';
import { Client } from '../client/Client';

// ─── Client Initialization ───────────────────────────────────────────────────

const apiKeys = (process.env.CLASH_API_KEYS ?? '').split(',').filter(Boolean);
const baseURL = process.env.CLASH_BASE_URL;
const client = new Client({ ...(apiKeys.length && { keys: apiKeys }), ...(baseURL && { baseURL }) });

function ensureClient() {
	if (!apiKeys.length) {
		throw new McpError(ErrorCode.InternalError, 'Authentication required. Set the CLASH_API_KEYS environment variable.');
	}
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toJSON(value: unknown): string {
	return JSON.stringify(value, null, 2);
}

function mcpResult(value: unknown) {
	return { content: [{ type: 'text' as const, text: toJSON(value) }] };
}

function requireString(params: Record<string, unknown>, key: string): string {
	const val = params[key];
	if (typeof val !== 'string' || !val.trim()) {
		throw new McpError(ErrorCode.InvalidParams, `"${key}" is required and must be a non-empty string`);
	}
	return val.trim();
}

function optionalString(params: Record<string, unknown>, key: string): string | undefined {
	const val = params[key];
	return typeof val === 'string' && val.trim() ? val.trim() : undefined;
}

function optionalNumber(params: Record<string, unknown>, key: string): number | undefined {
	const val = params[key];
	return typeof val === 'number' ? val : undefined;
}

function searchOptions(params: Record<string, unknown>) {
	return {
		limit: optionalNumber(params, 'limit'),
		after: optionalString(params, 'after'),
		before: optionalString(params, 'before')
	};
}

// ─── Tool Definitions ─────────────────────────────────────────────────────────

const TOOLS = [
	{
		name: 'get_clan',
		description: 'Get information about a Clash of Clans clan by its tag (e.g. "#2PP").',
		inputSchema: {
			type: 'object',
			properties: {
				clanTag: { type: 'string', description: 'The clan tag (e.g. "#2PP")' }
			},
			required: ['clanTag']
		}
	},
	{
		name: 'search_clans',
		description: 'Search clans by name and/or filtering parameters.',
		inputSchema: {
			type: 'object',
			properties: {
				name: { type: 'string', description: 'Clan name to search (min 3 characters)' },
				minMembers: { type: 'number', description: 'Minimum member count' },
				maxMembers: { type: 'number', description: 'Maximum member count' },
				minClanPoints: { type: 'number', description: 'Minimum clan points' },
				minClanLevel: { type: 'number', description: 'Minimum clan level' },
				warFrequency: {
					type: 'string',
					description: 'War frequency filter (always, moreThanOncePerWeek, oncePerWeek, lessThanOncePerWeek, never, unknown)'
				},
				locationId: { type: 'string', description: 'Location ID to filter by' },
				labelIds: { type: 'string', description: 'Comma-separated label IDs' },
				limit: { type: 'number', description: 'Maximum number of results' }
			}
		}
	},
	{
		name: 'get_clan_members',
		description: 'Get the list of members in a clan.',
		inputSchema: {
			type: 'object',
			properties: {
				clanTag: { type: 'string', description: 'The clan tag' },
				limit: { type: 'number', description: 'Maximum results per page' },
				after: { type: 'string', description: 'Pagination cursor (after)' },
				before: { type: 'string', description: 'Pagination cursor (before)' }
			},
			required: ['clanTag']
		}
	},
	{
		name: 'get_clan_war_log',
		description: 'Get the war log for a clan.',
		inputSchema: {
			type: 'object',
			properties: {
				clanTag: { type: 'string', description: 'The clan tag' },
				limit: { type: 'number', description: 'Maximum results per page' },
				after: { type: 'string', description: 'Pagination cursor (after)' },
				before: { type: 'string', description: 'Pagination cursor (before)' }
			},
			required: ['clanTag']
		}
	},
	{
		name: 'get_clan_war',
		description: 'Get information about the currently running war (normal or friendly) for a clan.',
		inputSchema: {
			type: 'object',
			properties: {
				clanTag: { type: 'string', description: 'The clan tag' }
			},
			required: ['clanTag']
		}
	},
	{
		name: 'get_current_war',
		description:
			'Get the currently running war for a clan. Automatically handles both normal wars and Clan War League (CWL). Optionally specify a CWL round.',
		inputSchema: {
			type: 'object',
			properties: {
				clanTag: { type: 'string', description: 'The clan tag' },
				round: {
					type: 'string',
					enum: ['PREVIOUS_ROUND', 'CURRENT_ROUND', 'NEXT_ROUND'],
					description: 'CWL round selector (optional)'
				}
			},
			required: ['clanTag']
		}
	},
	{
		name: 'get_clan_war_league_group',
		description: 'Get information about the Clan War League (CWL) group for a clan.',
		inputSchema: {
			type: 'object',
			properties: {
				clanTag: { type: 'string', description: 'The clan tag' }
			},
			required: ['clanTag']
		}
	},
	{
		name: 'get_league_wars',
		description: 'Get the active CWL wars (last 2 rounds) for a clan.',
		inputSchema: {
			type: 'object',
			properties: {
				clanTag: { type: 'string', description: 'The clan tag' }
			},
			required: ['clanTag']
		}
	},
	{
		name: 'get_capital_raid_seasons',
		description: 'Get the Clan Capital raid seasons for a clan.',
		inputSchema: {
			type: 'object',
			properties: {
				clanTag: { type: 'string', description: 'The clan tag' },
				limit: { type: 'number', description: 'Maximum results per page' },
				after: { type: 'string', description: 'Pagination cursor (after)' },
				before: { type: 'string', description: 'Pagination cursor (before)' }
			},
			required: ['clanTag']
		}
	},
	{
		name: 'get_player',
		description: 'Get detailed information about a player by their tag.',
		inputSchema: {
			type: 'object',
			properties: {
				playerTag: { type: 'string', description: 'The player tag (e.g. "#LUV2PG2Y9")' }
			},
			required: ['playerTag']
		}
	},
	{
		name: 'get_players',
		description: 'Get information about multiple players by their tags (fetched in parallel).',
		inputSchema: {
			type: 'object',
			properties: {
				playerTags: {
					type: 'array',
					items: { type: 'string' },
					description: 'Array of player tags'
				}
			},
			required: ['playerTags']
		}
	},
	{
		name: 'verify_player_token',
		description: "Verify a player's API token from their in-game settings.",
		inputSchema: {
			type: 'object',
			properties: {
				playerTag: { type: 'string', description: 'The player tag' },
				token: { type: 'string', description: 'The API token from game settings' }
			},
			required: ['playerTag', 'token']
		}
	},
	{
		name: 'get_player_ranks',
		description: 'Get player trophy rankings for a location. Use "global" for worldwide rankings.',
		inputSchema: {
			type: 'object',
			properties: {
				locationId: {
					description: 'Location ID (number) or "global" for worldwide',
					oneOf: [{ type: 'string', enum: ['global'] }, { type: 'number' }]
				},
				limit: { type: 'number', description: 'Maximum results per page' }
			},
			required: ['locationId']
		}
	},
	{
		name: 'get_clan_ranks',
		description: 'Get clan trophy rankings for a location. Use "global" for worldwide rankings.',
		inputSchema: {
			type: 'object',
			properties: {
				locationId: {
					description: 'Location ID (number) or "global" for worldwide',
					oneOf: [{ type: 'string', enum: ['global'] }, { type: 'number' }]
				},
				limit: { type: 'number', description: 'Maximum results per page' }
			},
			required: ['locationId']
		}
	},
	{
		name: 'get_builder_base_player_ranks',
		description: 'Get Builder Base player rankings for a location.',
		inputSchema: {
			type: 'object',
			properties: {
				locationId: {
					description: 'Location ID (number) or "global" for worldwide',
					oneOf: [{ type: 'string', enum: ['global'] }, { type: 'number' }]
				},
				limit: { type: 'number', description: 'Maximum results per page' }
			},
			required: ['locationId']
		}
	},
	{
		name: 'get_builder_base_clan_ranks',
		description: 'Get Builder Base clan rankings for a location.',
		inputSchema: {
			type: 'object',
			properties: {
				locationId: {
					description: 'Location ID (number) or "global" for worldwide',
					oneOf: [{ type: 'string', enum: ['global'] }, { type: 'number' }]
				},
				limit: { type: 'number', description: 'Maximum results per page' }
			},
			required: ['locationId']
		}
	},
	{
		name: 'get_clan_capital_ranks',
		description: 'Get Clan Capital rankings for a location.',
		inputSchema: {
			type: 'object',
			properties: {
				locationId: {
					description: 'Location ID (number) or "global" for worldwide',
					oneOf: [{ type: 'string', enum: ['global'] }, { type: 'number' }]
				},
				limit: { type: 'number', description: 'Maximum results per page' }
			},
			required: ['locationId']
		}
	},
	{
		name: 'get_locations',
		description: 'Get a list of all available in-game locations (countries and regions).',
		inputSchema: {
			type: 'object',
			properties: {
				limit: { type: 'number', description: 'Maximum results per page' }
			}
		}
	},
	{
		name: 'get_war_leagues',
		description: 'Get a list of all Clan War League tiers.',
		inputSchema: { type: 'object', properties: {} }
	},
	{
		name: 'get_league_tiers',
		description: 'Get a list of all trophy league tiers.',
		inputSchema: { type: 'object', properties: {} }
	},
	{
		name: 'get_capital_leagues',
		description: 'Get a list of all Clan Capital league tiers.',
		inputSchema: { type: 'object', properties: {} }
	},
	{
		name: 'get_builder_base_leagues',
		description: 'Get a list of all Builder Base league tiers.',
		inputSchema: { type: 'object', properties: {} }
	},
	{
		name: 'get_league_seasons',
		description: 'Get the available Legend League season IDs.',
		inputSchema: {
			type: 'object',
			properties: {
				limit: { type: 'number', description: 'Maximum results per page' }
			}
		}
	},
	{
		name: 'get_season_rankings',
		description: 'Get player rankings for a specific Legend League season.',
		inputSchema: {
			type: 'object',
			properties: {
				seasonId: { type: 'string', description: 'Season ID (e.g. "2024-06")' },
				limit: { type: 'number', description: 'Maximum results per page' }
			},
			required: ['seasonId']
		}
	},
	{
		name: 'get_gold_pass_season',
		description: 'Get information about the current Gold Pass season.',
		inputSchema: { type: 'object', properties: {} }
	},
	{
		name: 'get_clan_labels',
		description: 'Get the list of all available clan labels.',
		inputSchema: { type: 'object', properties: {} }
	},
	{
		name: 'get_player_labels',
		description: 'Get the list of all available player labels.',
		inputSchema: { type: 'object', properties: {} }
	},
	{
		name: 'get_battle_log',
		description: "Get a player's recent attack and defense battle log.",
		inputSchema: {
			type: 'object',
			properties: {
				playerTag: { type: 'string', description: 'The player tag' }
			},
			required: ['playerTag']
		}
	},
	{
		name: 'get_league_history',
		description: "Get a player's Legend League season history.",
		inputSchema: {
			type: 'object',
			properties: {
				playerTag: { type: 'string', description: 'The player tag' }
			},
			required: ['playerTag']
		}
	}
];

// ─── Server Setup ─────────────────────────────────────────────────────────────

const server = new Server(
	{
		name: 'clashofclans',
		version: '1.0.0'
	},
	{
		capabilities: { tools: {} }
	}
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
	const { name, arguments: args = {} } = request.params;
	const params = args as Record<string, unknown>;

	try {
		ensureClient();

		switch (name) {
			case 'get_clan': {
				const result = await client.getClan(requireString(params, 'clanTag'));
				return mcpResult(result);
			}

			case 'search_clans': {
				const query: Record<string, unknown> = {};
				for (const key of ['name', 'warFrequency', 'locationId', 'labelIds']) {
					const v = optionalString(params, key);
					if (v) query[key] = v;
				}
				for (const key of ['minMembers', 'maxMembers', 'minClanPoints', 'minClanLevel', 'limit']) {
					const v = optionalNumber(params, key);
					if (v !== undefined) query[key] = v;
				}
				const result = await client.getClans(query);
				return mcpResult(result);
			}

			case 'get_clan_members': {
				const result = await client.getClanMembers(requireString(params, 'clanTag'), searchOptions(params));
				return mcpResult(result);
			}

			case 'get_clan_war_log': {
				const result = await client.getClanWarLog(requireString(params, 'clanTag'), searchOptions(params));
				return mcpResult(result);
			}

			case 'get_clan_war': {
				const result = await client.getClanWar(requireString(params, 'clanTag'));
				return mcpResult(result);
			}

			case 'get_current_war': {
				const clanTag = requireString(params, 'clanTag');
				const round = optionalString(params, 'round') as 'PREVIOUS_ROUND' | 'CURRENT_ROUND' | 'NEXT_ROUND' | undefined;
				const result = await client.getCurrentWar(round ? { clanTag, round } : clanTag);
				return mcpResult(result);
			}

			case 'get_clan_war_league_group': {
				const result = await client.getClanWarLeagueGroup(requireString(params, 'clanTag'));
				return mcpResult(result);
			}

			case 'get_league_wars': {
				const result = await client.getLeagueWars(requireString(params, 'clanTag'));
				return mcpResult(result);
			}

			case 'get_capital_raid_seasons': {
				const result = await client.getCapitalRaidSeasons(requireString(params, 'clanTag'), searchOptions(params));
				return mcpResult(result);
			}

			case 'get_player': {
				const result = await client.getPlayer(requireString(params, 'playerTag'));
				return mcpResult(result);
			}

			case 'get_players': {
				const tags = params['playerTags'];
				if (!Array.isArray(tags) || tags.length === 0) {
					throw new McpError(ErrorCode.InvalidParams, '"playerTags" must be a non-empty array of strings');
				}
				const result = await client.getPlayers(tags as string[]);
				return mcpResult(result);
			}

			case 'verify_player_token': {
				const verified = await client.verifyPlayerToken(requireString(params, 'playerTag'), requireString(params, 'token'));
				return mcpResult({ verified });
			}

			case 'get_player_ranks': {
				const locationId = params['locationId'] === 'global' ? 'global' : (params['locationId'] as number);
				const result = await client.getPlayerRanks(locationId, { limit: optionalNumber(params, 'limit') });
				return mcpResult(result);
			}

			case 'get_clan_ranks': {
				const locationId = params['locationId'] === 'global' ? 'global' : (params['locationId'] as number);
				const result = await client.getClanRanks(locationId, { limit: optionalNumber(params, 'limit') });
				return mcpResult(result);
			}

			case 'get_builder_base_player_ranks': {
				const locationId = params['locationId'] === 'global' ? 'global' : (params['locationId'] as number);
				const result = await client.getBuilderBasePlayerRanks(locationId, { limit: optionalNumber(params, 'limit') });
				return mcpResult(result);
			}

			case 'get_builder_base_clan_ranks': {
				const locationId = params['locationId'] === 'global' ? 'global' : (params['locationId'] as number);
				const result = await client.getBuilderBaseClanRanks(locationId, { limit: optionalNumber(params, 'limit') });
				return mcpResult(result);
			}

			case 'get_clan_capital_ranks': {
				const locationId = params['locationId'] === 'global' ? 'global' : (params['locationId'] as number);
				const result = await client.getClanCapitalRanks(locationId, { limit: optionalNumber(params, 'limit') });
				return mcpResult(result);
			}

			case 'get_locations': {
				const result = await client.getLocations({ limit: optionalNumber(params, 'limit') });
				return mcpResult(result);
			}

			case 'get_war_leagues': {
				const result = await client.getWarLeagues();
				return mcpResult(result);
			}

			case 'get_league_tiers': {
				const result = await client.getLeaguesTiers();
				return mcpResult(result);
			}

			case 'get_capital_leagues': {
				const result = await client.getCapitalLeagues();
				return mcpResult(result);
			}

			case 'get_builder_base_leagues': {
				const result = await client.getBuilderBaseLeagues();
				return mcpResult(result);
			}

			case 'get_league_seasons': {
				const result = await client.getLeagueSeasons({ limit: optionalNumber(params, 'limit') });
				return mcpResult(result);
			}

			case 'get_season_rankings': {
				const result = await client.getSeasonRankings(requireString(params, 'seasonId'), {
					limit: optionalNumber(params, 'limit')
				});
				return mcpResult(result);
			}

			case 'get_gold_pass_season': {
				const result = await client.getGoldPassSeason();
				return mcpResult(result);
			}

			case 'get_clan_labels': {
				const result = await client.getClanLabels();
				return mcpResult(result);
			}

			case 'get_player_labels': {
				const result = await client.getPlayerLabels();
				return mcpResult(result);
			}

			case 'get_battle_log': {
				const result = await client.getBattleLog(requireString(params, 'playerTag'));
				return mcpResult(result);
			}

			case 'get_league_history': {
				const result = await client.getLeagueHistory(requireString(params, 'playerTag'));
				return mcpResult(result);
			}

			default:
				throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
		}
	} catch (err) {
		if (err instanceof McpError) throw err;
		const message = err instanceof Error ? err.message : String(err);
		throw new McpError(ErrorCode.InternalError, message);
	}
});

// ─── Entry Point ──────────────────────────────────────────────────────────────

async function main() {
	const transport = new StdioServerTransport();
	await server.connect(transport);
}

main().catch((err) => {
	console.error(err instanceof Error ? err.message : err);
	process.exit(1);
});
