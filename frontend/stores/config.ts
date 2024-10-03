import { defineStore } from 'pinia';
import type { AutoCompleteOptionSelectEvent } from 'primevue/autocomplete';

import type {
  BroadcastConfiguration,
  Conference,
  Game,
  Guild,
  GuildChannel,
  GuildInfo,
  Team,
} from '~/types';

export const useConfigStore = defineStore('configStore', () => {
  const config = useRuntimeConfig();

  let userSession: { guilds: Guild[] } | null = null;
  const getUserSession = async () => {
    if (!userSession) {
      userSession = await $fetch('/api/auth/session');
    }

    return userSession;
  };

  let token: string | null = null;
  const getToken = async () => {
    if (!token) {
      token = await $fetch('/api/auth/token');
    }

    return token;
  };

  const userGuilds = ref<Guild[]>([]);
  const guildChannels = ref<GuildChannel[] | null>(null);
  const selectedGuild = ref<Guild | null>(null);
  const selectedChannel = ref<GuildChannel | null>(null);
  const broadcastConfig = ref<BroadcastConfiguration>({
    allFbsGames: false,
    closeGames: false,
    conferences: [],
    teams: [],
    selectedGames: [],
  });

  const trackedGames = ref<number[]>([]);

  const fetchGuildInfo = async () => {
    const token = await getToken();

    const channelsResponse = await $fetch<GuildInfo>(
      `/api/discord/guilds/${selectedGuild.value?.id}`,
      {
        baseURL: config.public.apiBaseUrl,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    guildChannels.value = channelsResponse?.channels ?? [];
    selectedChannel.value =
      guildChannels.value.find(
        (c) => c.id === channelsResponse?.selectedChannelId,
      ) ?? null;
    broadcastConfig.value = {
      allFbsGames: channelsResponse?.broadcastAllFbs ?? false,
      closeGames: channelsResponse?.closeGameAlerts ?? false,
      conferences: channelsResponse?.conferences ?? [],
      teams:
        channelsResponse?.teams
          .map((t) => teamsList.value.find((l) => t == l.id))
          .filter((t) => t !== undefined) ?? [],
      selectedGames: channelsResponse?.gameIds ?? [],
    };

    updateTrackedGames();
  };

  const updateBroadcastChannel = async () => {
    const token = await getToken();

    await $fetch(`/api/discord/guilds/${selectedGuild.value?.id}/channel`, {
      baseURL: config.public.apiBaseUrl,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        channelId: selectedChannel.value?.id,
      },
    });
  };

  const conferenceList: Conference[] = [
    {
      name: 'ACC',
      abbreviation: 'ACC',
    },
    {
      name: 'Big 12',
      abbreviation: 'B12',
    },
    {
      name: 'Big Ten',
      abbreviation: 'B1G',
    },
    {
      name: 'SEC',
      abbreviation: 'SEC',
    },
    {
      name: 'American',
      abbreviation: 'AAC',
    },
    {
      name: 'Conference USA',
      abbreviation: 'CUSA',
    },
    {
      name: 'Mid-American',
      abbreviation: 'MAC',
    },
    {
      name: 'Mountain West',
      abbreviation: 'MWC',
    },
    {
      name: 'Pac-12',
      abbreviation: 'PAC',
    },
    {
      name: 'Sun Belt',
      abbreviation: 'SBC',
    },
  ];

  const teamSearchText = ref('');
  const teamsList = ref<Team[]>([]);
  const selectableTeams = computed(() => {
    return teamsList.value.filter((team) => {
      return !broadcastConfig.value.teams.some((t) => t.id === team.id);
    });
  });

  const gamesList = ref<Game[]>([]);

  const hydrate = async () => {
    await getUserSession();
    if (userSession?.guilds) {
      userGuilds.value = userSession.guilds;
    }

    await getToken();

    const teamsResponse = await useFetch<Team[]>(`/api/teams`, {
      baseURL: config.public.apiBaseUrl,
    });
    teamsList.value = teamsResponse.data.value ?? [];

    const gamesResponse = await useFetch<Game[]>(`/api/games`, {
      baseURL: config.public.apiBaseUrl,
    });
    gamesList.value = gamesResponse.data.value ?? [];

    updateTrackedGames();
  };

  const updateTeamsRequest = async () => {
    const token = await getToken();

    await $fetch(`/api/discord/guilds/${selectedGuild.value?.id}/teams`, {
      baseURL: config.public.apiBaseUrl,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        guildTeams: broadcastConfig.value.teams.map((t) => t.id),
      },
    });
  };

  const addTeam = async (event: AutoCompleteOptionSelectEvent) => {
    broadcastConfig.value.teams.push(event.value as Team);
    teamSearchText.value = '';

    updateTrackedGames();

    await updateTeamsRequest();
  };

  const removeTeam = async (id: number) => {
    broadcastConfig.value.teams = broadcastConfig.value.teams.filter(
      (t) => t.id !== id,
    );

    updateTrackedGames();

    await updateTeamsRequest();
  };

  const isGameSelected = (game: Game): boolean => {
    return !!(
      broadcastConfig.value.allFbsGames ||
      broadcastConfig.value.conferences.find(
        (c) => c == game.homeConferenceAbbreviation,
      ) ||
      broadcastConfig.value.conferences.find(
        (c) => c == game.awayConferenceAbbreviation,
      ) ||
      broadcastConfig.value.teams.find((t) => t.id == game.homeId) ||
      broadcastConfig.value.teams.find((t) => t.id == game.awayId) ||
      broadcastConfig.value.selectedGames.includes(game.id)
    );
  };

  const updateTrackedGames = () => {
    trackedGames.value = gamesList.value
      .filter((game) => isGameSelected(game))
      .map((game) => game.id);
  };

  const toggleAllFbsGames = async (broadcast: boolean) => {
    updateTrackedGames();

    const token = await getToken();

    await $fetch(
      `/api/discord/guilds/${selectedGuild.value?.id}/broadcastAllFbs`,
      {
        baseURL: config.public.apiBaseUrl,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {
          broadcastAllFbs: broadcast,
        },
      },
    );
  };

  const toggleCloseGamesAndUpsets = async (broadcast: boolean) => {
    const token = await getToken();

    await $fetch(
      `/api/discord/guilds/${selectedGuild.value?.id}/closeGameAlerts`,
      {
        baseURL: config.public.apiBaseUrl,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {
          closeGameAlerts: broadcast,
        },
      },
    );
  };

  const updateBroadcastConferences = async () => {
    updateTrackedGames();

    const token = await getToken();

    await $fetch(`/api/discord/guilds/${selectedGuild.value?.id}/conferences`, {
      baseURL: config.public.apiBaseUrl,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        guildConferences: broadcastConfig.value.conferences,
      },
    });
  };

  const toggleTrackedGame = async (gameId: number) => {
    if (broadcastConfig.value.selectedGames.includes(gameId)) {
      broadcastConfig.value.selectedGames =
        broadcastConfig.value.selectedGames.filter((id) => id !== gameId);

      await $fetch(
        `/api/discord/guilds/${selectedGuild.value?.id}/games/remove`,
        {
          baseURL: config.public.apiBaseUrl,
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: {
            gameId,
          },
        },
      );
    } else {
      broadcastConfig.value.selectedGames.push(gameId);

      await $fetch(`/api/discord/guilds/${selectedGuild.value?.id}/games/add`, {
        baseURL: config.public.apiBaseUrl,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {
          gameId,
        },
      });
    }

    updateTrackedGames();
  };

  return {
    userSession,
    conferenceList,
    teamSearchText,
    teamsList,
    selectableTeams,
    gamesList,
    broadcastConfig,
    userGuilds,
    guildChannels,
    selectedGuild,
    selectedChannel,
    trackedGames,
    hydrate,
    addTeam,
    removeTeam,
    getUserSession,
    fetchGuildChannels: fetchGuildInfo,
    updateBroadcastChannel,
    toggleAllFbsGames,
    toggleCloseGamesAndUpsets,
    updateBroadcastConferences,
    toggleTrackedGame,
  };
});
