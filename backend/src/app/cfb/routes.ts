import { Application } from 'express';
import { processGameListRequest, processTeamListRequest } from './controller';

export default (app: Application) => {
  app.get('/api/teams', processTeamListRequest);
  app.get('/api/games', processGameListRequest);
};
