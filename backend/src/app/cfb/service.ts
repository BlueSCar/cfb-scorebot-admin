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
    .where((eb) =>
      eb.or([
        eb('homeClassification', '=', 'fbs'),
        eb('awayClassification', '=', 'fbs'),
      ]),
    )
    .orderBy('startDate')
    .select([
      'id',
      'homeId',
      'homeLocation',
      'homeTeam',
      'homeConference',
      'homeConferenceAbbreviation',
      'awayId',
      'awayLocation',
      'awayTeam',
      'awayConference',
      'awayConferenceAbbreviation',
      'startDate',
    ])
    .where('status', '<>', 'completed')
    .execute();

  return games.map(
    (g): Game => ({
      id: g.id ?? 0,
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
