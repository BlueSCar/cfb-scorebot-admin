<script setup lang="ts">
import { useConfigStore } from '~/stores/config';

const configStore = useConfigStore();

const discordChannelHref = computed(() => {
  if (!configStore.selectedGuild || !configStore.selectedChannel) {
    return null;
  }

  return `https://discord.com/channels/${configStore.selectedGuild.id}/${configStore.selectedChannel.id}`;
});
</script>

<template>
  <section id="server-channel" class="setup-panel">
    <div class="field-group">
      <label for="guild-select">Discord Server</label>
      <Select
        id="guild-select"
        v-model="configStore.selectedGuild"
        :options="configStore.userGuilds"
        option-label="name"
        placeholder="Select a server"
        class="setup-select"
        :loading="configStore.isHydrating"
        @change="configStore.fetchGuildChannels"
      />
    </div>

    <div class="field-group">
      <label for="channel-select">Channel</label>
      <Select
        id="channel-select"
        v-model="configStore.selectedChannel"
        :options="configStore.guildChannels ?? []"
        option-label="name"
        placeholder="Select a channel"
        class="setup-select"
        :disabled="!configStore.selectedGuild || configStore.isFetchingGuild"
        :loading="configStore.isFetchingGuild"
        @change="configStore.updateBroadcastChannel"
      />
    </div>

    <div class="bot-status">
      <span>Bot Status</span>
      <strong
        :class="{
          connected: configStore.selectedGuild && configStore.selectedChannel,
        }"
      >
        <span class="status-dot" />
        {{
          configStore.selectedGuild && configStore.selectedChannel
            ? 'Connected'
            : 'Setup pending'
        }}
      </strong>
      <Button
        v-if="discordChannelHref"
        as="a"
        :href="discordChannelHref"
        target="_blank"
        rel="noopener"
        icon="pi pi-external-link"
        label="View on Discord"
        outlined
      />
    </div>
  </section>
</template>

<style scoped lang="scss">
.setup-panel {
  display: grid;
  align-items: end;
  gap: 1rem;
  grid-template-columns: minmax(220px, 1fr) minmax(220px, 1fr) auto;
}

.field-group {
  display: grid;
  gap: 0.45rem;
}

.field-group label,
.bot-status span {
  color: var(--p-text-color);
  font-size: 0.82rem;
  font-weight: 700;
}

.setup-select {
  width: 100%;
}

.bot-status {
  display: grid;
  min-width: 210px;
  gap: 0.45rem;
  justify-items: start;
}

.bot-status strong {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: var(--p-text-muted-color);
  font-size: 0.9rem;
}

.bot-status strong.connected {
  color: var(--cfbd-field-green-700);
}

.status-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 999px;
  background: var(--p-text-muted-color);
}

.connected .status-dot {
  background: var(--cfbd-field-green);
}

@media (max-width: 980px) {
  .setup-panel {
    grid-template-columns: 1fr 1fr;
  }

  .bot-status {
    grid-column: 1 / -1;
  }
}

@media (max-width: 620px) {
  .setup-panel {
    grid-template-columns: 1fr;
  }
}
</style>
