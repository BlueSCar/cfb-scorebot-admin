<script setup lang="ts">
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import type { AutoCompleteCompleteEvent } from 'primevue/autocomplete';
import { useConfigStore } from '../stores/config';
import type { Game, Team } from '../types';
import type { MenuItem } from 'primevue/menuitem';

const currentYear = new Date().getFullYear();

const { signIn, status } = useAuth();

dayjs.extend(utc);

const configStore = useConfigStore();
await configStore.hydrate();

const teamSuggestions = ref<Team[]>([]);

const searchTeams = (event: AutoCompleteCompleteEvent) => {
  teamSuggestions.value = configStore.selectableTeams.filter((team) =>
    team.team.toLowerCase().includes(event.query.toLowerCase()),
  );
};

const isGameDisabled = (game: Game): boolean => {
  return !!(
    configStore.broadcastConfig.allFbsGames ||
    configStore.broadcastConfig.conferences.find(
      (c) => c == game.homeConferenceAbbreviation,
    ) ||
    configStore.broadcastConfig.conferences.find(
      (c) => c == game.awayConferenceAbbreviation,
    ) ||
    configStore.broadcastConfig.teams.find((t) => t.id == game.homeId) ||
    configStore.broadcastConfig.teams.find((t) => t.id == game.awayId)
  );
};

const menuItems = ref<MenuItem[]>([
  {
    label: 'Add Bot',
    icon: 'pi pi-plus',
    url: 'https://discord.com/oauth2/authorize?client_id=472423746901377025',
    target: '_blank',
  },
  {
    label: 'Refresh Guilds',
    icon: 'pi pi-refresh',
    command: () => signIn('discord'),
    visible: status.value === 'authenticated',
  },
]);
</script>

