<script setup lang="ts">
import { useConfigStore } from '~/stores/config';

const { status } = useAuth();
const configStore = useConfigStore();

const isAuthenticated = computed(() => status.value === 'authenticated');
const isReadyForConfiguration = computed(
  () => !!configStore.selectedGuild && !!configStore.selectedChannel,
);
const setupHint = computed(() => {
  if (!configStore.selectedGuild) {
    return 'Select a Discord server to load channels and saved broadcast rules.';
  }

  if (!configStore.selectedChannel) {
    return 'Choose the channel where Score Bot should post alerts.';
  }

  return '';
});

const hydrateForAuthenticatedUser = async (): Promise<void> => {
  if (!isAuthenticated.value) {
    return;
  }

  await configStore.hydrate();
};

watch(
  () => status.value,
  async () => {
    await hydrateForAuthenticatedUser();
  },
  { immediate: true },
);
</script>

<template>
  <div class="scorebot-page">
    <header class="page-header">
      <div>
        <h1>CFBD Score Bot</h1>
        <p>
          Configure which college football games to track and broadcast as
          score alerts in your Discord server.
        </p>
      </div>
    </header>

    <SignedOutPanel v-if="status === 'unauthenticated'" />

    <section v-else-if="status === 'loading'" class="state-panel">
      <ProgressSpinner aria-label="Checking Discord session" />
      <div>
        <h2>Checking Discord session</h2>
        <p>Loading your Score Bot workspace.</p>
      </div>
    </section>

    <template v-else>
      <section v-if="configStore.hydrateError" class="state-panel is-error">
        <i class="pi pi-exclamation-triangle" aria-hidden="true" />
        <div>
          <h2>Unable to load Score Bot data</h2>
          <p>{{ configStore.hydrateError }}</p>
          <Button
            icon="pi pi-refresh"
            label="Try Again"
            @click="configStore.hydrate"
          />
        </div>
      </section>

      <section v-else class="admin-workflow">
        <ServerChannelPanel />

        <section v-if="configStore.isHydrating" class="state-panel">
          <ProgressSpinner aria-label="Loading Score Bot data" />
          <div>
            <h2>Loading saved configuration</h2>
            <p>Fetching servers, channels, teams, and this week's games.</p>
          </div>
        </section>

        <template v-else>
          <ConfigSummary v-if="isReadyForConfiguration" />

          <section v-else class="empty-setup-panel">
            <i class="pi pi-arrow-up-right" aria-hidden="true" />
            <div>
              <h2>Finish setup to unlock broadcast rules.</h2>
              <p>{{ setupHint }}</p>
            </div>
          </section>

          <BroadcastRulesPanel v-if="isReadyForConfiguration" />
          <GameSelectorTable v-if="isReadyForConfiguration" />
        </template>
      </section>
    </template>
  </div>
</template>

<style scoped lang="scss">
.scorebot-page {
  display: grid;
  gap: 1.35rem;
  max-width: 1320px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.5rem;
}

.page-header h1 {
  margin: 0;
  color: var(--cfbd-logo-navy);
  font-size: clamp(1.9rem, 3vw, 2.45rem);
  font-weight: 800;
  letter-spacing: 0;
  line-height: 1.02;
}

.dark-mode .page-header h1 {
  color: var(--rs-surface-white);
}

.page-header p {
  max-width: 720px;
  margin: 0.45rem 0 0;
  color: var(--p-text-muted-color);
  font-size: clamp(0.98rem, 1.2vw, 1.05rem);
  line-height: 1.55;
}

.admin-workflow {
  display: grid;
  gap: 1.15rem;
}

.state-panel,
.empty-setup-panel {
  display: grid;
  align-items: center;
  gap: 1rem;
  grid-template-columns: auto 1fr;
  border: 1px solid var(--surface-border);
  border-radius: 8px;
  background: var(--p-content-background);
  padding: clamp(1.1rem, 2.5vw, 1.5rem);
}

.state-panel :deep(.p-progressspinner) {
  width: 2.5rem;
  height: 2.5rem;
}

.state-panel i,
.empty-setup-panel i {
  color: var(--cfbd-field-green);
  font-size: 1.5rem;
}

.state-panel.is-error i {
  color: var(--rs-error);
}

.state-panel h2,
.empty-setup-panel h2 {
  margin: 0 0 0.3rem;
  color: var(--p-text-color);
  font-size: 1rem;
  font-weight: 800;
}

.state-panel p,
.empty-setup-panel p {
  margin: 0;
  color: var(--p-text-muted-color);
  line-height: 1.5;
}

.state-panel :deep(.p-button) {
  margin-top: 0.85rem;
}

@media (max-width: 720px) {
  .page-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .state-panel,
  .empty-setup-panel {
    grid-template-columns: 1fr;
  }
}
</style>
