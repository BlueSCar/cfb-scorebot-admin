import { cfb } from '../../config/database';
import { Game, Team } from './types';
import { getSelectableGamesQuery } from './games';

export const getTeamsList = async (): Promise<Team[]> => {
  const teams = await cfb
    .selectFrom('currentConferences')
    .where('classification', '=', 'fbs')
    .select([
      'teamId as id',
      'school as team',
      'conference',
      'abbreviation as conferenceAbbreviation',
    ])
    .orderBy('school')
    .execute();

  return teams.map(
    (t): Team => ({
      id: t.id ?? 0,
      team: t.team ?? '',
      conference: t.conference ?? '',
      conferenceAbbreviation: t.conferenceAbbreviation ?? '',
    }),
  );
};

export const getGamesList = async (): Promise<Game[]> => {
  const games = await getSelectableGamesQuery(cfb).execute();

  return games.map(
    (g): Game => ({
      id: g.id ?? 0,
      week: g.week ?? 0,
      seasonType: g.seasonType ?? '',
      homeId: g.homeId ?? 0,
      homeLocation: g.homeLocation ?? '',
      homeTeam: g.homeTeam ?? '',
      homeConference: g.homeConference ?? '',
      homeConferenceAbbreviation: g.homeConferenceAbbreviation ?? '',
      awayId: g.awayId ?? 0,
      awayLocation: g.awayLocation ?? '',
      awayTeam: g.awayTeam ?? '',
      awayConference: g.awayConference ?? '',
      awayConferenceAbbreviation: g.awayConferenceAbbreviation ?? '',
      startDate: g.startDate ?? new Date(),
    }),
  );
};

export const getSelectableGameIds = async (): Promise<string[]> => {
  const games = await getSelectableGamesQuery(cfb)
    .clearSelect()
    .clearOrderBy()
    .select('game.id')
    .execute();

  return games.map((game) => String(game.id));
};
