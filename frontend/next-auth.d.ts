declare module 'next-auth/profile' {
  interface Profile {
    sub?: string;
    name?: string;
    email?: string;
    image?: string;
    guilds?: Array<{ id: string; name: string }>;
  }
}
