import { Request, Response } from 'express';
import { getGamesList, getTeamsList } from './service';

export const processTeamListRequest = async (
  // @ts-ignore
  request: Request,
  response: Response,
) => {
  try {
    const teams = await getTeamsList();
    response.status(200).send(teams);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      response.status(500).send({ error });
    } else {
      response.status(500).send({ error: 'Internal server error' });
    }
  }
};

export const processGameListRequest = async (
  // @ts-ignore
  request: Request,
  response: Response,
) => {
  try {
    const games = await getGamesList();
    response.status(200).send(games);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      response.status(500).send({ error });
    } else {
      response.status(500).send({ error: 'Internal server error' });
    }
  }
};
