<script setup lang="ts">
import { useConfigStore } from '~/stores/config';

const props = defineProps<{
  currentYear: number;
}>();

const configStore = useConfigStore();
const { signIn, signOut, status, data } = useAuth();
const siteHeader = ref<HTMLElement | null>(null);
const headerHeight = ref(58);

let headerObserver: ResizeObserver | null = null;

const updateHeaderHeight = (): void => {
  const height = siteHeader.value?.offsetHeight ?? 58;

  headerHeight.value = height;
  document.documentElement.style.setProperty(
    '--scorebot-header-height',
    `${height}px`,
  );
};

const shellStyle = computed<Record<string, string>>(() => ({
  '--scorebot-header-height': `${headerHeight.value}px`,
}));

const isAuthenticated = computed(() => status.value === 'authenticated');
const displayName = computed(() => {
  const session = data.value as { user?: { name?: string }; username?: string };

  return session?.username ?? session?.user?.name ?? 'cfbd_admin';
});

const refreshGuilds = async (): Promise<void> => {
  await signIn('discord');
};

const logout = async (): Promise<void> => {
  await signOut();
};

onMounted(() => {
  updateHeaderHeight();

  if ('ResizeObserver' in window) {
    headerObserver = new ResizeObserver(updateHeaderHeight);

    if (siteHeader.value) {
      headerObserver.observe(siteHeader.value);
    }
  }

  window.addEventListener('resize', updateHeaderHeight);
});

onBeforeUnmount(() => {
  headerObserver?.disconnect();
  window.removeEventListener('resize', updateHeaderHeight);
  document.documentElement.style.removeProperty('--scorebot-header-height');
});
</script>

