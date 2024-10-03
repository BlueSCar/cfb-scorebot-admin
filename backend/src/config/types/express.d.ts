export interface ExpressUser {
  name: string;
  email: string;
  picture: string;
  sub: string;
  accessToken: string;
  guilds: Guild[];
  iat: number;
  exp: number;
  jti: string;
}

export interface Guild {
  id: string;
  name: string;
}
