import { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Profile {
    sub?: string;
    name?: string;
    email?: string;
    image?: string;
    guilds?: Array<{ id: string; name: string }>;
  }

  interface User extends DefaultUser {}
  interface Session extends DefaultSession {}
}