<template>
  <div class="admin-shell" :style="shellStyle">
    <header ref="siteHeader" class="site-header">
      <div class="site-header-inner">
        <NuxtLink to="/" class="brand-lockup" aria-label="CFBD Score Bot home">
          <img
            class="brand-logo"
            src="/brand/cfbd-watermark-dark.png"
            alt="CollegeFootballData.com"
          />
          <span class="brand-divider" aria-hidden="true" />
          <span class="brand-product">Score Bot</span>
        </NuxtLink>

        <div class="header-actions">
          <Button
            as="a"
            href="https://discord.com/oauth2/authorize?client_id=472423746901377025"
            target="_blank"
            rel="noopener"
            icon="pi pi-plus"
            label="Add Bot"
          />
          <Button
            v-if="isAuthenticated"
            text
            outlined
            icon="pi pi-refresh"
            label="Refresh Guilds"
            @click="refreshGuilds"
          />
          <Button
            as="a"
            text
            outlined
            icon="pi pi-heart"
            label="Support"
            href="https://www.patreon.com/collegefootballdata"
            target="_blank"
            rel="noopener"
          />
          <Button
            text
            rounded
            class="theme-toggle"
            :aria-label="`Switch to ${
              configStore.darkMode ? 'light' : 'dark'
            } mode`"
            @click="configStore.toggleDarkMode"
          >
            <i :class="`pi pi-${configStore.darkMode ? 'sun' : 'moon'}`" />
          </Button>
          <template v-if="isAuthenticated">
            <span class="user-chip">
              <i class="pi pi-user" aria-hidden="true" />
              <span>{{ displayName }}</span>
            </span>
            <Button text icon="pi pi-sign-out" label="Sign Out" @click="logout" />
          </template>
          <Button
            v-else
            text
            icon="pi pi-discord"
            label="Sign In"
            @click="signIn('discord')"
          />
        </div>
      </div>
    </header>

    <div class="shell-body">
      <aside class="side-nav" aria-label="Score Bot navigation">
        <div class="nav-section">
          <span class="nav-heading">Configure</span>
          <a class="nav-item is-active" href="#score-bot">
            <i class="pi pi-table" aria-hidden="true" />
            <span>Score Bot</span>
          </a>
          <a class="nav-item" href="#server-channel">
            <i class="pi pi-server" aria-hidden="true" />
            <span>Servers</span>
          </a>
          <a class="nav-item" href="#server-channel">
            <i class="pi pi-comments" aria-hidden="true" />
            <span>Channels</span>
          </a>
          <a class="nav-item" href="#game-selector">
            <i class="pi pi-calendar" aria-hidden="true" />
            <span>Schedules</span>
          </a>
        </div>

        <div class="nav-section">
          <span class="nav-heading">Settings</span>
          <a class="nav-item" href="#broadcast-rules">
            <i class="pi pi-bell" aria-hidden="true" />
            <span>Notifications</span>
          </a>
          <a class="nav-item" href="#broadcast-rules">
            <i class="pi pi-sliders-h" aria-hidden="true" />
            <span>Rules</span>
          </a>
          <a class="nav-item" href="#score-bot">
            <i class="pi pi-cloud" aria-hidden="true" />
            <span>Bot Status</span>
          </a>
        </div>

        <div class="nav-section nav-section-bottom">
          <span class="nav-heading">Resources</span>
          <a
            class="nav-item"
            href="https://collegefootballdata.com"
            target="_blank"
            rel="noopener"
          >
            <i class="pi pi-book" aria-hidden="true" />
            <span>Documentation</span>
            <i class="pi pi-external-link" aria-hidden="true" />
          </a>
          <a
            class="nav-item"
            href="https://discord.com/oauth2/authorize?client_id=472423746901377025"
            target="_blank"
            rel="noopener"
          >
            <i class="pi pi-discord" aria-hidden="true" />
            <span>Discord Setup</span>
            <i class="pi pi-external-link" aria-hidden="true" />
          </a>
        </div>

        <div class="bot-card">
          <span>Active Bot</span>
          <strong><span class="status-dot" /> CFBD Score Bot</strong>
          <small>Broadcasting college football score alerts.</small>
        </div>
      </aside>

      <main id="score-bot" class="site-main">
        <slot />
      </main>
    </div>

    <footer class="site-footer">
      <span>© {{ props.currentYear }} CollegeFootballData.com.</span>
      <span>A product of Rad Sports Analytics LLC.</span>
    </footer>
  </div>
</template>

<style scoped lang="scss">
.admin-shell {
  --anchor-scroll-offset: calc(var(--scorebot-header-height, 58px) + 1rem);

  min-height: 100vh;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 60;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  background: var(--cfbd-logo-navy);
  color: var(--rs-surface-white);
}

.site-header-inner {
  display: flex;
  min-height: 58px;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.7rem clamp(1rem, 2.5vw, 1.5rem);
}

.brand-lockup {
  display: inline-flex;
  min-width: 0;
  align-items: center;
  gap: 0.9rem;
  color: var(--rs-surface-white);
  text-decoration: none;
}

.brand-logo {
  display: block;
  width: auto;
  height: 2.25rem;
  max-width: min(230px, 34vw);
  object-fit: contain;
}

.brand-divider {
  width: 1px;
  align-self: stretch;
  min-height: 2rem;
  background: rgba(255, 255, 255, 0.2);
}

.brand-product {
  font-size: 0.98rem;
  font-weight: 800;
  white-space: nowrap;
}

.header-actions {
  display: flex;
  min-width: 0;
  align-items: center;
  justify-content: flex-end;
  gap: 0.55rem;
}

.header-actions :deep(.p-button) {
  min-height: 2.35rem;
  border-color: rgba(255, 255, 255, 0.22);
  color: var(--rs-surface-white);
  font-size: 0.86rem;
  font-weight: 700;
}

.header-actions :deep(.p-button:first-child) {
  border-color: var(--cfbd-field-green);
  background: var(--cfbd-field-green);
}

.theme-toggle {
  width: 2.35rem;
}

.user-chip {
  display: inline-flex;
  max-width: 12rem;
  align-items: center;
  gap: 0.5rem;
  color: var(--rs-surface-white);
  font-size: 0.9rem;
  font-weight: 700;
}

.user-chip span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.shell-body {
  display: grid;
  min-height: calc(100vh - 58px);
  grid-template-columns: 220px minmax(0, 1fr);
}

.side-nav {
  position: sticky;
  top: 58px;
  display: flex;
  height: calc(100vh - 58px);
  flex-direction: column;
  gap: 1.3rem;
  overflow-y: auto;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  background:
    linear-gradient(160deg, rgba(30, 145, 62, 0.16), transparent 42%),
    var(--cfbd-logo-navy);
  padding: 1.2rem 1rem;
}

.nav-section {
  display: grid;
  gap: 0.35rem;
}

.nav-section-bottom {
  margin-top: auto;
}

.nav-heading {
  margin: 0.55rem 0 0.2rem;
  color: rgba(253, 253, 253, 0.56);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-radius: 6px;
  color: rgba(253, 253, 253, 0.86);
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.72rem 0.75rem;
  text-decoration: none;
  transition:
    background-color 0.16s ease,
    color 0.16s ease;
}

.nav-item i:first-child {
  width: 1rem;
  font-size: 0.95rem;
}

.nav-item span {
  flex: 1;
}

.nav-item:hover,
.nav-item:focus,
.nav-item.is-active {
  color: var(--rs-surface-white);
  background: rgba(255, 255, 255, 0.12);
}

.nav-item.is-active {
  box-shadow: inset 3px 0 0 var(--cfbd-field-green);
}

.bot-card {
  display: grid;
  gap: 0.42rem;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 8px;
  color: rgba(253, 253, 253, 0.78);
  padding: 1rem;
}

.bot-card span {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.bot-card strong {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: var(--rs-surface-white);
  font-size: 0.86rem;
}

.bot-card small {
  color: rgba(253, 253, 253, 0.64);
  line-height: 1.45;
}

.status-dot {
  display: inline-block;
  width: 0.48rem;
  height: 0.48rem;
  border-radius: 999px;
  background: var(--cfbd-field-green);
}

.site-main {
  min-width: 0;
  scroll-margin-top: var(--anchor-scroll-offset);
  padding: clamp(1.25rem, 2.5vw, 1.8rem);
}

.site-main :deep([id]) {
  scroll-margin-top: var(--anchor-scroll-offset);
}

.site-footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.35rem 1rem;
  border-top: 1px solid var(--surface-border);
  background: var(--p-content-background);
  color: var(--p-text-muted-color);
  font-size: 0.82rem;
  padding: 1rem;
}

@media (max-width: 1080px) {
  .header-actions :deep(.p-button-label),
  .user-chip span {
    display: none;
  }

  .brand-product {
    font-size: 0.9rem;
  }
}

@media (max-width: 820px) {
  .site-header-inner {
    flex-wrap: wrap;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: 0.15rem;
  }

  .shell-body {
    grid-template-columns: 1fr;
  }

  .side-nav {
    position: static;
    display: flex;
    height: auto;
    flex-direction: row;
    gap: 0.6rem;
    overflow-x: auto;
    padding: 0.65rem 1rem;
  }

  .nav-section {
    display: contents;
  }

  .nav-heading,
  .bot-card,
  .nav-item:nth-of-type(n + 4) {
    display: none;
  }

  .nav-item {
    flex: 0 0 auto;
    padding: 0.62rem 0.75rem;
  }
}

@media (max-width: 520px) {
  .brand-logo {
    height: 2rem;
    max-width: 9rem;
  }

  .brand-divider,
  .brand-product {
    display: none;
  }
}
</style>
