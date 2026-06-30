<script setup lang="ts">
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useConfigStore } from '~/stores/config';
import type { Game } from '~/types';
import { getGameCoverage, teamLogoUrl } from '~/utils/broadcast';

dayjs.extend(utc);

const configStore = useConfigStore();

const searchTerm = ref('');
const selectedConference = ref('all');
const selectedWeek = ref('all');
const coverageFilter = ref<'all' | 'tracked' | 'manual' | 'available'>('all');
const pageSize = ref(50);

const conferenceOptions = computed(() => [
  { name: 'All conferences', abbreviation: 'all' },
  ...configStore.conferenceList,
]);

const coverageOptions = [
  { label: 'All games', value: 'all' },
  { label: 'Tracked', value: 'tracked' },
  { label: 'Manual picks', value: 'manual' },
  { label: 'Available', value: 'available' },
];

const pageSizeOptions = [25, 50, 100, 250];

const coverageFor = (game: Game) =>
  getGameCoverage(game, configStore.broadcastConfig);

const isPostseasonGame = (game: Game): boolean =>
  game.seasonType === 'postseason';

const weekFilterValue = (game: Game): string =>
  isPostseasonGame(game) ? 'postseason' : `week-${game.week}`;

const formatWeek = (game: Game): string =>
  isPostseasonGame(game) ? 'Postseason' : String(game.week);

const weekOptions = computed(() => {
  const weeks = new Set<number>();
  let hasPostseason = false;

  configStore.gamesList.forEach((game) => {
    if (isPostseasonGame(game)) {
      hasPostseason = true;
      return;
    }

    weeks.add(game.week);
  });

  const options = [...weeks]
    .sort((a, b) => a - b)
    .map((week) => ({
      label: `Week ${week}`,
      value: `week-${week}`,
    }));

  return [
    { label: 'All weeks', value: 'all' },
    ...options,
    ...(hasPostseason
      ? [{ label: 'Postseason', value: 'postseason' }]
      : []),
  ];
});

const filteredGames = computed(() => {
  const query = searchTerm.value.trim().toLowerCase();

  return configStore.gamesList.filter((game) => {
    const coverage = coverageFor(game);
    const matchesSearch =
      !query ||
      game.homeTeam.toLowerCase().includes(query) ||
      game.awayTeam.toLowerCase().includes(query) ||
      game.homeLocation.toLowerCase().includes(query) ||
      game.awayLocation.toLowerCase().includes(query);
    const matchesConference =
      selectedConference.value === 'all' ||
      game.homeConferenceAbbreviation === selectedConference.value ||
      game.awayConferenceAbbreviation === selectedConference.value;
    const matchesWeek =
      selectedWeek.value === 'all' ||
      weekFilterValue(game) === selectedWeek.value;
    const matchesCoverage =
      coverageFilter.value === 'all' ||
      (coverageFilter.value === 'tracked' && coverage.selected) ||
      (coverageFilter.value === 'manual' && coverage.kind === 'manual') ||
      (coverageFilter.value === 'available' && !coverage.selected);

    return matchesSearch && matchesConference && matchesWeek && matchesCoverage;
  });
});

const trackedVisibleCount = computed(
  () => filteredGames.value.filter((game) => coverageFor(game).selected).length,
);

const formatStart = (startDate: Date): string =>
  dayjs(startDate).utc().local().format('ddd, MMM D h:mm A');

const tagSeverity = (kind: string): 'success' | 'info' | 'secondary' | 'warn' =>
  kind === 'manual'
    ? 'success'
    : kind === 'none'
      ? 'secondary'
      : kind === 'all-fbs'
        ? 'info'
        : 'warn';

const rowClass = (game: Game): Record<string, boolean> => ({
  'game-row-covered': coverageFor(game).disabled,
});

const toggleGame = async (game: Game): Promise<void> => {
  const coverage = coverageFor(game);

  if (!coverage.disabled) {
    await configStore.toggleTrackedGame(game.id);
  }
};
</script>

