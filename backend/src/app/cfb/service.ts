import { cfb } from '../../config/database';
import { Game, Team } from './types';

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
  const games = await cfb
    .selectFrom('scoreboard')
    .innerJoin('game', 'game.id', 'scoreboard.id')
    .where((eb) =>
      eb.or([
        eb('scoreboard.homeClassification', '=', 'fbs'),
        eb('scoreboard.awayClassification', '=', 'fbs'),
      ]),
    )
    .orderBy('scoreboard.startDate')
    .select([
      'scoreboard.id as id',
      'game.week as week',
      'game.seasonType as seasonType',
      'scoreboard.homeId as homeId',
      'scoreboard.homeLocation as homeLocation',
      'scoreboard.homeTeam as homeTeam',
      'scoreboard.homeConference as homeConference',
      'scoreboard.homeConferenceAbbreviation as homeConferenceAbbreviation',
      'scoreboard.awayId as awayId',
      'scoreboard.awayLocation as awayLocation',
      'scoreboard.awayTeam as awayTeam',
      'scoreboard.awayConference as awayConference',
      'scoreboard.awayConferenceAbbreviation as awayConferenceAbbreviation',
      'scoreboard.startDate as startDate',
    ])
    .where('scoreboard.status', '<>', 'completed')
    .execute();

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