<template>
  <Menubar :model="menuItems">
    <template #start>
      <img
        alt="logo"
        height="40"
        src="https://cdn.collegefootballdata.com/logos/LetterLogo.png"
      />
    </template>
    <template #end>
      <Button @click="configStore.toggleDarkMode" text class="mr-2"
        ><i :class="`pi pi-${configStore.darkMode ? 'sun' : 'moon'}`"></i
      ></Button>
      <Button
        as="a"
        icon="pi pi-wallet"
        label="Patreon"
        severity="danger"
        href="https://www.patreon.com/collegefootballdata"
        target="_blank"
        rel="noopener"
      />
    </template>
  </Menubar>
  <div id="main-container" class="text-center">
    <h1>CFBD Score Bot</h1>

    <div v-if="status === 'unauthenticated'" id="discord-login">
      <Button label="Sign In" icon="pi pi-discord" @click="signIn('discord')" />
    </div>

    <div v-if="status === 'authenticated'">
      <div class="grid">
        <div class="md:col-2" />
        <div class="col-12 lg:col-4">
          <label class="mt-2 mr-2">Select a server:</label>
          <Select
            placeholder="Select a guild"
            v-model="configStore.selectedGuild"
            :options="configStore.userGuilds"
            option-label="name"
            style="width: 300px"
            @change="configStore.fetchGuildChannels"
          />
        </div>
        <div
          class="col-12 md:col-4"
          v-if="configStore.selectedGuild && configStore.guildChannels"
        >
          <label class="mt-2 mr-2">Select a channel:</label>
          <Select
            v-model="configStore.selectedChannel"
            placeholder="Select a channel"
            :options="configStore.guildChannels"
            option-label="name"
            style="width: 300px"
            @change="configStore.updateBroadcastChannel"
          />
        </div>
      </div>

      <div v-if="configStore.selectedGuild && configStore.selectedChannel">
        <Divider />

        <h2>Guild Configuration</h2>

        <div class="flex flex-wrap justify-content-center gap-4">
          <div class="flex items-center">
            <label class="mt-1 mr-2">All FBS games?</label>
            <ToggleSwitch
              v-model="configStore.broadcastConfig.allFbsGames"
              @update:model-value="configStore.toggleAllFbsGames"
            />
          </div>

          <div class="flex items-center">
            <label class="mt-1 mr-2">Close games and upsets?</label>
            <ToggleSwitch
              v-model="configStore.broadcastConfig.closeGames"
              @update:model-value="configStore.toggleCloseGamesAndUpsets"
            />
          </div>
        </div>

        <h3>Conference Broadcasts</h3>
        <div class="flex flex-wrap justify-content-center gap-4">
          <div
            class="flex items-center"
            v-for="conference in configStore.conferenceList"
          >
            <Checkbox
              v-model="configStore.broadcastConfig.conferences"
              name="conferences"
              :value="conference.abbreviation"
              @update:model-value="configStore.updateBroadcastConferences"
            />
            <label class="ml-2">{{ conference.name }}</label>
          </div>
        </div>

        <h3>Team Broadcasts</h3>
        <div>
          <AutoComplete
            placeholder="Search for teams..."
            optionLabel="team"
            v-model="configStore.teamSearchText"
            :suggestions="teamSuggestions"
            @complete="searchTeams"
            @option-select="configStore.addTeam"
          >
            <template #option="slotProps">
              <div class="flex items-center">
                <img
                  :alt="slotProps.option.team"
                  :src="`https://cdn.collegefootballdata.com/logos/64/${slotProps.option.id}.png`"
                  style="width: 32px"
                />
                <div class="ml-2 mt-2">{{ slotProps.option.team }}</div>
              </div>
            </template>
          </AutoComplete>
        </div>
        <div class="mt-2">
          <Chip
            class="mr-2 mt-2"
            v-for="team in configStore.broadcastConfig.teams"
            :label="team.team"
            :image="`https://cdn.collegefootballdata.com/logos/64/${team.id}.png`"
            removable
            @remove="configStore.removeTeam(team.id)"
          />
        </div>

        <Divider />

        <DataTable :value="configStore.gamesList">
          <Column field="isSelected" header="Tracked">
            <template #body="slotProps">
              <div class="text-center">
                <Checkbox
                  v-model="configStore.trackedGames"
                  :value="slotProps.data.id"
                  :disabled="isGameDisabled(slotProps.data)"
                  @update:model-value="
                    configStore.toggleTrackedGame(slotProps.data.id)
                  "
                />
              </div>
            </template>
          </Column>
          <Column field="startDate" header="Start Date">
            <template #body="slotProps">
              {{
                dayjs(slotProps.data.startDate)
                  .utc()
                  .local()
                  .format('dddd, M/D, h:mm a')
              }}
            </template>
          </Column>
          <Column field="homeTeam" header="Home">
            <template #body="slotProps">
              <div class="flex items-center">
                <img
                  :src="`https://cdn.collegefootballdata.com/logos/64/${slotProps.data.homeId}.png`"
                  style="width: 24px"
                />
                <div class="ml-2 mt-1">{{ slotProps.data.homeTeam }}</div>
              </div>
            </template>
          </Column>
          <Column field="awayTeam" header="Away">
            <template #body="slotProps">
              <div class="flex items-center">
                <img
                  :src="`https://cdn.collegefootballdata.com/logos/64/${slotProps.data.awayId}.png`"
                  style="width: 24px"
                />
                <div class="ml-2 mt-1">{{ slotProps.data.awayTeam }}</div>
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
  <footer class="text-center p-2">
    <hr />
    © {{ currentYear }} CollegeFootballData.com. All rights reserved.<br />A
    product of Rad Sports Analytics LLC.
  </footer>
</template>

<style lang="scss">
#__nuxt {
  background: hsla(0, 0%, 100%, 0.75);
  margin: 0;
  min-height: 100%;
}

.dark-mode {
  & #__nuxt {
    background: hsla(0, 0%, 0%, 0.75);
  }
}

#discord-login {
  button {
    background: #7289da;
  }
}

html {
  margin: 0;
  height: 100%;
}

body {
  height: 100%;
  width: 100%;
  margin: 0;
  background-image: url('https://cdn.collegefootballdata.com/assets/football-field-bg.jpg');
  background-size: cover;
  background-attachment: fixed;
}

a.p-button {
  text-decoration: none;
}

.p-chip-image {
  border-radius: 0%;
  margin: 1px;
}

#main-container {
  padding: 2em;
}
</style>