<template>
  <section id="game-selector" class="games-panel">
    <div class="games-toolbar">
      <div>
        <h2>Game Selector</h2>
        <p>
          {{ trackedVisibleCount }} tracked in view ·
          {{ filteredGames.length }} games shown ·
          {{ pageSize }} per page
        </p>
      </div>

      <div class="toolbar-controls">
        <IconField>
          <InputIcon class="pi pi-search" />
          <InputText v-model="searchTerm" placeholder="Search teams..." />
        </IconField>
        <Select
          v-model="selectedConference"
          :options="conferenceOptions"
          option-label="name"
          option-value="abbreviation"
          aria-label="Filter by conference"
        />
        <Select
          v-model="selectedWeek"
          :options="weekOptions"
          option-label="label"
          option-value="value"
          aria-label="Filter by week"
        />
        <Select
          v-model="coverageFilter"
          :options="coverageOptions"
          option-label="label"
          option-value="value"
          aria-label="Filter by tracking state"
        />
      </div>
    </div>

    <DataTable
      :value="filteredGames"
      data-key="id"
      :row-class="rowClass"
      paginator
      v-model:rows="pageSize"
      :rows-per-page-options="pageSizeOptions"
      responsive-layout="scroll"
    >
      <Column header="Tracked" style="width: 92px">
        <template #body="slotProps">
          <Checkbox
            :model-value="coverageFor(slotProps.data).selected"
            :binary="true"
            :disabled="coverageFor(slotProps.data).disabled"
            @update:model-value="toggleGame(slotProps.data)"
          />
        </template>
      </Column>
      <Column header="Week" style="width: 110px">
        <template #body="slotProps">
          <span class="week-value">{{ formatWeek(slotProps.data) }}</span>
        </template>
      </Column>
      <Column field="startDate" header="Start (Local)" style="min-width: 170px">
        <template #body="slotProps">
          <span class="start-time">{{ formatStart(slotProps.data.startDate) }}</span>
        </template>
      </Column>
      <Column field="awayTeam" header="Away" style="min-width: 220px">
        <template #body="slotProps">
          <div class="team-cell">
            <img
              :src="teamLogoUrl(slotProps.data.awayId)"
              :alt="slotProps.data.awayTeam"
            />
            <div>
              <strong>{{ slotProps.data.awayTeam }}</strong>
              <span>{{ slotProps.data.awayLocation }}</span>
            </div>
          </div>
        </template>
      </Column>
      <Column field="homeTeam" header="Home" style="min-width: 220px">
        <template #body="slotProps">
          <div class="team-cell">
            <img
              :src="teamLogoUrl(slotProps.data.homeId)"
              :alt="slotProps.data.homeTeam"
            />
            <div>
              <strong>{{ slotProps.data.homeTeam }}</strong>
              <span>{{ slotProps.data.homeLocation }}</span>
            </div>
          </div>
        </template>
      </Column>
      <Column header="Coverage" style="min-width: 180px">
        <template #body="slotProps">
          <Tag
            :value="coverageFor(slotProps.data).detail"
            :severity="tagSeverity(coverageFor(slotProps.data).kind)"
          />
        </template>
      </Column>
      <template #empty>
        <div class="table-empty">
          <strong>No games match these filters.</strong>
          <span>Adjust the search, conference, or tracking state.</span>
        </div>
      </template>
    </DataTable>
  </section>
</template>

<style scoped lang="scss">
.games-panel {
  overflow: hidden;
  border: 1px solid var(--surface-border);
  border-radius: 8px;
  background: var(--p-content-background);
}

.games-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border-bottom: 1px solid var(--surface-border);
  padding: 1rem;
}

.games-toolbar h2 {
  margin: 0;
  color: var(--p-text-color);
  font-size: 1rem;
  font-weight: 800;
}

.games-toolbar p {
  margin: 0.28rem 0 0;
  color: var(--p-text-muted-color);
  font-size: 0.84rem;
}

.toolbar-controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.6rem;
}

.toolbar-controls :deep(.p-inputtext) {
  min-width: 220px;
}

.start-time {
  font-family: var(--rs-font-mono);
  font-size: 0.84rem;
  font-weight: 600;
}

.week-value {
  font-family: var(--rs-font-mono);
  font-size: 0.82rem;
  font-weight: 700;
}

.team-cell {
  display: inline-flex;
  min-width: 0;
  align-items: center;
  gap: 0.7rem;
}

.team-cell img {
  width: 1.8rem;
  height: 1.8rem;
  object-fit: contain;
}

.team-cell div {
  display: grid;
  min-width: 0;
}

.team-cell strong {
  overflow: hidden;
  color: var(--p-text-color);
  font-size: 0.9rem;
  line-height: 1.15;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.team-cell span {
  overflow: hidden;
  color: var(--p-text-muted-color);
  font-size: 0.76rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.games-panel :deep(.game-row-covered) {
  background: color-mix(
    in srgb,
    var(--cfbd-field-green-100) 20%,
    var(--p-content-background)
  );
}

.games-panel :deep(.p-datatable-tbody > tr > td),
.games-panel :deep(.p-datatable-thead > tr > th) {
  border-color: var(--surface-border);
  font-size: 0.88rem;
}

.games-panel :deep(.p-datatable-thead > tr > th) {
  color: var(--p-text-muted-color);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.table-empty {
  display: grid;
  gap: 0.35rem;
  justify-items: center;
  color: var(--p-text-muted-color);
  padding: 2rem;
}

.table-empty strong {
  color: var(--p-text-color);
}

@media (max-width: 840px) {
  .games-toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .toolbar-controls,
  .toolbar-controls :deep(.p-iconfield),
  .toolbar-controls :deep(.p-inputtext),
  .toolbar-controls :deep(.p-select) {
    width: 100%;
  }
}
</style>
