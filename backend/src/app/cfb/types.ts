export interface Team {
  id: number;
  team: string;
  conference: string;
  conferenceAbbreviation: string;
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
