import { ChannelType, Client, GatewayIntentBits, Snowflake } from 'discord.js';
import { ExpressUser } from 'src/config/types/express';

import { cfb, scores } from '../../config/database';

const token = process.env.DISCORD_TOKEN ?? '';

export const useDiscord = async () => {
  const client = new Client({
    intents: [GatewayIntentBits.Guilds],
  });

  await client.login(token);

  const getGuildInfo = async (id: Snowflake) => {
    const guild = await client.guilds.fetch(id);
    if (!guild) {
      throw new Error('Guild not found');
    }

    const guildChannels = guild.channels.cache
      .filter((c) => c.type === ChannelType.GuildText || ChannelType.GuildForum)
      .map((c) => ({
        id: c.id,
        name: c.name,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    const currentGameIds = await cfb
      .selectFrom('scoreboard')
      .select('id')
      .execute();

    const guildInfo = await scores
      .selectFrom('guildChannel')
      .where('guildId', '=', id)
      .select([
        'guildId',
        'channelId',
        'broadcastAllFbs',
        'closeGameAlerts',
        'conferences',
        'teams',
      ])
      .executeTakeFirst();

    const guildGames = await scores
      .selectFrom('guildGame')
      .where('guildId', '=', id)
      .where(
        'gameId',
        'in',
        // @ts-ignore
        currentGameIds.map((g) => g.id ?? 0),
      )
      .select(['guildId', 'gameId'])
      .execute();

    return {
      id: guild.id,
      name: guild.name,
      selectedChannelId: guildInfo?.channelId,
      broadcastAllFbs: guildInfo?.broadcastAllFbs ?? false,
      closeGameAlerts: guildInfo?.closeGameAlerts ?? false,
      conferences: guildInfo?.conferences ?? [],
      teams: guildInfo?.teams ?? [],
      channels: guildChannels,
      gameIds: guildGames.map((gg) => Number(gg.gameId)),
    };
  };

  const getGuildChannels = async (id: Snowflake) => {
    const guild = await client.guilds.fetch(id);
    if (!guild) {
      return [];
    }

    return guild.channels.cache
      .filter((c) => c.type === ChannelType.GuildText || ChannelType.GuildForum)
      .map((c) => ({
        id: c.id,
        name: c.name,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  const getUserGuilds = async (user: ExpressUser) => {
    const userGuildIds = user.guilds.map((g) => g.id);
    const currentGameIds = await cfb
      .selectFrom('scoreboard')
      .select('id')
      .execute();

    const guildChannels = await scores
      .selectFrom('guildChannel')
      .where('guildId', 'in', userGuildIds)
      .select([
        'guildId',
        'channelId',
        'broadcastAllFbs',
        'closeGameAlerts',
        'conferences',
        'teams',
      ])
      .execute();

    const guildGames = await scores
      .selectFrom('guildGame')
      .where('guildId', 'in', userGuildIds)
      .where(
        'gameId',
        'in',
        // @ts-ignore
        currentGameIds.map((g) => g.id ?? 0),
      )
      .select(['guildId', 'gameId'])
      .execute();

    const responseGuilds = [];

    for (const g of guildChannels) {
      const discordGuild = await client.guilds.fetch(g.guildId);
      if (!discordGuild) {
        continue;
      }

      responseGuilds.push({
        id: discordGuild.id,
        name: discordGuild.name,
        selectedChannelId: g.channelId,
        broadcastAllFbs: g.broadcastAllFbs,
        closeGameAlerts: g.closeGameAlerts,
        conferences: g.conferences,
        teams: g.teams,
        channels: discordGuild.channels.cache
          .filter(
            (c) =>
              c.type === ChannelType.GuildText ||
              c.type === ChannelType.GuildForum,
          )
          .map((c) => ({
            id: c.id,
            name: c.name,
          }))
          .sort((a, b) => a.name.localeCompare(b.name)),
        gameIds: guildGames
          .filter((gg) => gg.guildId === g.guildId)
          .map((gg) => gg.gameId),
      });
    }

    return responseGuilds;
  };

  const updateGuildBroadcastChannel = async (
    guildId: Snowflake,
    channelId: Snowflake,
  ) => {
    const guild = await client.guilds.fetch(guildId);
    if (!guild) {
      throw new Error('Guild not found');
    }

    const guildChannels = guild.channels.cache
      .filter((c) => c.type === ChannelType.GuildText || ChannelType.GuildForum)
      .map((c) => ({
        id: c.id,
        name: c.name,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    if (!guildChannels.find((c) => c.id === channelId)) {
      throw new Error('Channel not found');
    }

    const guildRecord = await scores
      .selectFrom('guildChannel')
      .where('guildId', '=', guildId)
      .executeTakeFirst();

    if (guildRecord) {
      await scores
        .updateTable('guildChannel')
        .set('channelId', channelId)
        .where('guildId', '=', guildId)
        .execute();
    } else {
      await scores
        .insertInto('guildChannel')
        .values({
          guildId,
          channelId,
          broadcastAllFbs: false,
          closeGameAlerts: false,
          conferences: [],
          teams: [],
        })
        .execute();
    }
  };

  const updateGuildAllFbsToggle = async (
    guildId: Snowflake,
    value: boolean,
  ) => {
    await scores
      .updateTable('guildChannel')
      .set('broadcastAllFbs', value)
      .where('guildId', '=', guildId)
      .execute();
  };

  const updateGuildCloseGameAlerts = async (
    guildId: Snowflake,
    value: boolean,
  ) => {
    await scores
      .updateTable('guildChannel')
      .set('closeGameAlerts', value)
      .where('guildId', '=', guildId)
      .execute();
  };

  const updateGuildConferences = async (
    guildId: Snowflake,
    conferences: string[],
  ) => {
    await scores
      .updateTable('guildChannel')
      .set('conferences', conferences)
      .where('guildId', '=', guildId)
      .execute();
  };

  const updateGuildTeams = async (guildId: Snowflake, teams: number[]) => {
    await scores
      .updateTable('guildChannel')
      .set('teams', teams)
      .where('guildId', '=', guildId)
      .execute();
  };

  const addGuildGame = async (guildId: Snowflake, gameId: number) => {
    await scores
      .insertInto('guildGame')
      .values({
        guildId,
        gameId,
      })
      .onConflict((oc) => oc.doNothing())
      .execute();
  };

  const removeGuildGame = async (guildId: Snowflake, gameId: number) => {
    await scores
      .deleteFrom('guildGame')
      .where((eb) =>
        eb.and({
          guildId: String(guildId),
          gameId: String(gameId),
        }),
      )
      .execute();
  };

  return {
    getGuildInfo,
    getGuildChannels,
    getUserGuilds,
    updateGuildBroadcastChannel,
    updateGuildAllFbsToggle,
    updateGuildCloseGameAlerts,
    updateGuildConferences,
    updateGuildTeams,
    addGuildGame,
    removeGuildGame,
  };
};
