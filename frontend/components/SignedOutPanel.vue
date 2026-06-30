<script setup lang="ts">
const { signIn } = useAuth();

const handleSignIn = async (): Promise<void> => {
  await signIn('discord');
};
</script>

<template>
  <section class="signed-out-panel">
    <div class="signed-out-copy">
      <h2>Connect Discord to configure your score bot.</h2>
      <p>
        Sign in with Discord, choose a server, select the channel, and decide
        which games should trigger score alerts.
      </p>
      <div class="signed-out-actions">
        <Button
          icon="pi pi-discord"
          label="Sign in with Discord"
          @click="handleSignIn"
        />
        <Button
          as="a"
          href="https://discord.com/oauth2/authorize?client_id=472423746901377025"
          target="_blank"
          rel="noopener"
          icon="pi pi-plus"
          label="Add Bot"
          outlined
        />
      </div>
    </div>

    <div class="workflow-preview" aria-label="Score Bot setup preview">
      <div class="preview-row">
        <span class="preview-index">01</span>
        <strong>Select server</strong>
        <span>Choose the Discord server you manage.</span>
      </div>
      <div class="preview-row">
        <span class="preview-index">02</span>
        <strong>Pick channel</strong>
        <span>Route alerts to a text or forum channel.</span>
      </div>
      <div class="preview-row">
        <span class="preview-index">03</span>
        <strong>Track games</strong>
        <span>Use rules or manual picks for the week.</span>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.signed-out-panel {
  display: grid;
  align-items: center;
  gap: clamp(1.25rem, 3vw, 2rem);
  grid-template-columns: minmax(0, 0.95fr) minmax(300px, 0.75fr);
  overflow: hidden;
  border: 1px solid var(--surface-border);
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(30, 145, 62, 0.12), transparent 45%),
    var(--p-content-background);
  box-shadow: 0 18px 42px rgba(4, 19, 41, 0.08);
  padding: clamp(1.25rem, 3vw, 2rem);
}

.signed-out-copy {
  text-align: left;
}

.signed-out-copy h2 {
  max-width: 680px;
  margin: 0 0 0.85rem;
  color: var(--cfbd-logo-navy);
  font-size: clamp(2rem, 5vw, 4.4rem);
  font-weight: 800;
  letter-spacing: 0;
  line-height: 0.98;
}

.dark-mode .signed-out-copy h2 {
  color: var(--rs-surface-white);
}

.signed-out-copy p {
  max-width: 640px;
  margin: 0;
  color: var(--p-text-muted-color);
  font-size: clamp(1rem, 1.5vw, 1.16rem);
  line-height: 1.65;
}

.signed-out-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.4rem;
}

.workflow-preview {
  display: grid;
  gap: 0.8rem;
}

.preview-row {
  display: grid;
  gap: 0.18rem;
  grid-template-columns: auto 1fr;
  border: 1px solid var(--surface-border);
  border-radius: 8px;
  background: var(--p-content-background);
  padding: 1rem;
}

.preview-index {
  grid-row: span 2;
  color: var(--cfbd-field-green);
  font-family: var(--rs-font-mono);
  font-size: 0.78rem;
  font-weight: 800;
}

.preview-row strong {
  color: var(--p-text-color);
  font-size: 0.98rem;
}

.preview-row span:last-child {
  color: var(--p-text-muted-color);
  line-height: 1.45;
}

@media (max-width: 820px) {
  .signed-out-panel {
    grid-template-columns: 1fr;
  }

  .signed-out-actions,
  .signed-out-actions :deep(.p-button) {
    width: 100%;
  }
}
</style>
