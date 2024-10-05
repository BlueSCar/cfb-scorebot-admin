import DiscordProvider from 'next-auth/providers/discord';
import { NuxtAuthHandler } from '#auth';

const runtimeConfig = useRuntimeConfig();

export default NuxtAuthHandler({
  secret: runtimeConfig.authSecret,
  jwt: {
    maxAge: 60 * 60 * 24,
  },
  providers: [
    // @ts-expect-error
    DiscordProvider.default({
      clientId: runtimeConfig.discordClientId,
      clientSecret: runtimeConfig.discordClientSecret,
      userinfo: {
        // @ts-ignore
        async request(context) {
          const profile = await context.client.userinfo(
            context.tokens.access_token ?? '',
            {
              params: {
                scope: 'identify email guilds',
              },
            },
          );

          const guilds = await $fetch(
            `${context.provider.userinfo.url}/guilds`,
            {
              headers: {
                Authorization: `Bearer ${context.tokens.access_token}`,
              },
            },
          );

          // @ts-ignore
          profile.guilds = guilds
            // @ts-ignore
            .filter((g) => (g.permissions & 0x00000008) === 0x00000008)
            // @ts-ignore
            .map((g) => ({ id: g.id, name: g.name }));

          return profile;
        },
      },
      authorization: {
        params: {
          scope: 'email identify guilds',
        },
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user, account, profile }) => {
      if (account) {
        token.accessToken = account.access_token;
      }

      // @ts-ignore
      if (profile?.guilds) {
        // @ts-ignore
        token.guilds = profile.guilds;
      }

      return token;
    },
    session: async ({ session, token }) => {
      return {
        ...session,
        accessToken: token.accessToken,
        // @ts-ignore
        guilds: token.guilds,
      };
    },
  },
});
