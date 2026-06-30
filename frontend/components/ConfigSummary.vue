<script setup lang="ts">
import { useConfigStore } from '~/stores/config';
import {
  countAutomaticGames,
  countTrackedGames,
  getSelectedTeamNames,
} from '~/utils/broadcast';

const configStore = useConfigStore();

const trackedCount = computed(() =>
  countTrackedGames(configStore.gamesList, configStore.broadcastConfig),
);
const automaticCount = computed(() =>
  countAutomaticGames(configStore.gamesList, configStore.broadcastConfig),
);
const manualCount = computed(
  () => configStore.broadcastConfig.selectedGames.length,
);
const ruleSummary = computed(() => {
  if (configStore.broadcastConfig.allFbsGames) {
    return 'Every FBS game';
  }

  const parts = [
    `${configStore.broadcastConfig.conferences.length} conferences`,
    `${configStore.broadcastConfig.teams.length} teams`,
    `${manualCount.value} manual picks`,
  ];

  return parts.join(', ');
});
const filtersSummary = computed(() =>
  configStore.broadcastConfig.closeGames
    ? 'Close games & upsets only'
    : 'All tracked game alerts',
);
const teamSummary = computed(() =>
  configStore.broadcastConfig.teams.length
    ? getSelectedTeamNames(configStore.broadcastConfig.teams)
    : 'No team refinements',
);
const lastSavedText = computed(() => {
  if (configStore.savingKey) {
    return 'Saving...';
  }

  if (!configStore.lastSavedAt) {
    return 'Autosaves on change';
  }

  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(configStore.lastSavedAt);
});
</script>

<template>
  <section class="summary-panel" aria-label="Configuration summary">
    <div class="summary-item">
      <i class="pi pi-list-check" aria-hidden="true" />
      <div>
        <span>Configuration Summary</span>
        <strong>{{ ruleSummary }}</strong>
      </div>
    </div>
    <div class="summary-item">
      <i class="pi pi-sliders-h" aria-hidden="true" />
      <div>
        <span>Game Filters</span>
        <strong>{{ filtersSummary }}</strong>
      </div>
    </div>
    <div class="summary-item">
      <i class="pi pi-hashtag" aria-hidden="true" />
      <div>
        <span>Tracked Games</span>
        <strong>{{ trackedCount }} of {{ configStore.gamesList.length }}</strong>
      </div>
    </div>
    <div class="summary-item">
      <i class="pi pi-clock" aria-hidden="true" />
      <div>
        <span>Last Saved</span>
        <strong>{{ lastSavedText }}</strong>
      </div>
    </div>

    <Message
      v-if="configStore.requestError"
      class="summary-message"
      severity="error"
      :closable="true"
      @close="configStore.clearRequestError"
    >
      {{ configStore.requestError }}
    </Message>

    <p class="summary-detail">
      {{ automaticCount }} games are covered by broad rules.
      {{ manualCount }} games are manually selected. {{ teamSummary }}.
    </p>
  </section>
</template>

<style scoped lang="scss">
.summary-panel {
  display: grid;
  gap: 0;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  overflow: hidden;
  border: 1px solid var(--surface-border);
  border-radius: 8px;
  background: var(--p-content-background);
  box-shadow: 0 10px 26px rgba(4, 19, 41, 0.05);
}

.summary-item {
  display: grid;
  align-items: center;
  gap: 0.85rem;
  grid-template-columns: auto 1fr;
  min-width: 0;
  border-right: 1px solid var(--surface-border);
  padding: 1rem;
}

.summary-item:last-of-type {
  border-right: 0;
}

.summary-item i {
  color: var(--cfbd-logo-navy);
  font-size: 1.28rem;
}

.dark-mode .summary-item i {
  color: var(--cfbd-field-green);
}

.summary-item span {
  display: block;
  color: var(--p-text-color);
  font-size: 0.78rem;
  font-weight: 800;
}

.summary-item strong {
  display: block;
  overflow: hidden;
  color: var(--p-text-muted-color);
  font-size: 0.88rem;
  font-weight: 500;
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.summary-message,
.summary-detail {
  grid-column: 1 / -1;
}

.summary-message {
  margin: 0.8rem 1rem 0;
}

.summary-detail {
  margin: 0;
  border-top: 1px solid var(--surface-border);
  color: var(--p-text-muted-color);
  font-size: 0.84rem;
  line-height: 1.45;
  padding: 0.8rem 1rem;
}

@media (max-width: 980px) {
  .summary-panel {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .summary-item:nth-child(2) {
    border-right: 0;
  }
}

@media (max-width: 560px) {
  .summary-panel {
    grid-template-columns: 1fr;
  }

  .summary-item {
    border-right: 0;
    border-bottom: 1px solid var(--surface-border);
  }
}
</style>
