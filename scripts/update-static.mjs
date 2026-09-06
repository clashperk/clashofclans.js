#!/usr/bin/env node
// Syncs the static game data shipped with the library from clash-asset-library
// (https://github.com/clashperk/clash-asset-library):
//
//   node scripts/update-static.mjs                                  # from https://assets.clashperk.com
//   node scripts/update-static.mjs ../clash-asset-library/assets    # from a local checkout
//   node scripts/update-static.mjs --dist                           # re-minify dist/util/*.json after tsc
//
// Writes `src/util/units.json` and `src/util/buildings.json` (the subset of `raw.json#buildings`
// needed to derive unlock requirements, see StaticData.ts), both minified. tsc re-prints imported
// JSON modules with 4-space indentation, so the build runs `--dist` to strip that again.

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Buildings whose level gates when a unit unlocks, plus the two halls for their level counts.
const BUILDINGS = [
	'Town Hall',
	'Builder Hall',
	'Barracks',
	'Dark Barracks',
	'Spell Factory',
	'Dark Spell Factory',
	'Workshop',
	'Pet House',
	'Blacksmith',
	'Hero Hall',
	'Builder Barracks'
];

const writeJson = (path, data) => writeFile(path, JSON.stringify(data));

async function minifyDist() {
	const dir = fileURLToPath(new URL('../dist/util/', import.meta.url));
	for (const file of await readdir(dir)) {
		if (!file.endsWith('.json')) continue;
		const path = join(dir, file);
		const raw = await readFile(path, 'utf8');
		await writeJson(path, JSON.parse(raw));
		console.log(
			`Minified ${file} (${(raw.length / 1024).toFixed(0)} KB -> ${(JSON.stringify(JSON.parse(raw)).length / 1024).toFixed(0)} KB)`
		);
	}
}

async function update(source) {
	const outDir = fileURLToPath(new URL('../src/util/', import.meta.url));

	const load = async (file) => {
		if (/^https?:\/\//.test(source)) {
			const res = await fetch(new URL(file, source.endsWith('/') ? source : `${source}/`));
			if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${res.url}`);
			return res.json();
		}
		return JSON.parse(await readFile(join(resolve(source), file), 'utf8'));
	};

	const [units, { fingerprint, buildings }] = await Promise.all([load('units.json'), load('raw.json')]);

	const missing = BUILDINGS.filter((name) => !buildings.some((building) => building.name === name));
	if (missing.length) throw new Error(`Buildings missing from raw.json: ${missing.join(', ')}`);

	const subset = buildings
		.filter((building) => BUILDINGS.includes(building.name))
		.map(({ id, name, tid, village_type, upgrade_resource, levels }) => ({
			id,
			name,
			tid,
			village_type,
			upgrade_resource,
			levels: levels.map(({ level, required_townhall, build_cost, build_time }) => ({
				level,
				required_townhall,
				build_cost,
				build_time
			}))
		}));

	await writeJson(join(outDir, 'units.json'), units);
	await writeJson(join(outDir, 'buildings.json'), { fingerprint, buildings: subset });

	console.log(`Synced fingerprint ${units.fingerprint} (${subset.length} buildings) from ${source}`);
}

if (process.argv.includes('--dist')) await minifyDist();
else await update(process.argv[2] ?? 'https://assets.clashperk.com');
