/**
 * This file was generated by kysely-codegen.
 * Please do not edit it manually.
 */

import type { ColumnType } from 'kysely';

export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>;

export type Int8 = ColumnType<string, bigint | number | string>;

export interface GuildChannel {
  broadcastAllFbs: Generated<boolean>;
  channelId: Int8;
  closeGameAlerts: Generated<boolean>;
  conferences: Generated<string[]>;
  guildId: Int8;
  id: Generated<number>;
  teams: Generated<number[]>;
}

export interface GuildGame {
  gameId: Int8;
  guildId: Int8;
  id: Generated<Int8>;
}

export interface DB {
  guildChannel: GuildChannel;
  guildGame: GuildGame;
}