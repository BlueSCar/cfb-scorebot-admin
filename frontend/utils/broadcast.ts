import type { BroadcastConfiguration, Game, Team } from '~/types';

export type CoverageKind =
  | 'all-fbs'
  | 'conference'
  | 'team'
  | 'manual'
  | 'none';

export interface GameCoverage {
  kind: CoverageKind;
  selected: boolean;
  disabled: boolean;
  label: string;
  detail: string;
}

export const teamLogoUrl = (id: number): string =>
  `https://cdn.collegefootballdata.com/logos/64/${id}.png`;

export const getGameCoverage = (
  game: Game,
  broadcastConfig: BroadcastConfiguration,
): GameCoverage => {
  if (broadcastConfig.allFbsGames) {
    return {
      kind: 'all-fbs',
      selected: true,
      disabled: true,
      label: 'All FBS',
      detail: 'Covered by All FBS games',
    };
  }

  const conference = broadcastConfig.conferences.find(
    (selectedConference) =>
      selectedConference === game.homeConferenceAbbreviation ||
      selectedConference === game.awayConferenceAbbreviation,
  );

  if (conference) {
    return {
      kind: 'conference',
      selected: true,
      disabled: true,
      label: conference,
      detail: `Covered by ${conference}`,
    };
  }

  const team = broadcastConfig.teams.find(
    (selectedTeam) =>
      selectedTeam.id === game.homeId || selectedTeam.id === game.awayId,
  );

  if (team) {
    return {
      kind: 'team',
      selected: true,
      disabled: true,
      label: team.team,
      detail: `Covered by ${team.team}`,
    };
  }

  if (broadcastConfig.selectedGames.includes(game.id)) {
    return {
      kind: 'manual',
      selected: true,
      disabled: false,
      label: 'Manual',
      detail: 'Manual game pick',
    };
  }

  return {
    kind: 'none',
    selected: false,
    disabled: false,
    label: 'Available',
    detail: 'Not tracked',
  };
};

export const countTrackedGames = (
  games: Game[],
  broadcastConfig: BroadcastConfiguration,
): number =>
  games.filter((game) => getGameCoverage(game, broadcastConfig).selected)
    .length;

export const countAutomaticGames = (
  games: Game[],
  broadcastConfig: BroadcastConfiguration,
): number =>
  games.filter((game) => {
    const coverage = getGameCoverage(game, broadcastConfig);

    return coverage.selected && coverage.disabled;
  }).length;

export const getSelectedTeamNames = (teams: Team[]): string =>
  teams.map((team) => team.team).join(', ');
