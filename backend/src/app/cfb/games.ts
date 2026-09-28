import { Kysely } from 'kysely';

import { DB } from '../../config/types/cfb.db';

// Keep the picker and saved guild selections independent of scoreboard rollover.
export const getSelectableGamesQuery = (db: Kysely<DB>, now = new Date()) => {
  const windowEnd = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

  return db
    .selectFrom('game')
    .innerJoin('gameTeam as homeGame', (join) =>
      join
        .onRef('homeGame.gameId', '=', 'game.id')
        .on('homeGame.homeAway', '=', 'home'),
    )
    .innerJoin('team as home', 'home.id', 'homeGame.teamId')
    .innerJoin('gameTeam as awayGame', (join) =>
      join
        .onRef('awayGame.gameId', '=', 'game.id')
        .on('awayGame.homeAway', '=', 'away'),
    )
    .innerJoin('team as away', 'away.id', 'awayGame.teamId')
    .leftJoin('conferenceTeam as homeMembership', (join) =>
      join
        .onRef('homeMembership.teamId', '=', 'home.id')
        .onRef('homeMembership.startYear', '<=', 'game.season')
        .on((eb) =>
          eb.or([
            eb('homeMembership.endYear', 'is', null),
            eb('homeMembership.endYear', '>=', eb.ref('game.season')),
          ]),
        ),
    )
    .leftJoin(
      'conference as homeConference',
      'homeConference.id',
      'homeMembership.conferenceId',
    )
    .leftJoin('conferenceTeam as awayMembership', (join) =>
      join
        .onRef('awayMembership.teamId', '=', 'away.id')
        .onRef('awayMembership.startYear', '<=', 'game.season')
        .on((eb) =>
          eb.or([
            eb('awayMembership.endYear', 'is', null),
            eb('awayMembership.endYear', '>=', eb.ref('game.season')),
          ]),
        ),
    )
    .leftJoin(
      'conference as awayConference',
      'awayConference.id',
      'awayMembership.conferenceId',
    )
    .where((eb) =>
      eb.or([
        eb('homeConference.division', '=', 'fbs'),
        eb('awayConference.division', '=', 'fbs'),
      ]),
    )
    .where((eb) =>
      eb.or([
        eb('game.status', '=', 'in_progress'),
        eb.and([
          eb('game.status', '=', 'scheduled'),
          eb('game.startDate', '>=', now),
          eb('game.startDate', '<', windowEnd),
        ]),
      ]),
    )
    .select([
      'game.id',
      'game.week',
      'game.seasonType',
      'home.id as homeId',
      'home.school as homeLocation',
      'home.displayName as homeTeam',
      'homeConference.name as homeConference',
      'homeConference.abbreviation as homeConferenceAbbreviation',
      'away.id as awayId',
      'away.school as awayLocation',
      'away.displayName as awayTeam',
      'awayConference.name as awayConference',
      'awayConference.abbreviation as awayConferenceAbbreviation',
    ])
    .select((eb) =>
      eb
        .fn<Date>('timezone', [eb.val('UTC'), eb.ref('game.startDate')])
        .as('startDate'),
    )
    .distinct()
    .orderBy('startDate')
    .orderBy('game.id');
};
