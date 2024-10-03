import { Application } from 'express';
import { useDiscordController } from './controller';

export default async (app: Application) => {
  const discordController = await useDiscordController();

  app.get('/api/discord/guilds/:id', discordController.processGetGuildInfo);
  app.get(
    '/api/discord/guilds/:id/channels',
    discordController.processGetGuildChannels,
  );
  app.get('/api/discord/guilds', discordController.processGetUserGuilds);

  app.post(
    '/api/discord/guilds/:id/channel',
    discordController.processUpdateGuildChannel,
  );
  app.post(
    '/api/discord/guilds/:id/broadcastAllFbs',
    discordController.processGuildToggleAllFbs,
  );
  app.post(
    '/api/discord/guilds/:id/closeGameAlerts',
    discordController.processGuildToggleCloseGamesAndUpsets,
  );
  app.post(
    '/api/discord/guilds/:id/conferences',
    discordController.processUpdateGuildConferences,
  );
  app.post(
    '/api/discord/guilds/:id/teams',
    discordController.processUpdateGuildTeams,
  );
  app.post(
    '/api/discord/guilds/:id/games/add',
    discordController.processAddGuildGame,
  );
  app.post(
    '/api/discord/guilds/:id/games/remove',
    discordController.processRemoveGuildGame,
  );
};
