import { Clan, ClanWar, Player } from '../struct';
import { ClientOptions } from '../types';
import { PollingEvents } from '../util/Constants';
import { Client } from './Client';
import { PollingEventManager } from './EventManager';

/**
 * Represents Clash of Clans Polling Client.
 * ```js
 * const { PollingClient } = require('clashofclans.js');
 * const client = new PollingClient({ keys: ['***'] });
 * ```
 */
export class PollingClient extends Client {
	public pollingEvents: PollingEventManager;

	public constructor(options?: ClientOptions) {
		super(options);

		this.pollingEvents = new PollingEventManager(this);
	}

	// #region typings
	/* eslint-disable @typescript-eslint/prefer-readonly */

	/**
	 * Emits when a new season starts.
	 *
	 * **Parameters**
	 *
	 * | Name |   Type   | Description           |
	 * | :--: | :------: | :-------------------: |
	 * | `id` | `string` | Id of the new season. |
	 * @public
	 * @event
	 */
	private static newSeasonStart: string;

	/**
	 * Emits when maintenance break starts in the API.
	 * @public
	 * @event
	 */
	private static maintenanceStart: string;

	/**
	 * Emits when maintenance break ends in the API.
	 *
	 * **Parameters**
	 *
	 * |    Name    |   Type   |                    Description                     |
	 * | :--------: | :------: | :------------------------------------------------: |
	 * | `duration` | `number` | Duration of the maintenance break in milliseconds. |
	 * @public
	 * @event
	 */
	private static maintenanceEnd: string;

	/* eslint-disable @typescript-eslint/prefer-readonly */

	/** @internal */
	public on<K extends keyof ClientPollingEvents>(event: K, listeners: (...args: ClientPollingEvents[K]) => void): this;
	/** @internal */
	public on<S extends keyof CustomEvents>(
		event: Exclude<S, keyof ClientPollingEvents>,
		listeners: (...args: CustomEvents[S]) => void
	): this;
	/** @internal */ // @ts-expect-error
	public on<S extends string | symbol>(event: Exclude<S, keyof ClientPollingEvents>, listeners: (...args: any[]) => void): this;

	/** @internal */
	public once<K extends keyof ClientPollingEvents>(event: K, listeners: (...args: ClientPollingEvents[K]) => void): this;
	/** @internal */
	public once<S extends keyof CustomEvents>(
		event: Exclude<S, keyof ClientPollingEvents>,
		listeners: (...args: CustomEvents[S]) => void
	): this;
	/** @internal */ // @ts-expect-error
	public once<S extends string | symbol>(event: Exclude<S, keyof ClientPollingEvents>, listeners: (...args: any[]) => void): this;

	/** @internal */
	public emit<K extends keyof ClientPollingEvents>(event: K, ...args: ClientPollingEvents[K]): boolean;
	/** @internal */
	public emit<S extends keyof CustomEvents>(event: Exclude<S, keyof ClientPollingEvents>, ...args: CustomEvents[S]): this;
	/** @internal */ // @ts-expect-error
	public emit<S extends string | symbol>(event: Exclude<S, keyof ClientPollingEvents>, ...args: any[]): boolean;
	// #endregion typings
}

interface ClientPollingEvents {
	[PollingEvents.NewSeasonStart]: [id: string];
	[PollingEvents.MaintenanceStart]: [];
	[PollingEvents.MaintenanceEnd]: [duration: number];
	[PollingEvents.ClanLoopStart]: [];
	[PollingEvents.ClanLoopEnd]: [];
	[PollingEvents.PlayerLoopStart]: [];
	[PollingEvents.PlayerLoopEnd]: [];
	[PollingEvents.WarLoopStart]: [];
	[PollingEvents.WarLoopEnd]: [];
	[PollingEvents.Error]: [error: unknown];
	[PollingEvents.Debug]: [path: string, status: string, message: string];
}

// TypeScript 4.5 now can narrow values that have template string types, and also recognizes template string types as discriminants.
interface CustomEvents {
	[key: `clan${string}`]: [oldClan: Clan, newClan: Clan];
	[key: `war${string}`]: [oldWar: ClanWar, newWar: ClanWar];
	[key: `player${string}`]: [oldPlayer: Player, newPlayer: Player];
}
