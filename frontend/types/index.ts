export interface Guild {
  id: string;
  name: string;
}

export interface GuildChannel {
  id: string;
  name: string;
}

export interface BroadcastConfiguration {
  allFbsGames: boolean;
  closeGames: boolean;
  conferences: string[];
  teams: Team[];
  selectedGames: number[];
}

export interface Conference {
  name: string;
  abbreviation: string;
}

export interface Team {
  id: number;
  team: string;
}

export interface Game {
  id: number;
  homeId: number;
  homeLocation: string;
  homeTeam: string;
  homeConference: string;
  homeConferenceAbbreviation: string;
  awayId: number;
  awayLocation: string;
  awayTeam: string;
  awayConference: string;
  awayConferenceAbbreviation: string;
  startDate: Date;
}

export interface GuildInfo {
  id: string;
  name: string;
  selectedChannelId: string;
  broadcastAllFbs: boolean;
  closeGameAlerts: boolean;
  conferences: string[];
  teams: number[];
  channels: GuildChannel[];
  gameIds: number[];
}
