import { Request, Response } from 'express';
import { useDiscord } from './service';

export const useDiscordController = async () => {
  const discord = await useDiscord();

  const processGetGuildInfo = async (request: Request, response: Response) => {
    if (
      !request.isAuthenticated ||
      !request.user?.guilds.find((g) => g.id == request.params.id)
    ) {
      response.status(403).send('Forbidden');
      return;
    }

    const guildInfo = await discord.getGuildInfo(request.params.id);
    response.status(200).send(guildInfo);
  };

  const processGetGuildChannels = async (
    request: Request,
    response: Response,
  ) => {
    if (
      !request.isAuthenticated ||
      !request.user?.guilds.find((g) => g.id == request.params.id)
    ) {
      response.status(403).send('Forbidden');
      return;
    }

    const channels = await discord.getGuildChannels(request.params.id);
    response.status(200).send(channels);
  };

  const processGetUserGuilds = async (request: Request, response: Response) => {
    if (!request.isAuthenticated || !request.user) {
      response.status(403).send('Forbidden');
      return;
    }

    const guilds = await discord.getUserGuilds(request.user);
    response.status(200).send(guilds);
  };

  const processUpdateGuildChannel = async (
    request: Request,
    response: Response,
  ) => {
    if (
      !request.isAuthenticated ||
      !request.user?.guilds.find((g) => g.id == request.params.id)
    ) {
      response.status(403).send('Forbidden');
      return;
    }

    if (
      request.body.channelId === undefined ||
      typeof request.body.channelId !== 'string'
    ) {
      response.status(400).send('Bad Request');
      return;
    }

    await discord.updateGuildBroadcastChannel(
      request.params.id,
      request.body.channelId,
    );
    response.sendStatus(200);
  };

  const processGuildToggleAllFbs = async (
    request: Request,
    response: Response,
  ) => {
    if (
      !request.isAuthenticated ||
      !request.user?.guilds.find((g) => g.id == request.params.id)
    ) {
      response.status(403).send('Forbidden');
      return;
    }

    if (
      request.body.broadcastAllFbs === undefined ||
      typeof request.body.broadcastAllFbs !== 'boolean'
    ) {
      response.status(400).send('Bad Request');
      return;
    }

    await discord.updateGuildAllFbsToggle(
      request.params.id,
      request.body.broadcastAllFbs,
    );
    response.sendStatus(200);
  };

  const processGuildToggleCloseGamesAndUpsets = async (
    request: Request,
    response: Response,
  ) => {
    if (
      !request.isAuthenticated ||
      !request.user?.guilds.find((g) => g.id == request.params.id)
    ) {
      response.status(403).send('Forbidden');
      return;
    }

    if (
      request.body.closeGameAlerts === undefined ||
      typeof request.body.closeGameAlerts !== 'boolean'
    ) {
      response.status(400).send('Bad Request');
      return;
    }

    await discord.updateGuildCloseGameAlerts(
      request.params.id,
      request.body.closeGameAlerts,
    );
    response.sendStatus(200);
  };

  const processUpdateGuildConferences = async (
    request: Request,
    response: Response,
  ) => {
    if (
      !request.isAuthenticated ||
      !request.user?.guilds.find((g) => g.id == request.params.id)
    ) {
      response.status(403).send('Forbidden');
      return;
    }
    if (
      request.body.guildConferences === undefined ||
      request.body.guildConferences.filter((c: any) => typeof c !== 'string')
        .length > 0
    ) {
      response.status(400).send('Bad Request');
      return;
    }

    await discord.updateGuildConferences(
      request.params.id,
      request.body.guildConferences,
    );
    response.sendStatus(200);
  };

  const processUpdateGuildTeams = async (
    request: Request,
    response: Response,
  ) => {
    if (
      !request.isAuthenticated ||
      !request.user?.guilds.find((g) => g.id == request.params.id)
    ) {
      response.status(403).send('Forbidden');
      return;
    }

    if (
      request.body.guildTeams === undefined ||
      request.body.guildTeams.filter((c: any) => typeof c !== 'number').length >
        0
    ) {
      response.status(400).send('Bad Request');
      return;
    }

    await discord.updateGuildTeams(request.params.id, request.body.guildTeams);
    response.sendStatus(200);
  };

  const processAddGuildGame = async (request: Request, response: Response) => {
    if (
      !request.isAuthenticated ||
      !request.user?.guilds.find((g) => g.id == request.params.id)
    ) {
      response.status(403).send('Forbidden');
      return;
    }

    if (
      request.body.gameId === undefined ||
      typeof request.body.gameId !== 'number'
    ) {
      response.status(400).send('Bad Request');
      return;
    }

    await discord.addGuildGame(request.params.id, request.body.gameId);
    response.sendStatus(200);
  };

  const processRemoveGuildGame = async (
    request: Request,
    response: Response,
  ) => {
    if (
      !request.isAuthenticated ||
      !request.user?.guilds.find((g) => g.id == request.params.id)
    ) {
      response.status(403).send('Forbidden');
      return;
    }

    if (
      request.body.gameId === undefined ||
      typeof request.body.gameId !== 'number'
    ) {
      response.status(400).send('Bad Request');
      return;
    }

    await discord.removeGuildGame(request.params.id, request.body.gameId);
    response.sendStatus(200);
  };

  return {
    processGetGuildInfo,
    processGetGuildChannels,
    processGetUserGuilds,
    processUpdateGuildChannel,
    processGuildToggleAllFbs,
    processGuildToggleCloseGamesAndUpsets,
    processUpdateGuildConferences,
    processUpdateGuildTeams,
    processAddGuildGame,
    processRemoveGuildGame,
  };
};
