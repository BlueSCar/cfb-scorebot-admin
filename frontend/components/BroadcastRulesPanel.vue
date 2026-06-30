<script setup lang="ts">
import type { AutoCompleteCompleteEvent } from 'primevue/autocomplete';
import { useConfigStore } from '~/stores/config';
import type { Team } from '~/types';
import { teamLogoUrl } from '~/utils/broadcast';

const configStore = useConfigStore();
const teamSuggestions = ref<Team[]>([]);

const searchTeams = (event: AutoCompleteCompleteEvent): void => {
  const query = event.query.toLowerCase();

  teamSuggestions.value = configStore.selectableTeams.filter((team) =>
    team.team.toLowerCase().includes(query),
  );
};

const isSaving = (key: string): boolean => configStore.savingKey === key;
</script>

<template>
  <section id="broadcast-rules" class="rules-panel">
    <div class="rules-top">
      <div class="toggle-card">
        <ToggleSwitch
          v-model="configStore.broadcastConfig.allFbsGames"
          :disabled="isSaving('all-fbs')"
          @update:model-value="configStore.toggleAllFbsGames"
        />
        <div>
          <label>All FBS games</label>
          <p>Track every FBS game and override individual selections.</p>
        </div>
      </div>

      <div class="toggle-card">
        <ToggleSwitch
          v-model="configStore.broadcastConfig.closeGames"
          :disabled="isSaving('close-games')"
          @update:model-value="configStore.toggleCloseGamesAndUpsets"
        />
        <div>
          <label>Close games and upsets</label>
          <p>Only send high-leverage score alerts.</p>
        </div>
      </div>

      <div class="rule-note">
        <i class="pi pi-info-circle" aria-hidden="true" />
        <p>
          <strong>Close games:</strong> FBS games in OT or inside the final
          5:00 of the 4th within 8 points. <br /><strong>Upsets:</strong> 4th
          quarter or OT leads by lower-ranked teams, plus FCS-over-FBS leads.
        </p>
      </div>
    </div>

    <div class="rules-grid">
      <div class="rule-section">
        <div class="section-title">
          <h2>Conferences</h2>
          <span>{{ configStore.broadcastConfig.conferences.length }} selected</span>
        </div>
        <div class="conference-grid">
          <label
            v-for="conference in configStore.conferenceList"
            :key="conference.abbreviation"
            class="conference-option"
          >
            <Checkbox
              v-model="configStore.broadcastConfig.conferences"
              name="conferences"
              :value="conference.abbreviation"
              :disabled="isSaving('conferences')"
              @update:model-value="configStore.updateBroadcastConferences"
            />
            <span>{{ conference.name }}</span>
            <small>{{ conference.abbreviation }}</small>
          </label>
        </div>
        <p class="help-text">
          Select conferences to include. Team picks can refine the feed.
        </p>
      </div>

      <div class="rule-section">
        <div class="section-title">
          <h2>Teams</h2>
          <span>{{ configStore.broadcastConfig.teams.length }} selected</span>
        </div>
        <AutoComplete
          v-model="configStore.teamSearchText"
          :suggestions="teamSuggestions"
          option-label="team"
          placeholder="Search teams..."
          fluid
          :disabled="isSaving('teams')"
          @complete="searchTeams"
          @option-select="configStore.addTeam"
        >
          <template #option="slotProps">
            <div class="team-option">
              <img
                :src="teamLogoUrl(slotProps.option.id)"
                :alt="slotProps.option.team"
              />
              <span>{{ slotProps.option.team }}</span>
            </div>
          </template>
        </AutoComplete>

        <div
          v-if="configStore.broadcastConfig.teams.length"
          class="selected-teams"
        >
          <Chip
            v-for="team in configStore.broadcastConfig.teams"
            :key="team.id"
            :label="team.team"
            :image="teamLogoUrl(team.id)"
            removable
            @remove="configStore.removeTeam(team.id)"
          />
        </div>
        <div v-else class="empty-teams">No team refinements selected.</div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.rules-panel {
  overflow: hidden;
  border: 1px solid var(--surface-border);
  border-radius: 8px;
  background: var(--p-content-background);
}

.rules-top {
  display: grid;
  align-items: stretch;
  gap: 0;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(280px, 0.92fr);
  border-bottom: 1px solid var(--surface-border);
}

.toggle-card {
  display: grid;
  align-items: center;
  gap: 0.85rem;
  grid-template-columns: auto 1fr;
  border-right: 1px solid var(--surface-border);
  padding: 1rem;
}

.toggle-card label,
.section-title h2 {
  margin: 0;
  color: var(--p-text-color);
  font-size: 0.92rem;
  font-weight: 800;
}

.toggle-card p,
.help-text,
.empty-teams {
  margin: 0.25rem 0 0;
  color: var(--p-text-muted-color);
  font-size: 0.84rem;
  line-height: 1.45;
}

.rule-note {
  display: grid;
  align-items: center;
  gap: 0.75rem;
  grid-template-columns: auto 1fr;
  margin: 0.75rem;
  border: 1px solid rgba(30, 145, 62, 0.28);
  border-radius: 8px;
  background: color-mix(
    in srgb,
    var(--cfbd-field-green-100) 48%,
    var(--p-content-background)
  );
  padding: 0.8rem;
}

.rule-note i {
  color: var(--cfbd-field-green-700);
  font-size: 1.05rem;
}

.rule-note p {
  margin: 0;
  color: var(--p-text-color);
  font-size: 0.82rem;
  line-height: 1.45;
}

.rules-grid {
  display: grid;
  gap: 1.25rem;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
  padding: 1rem;
}

.rule-section {
  min-width: 0;
}

.section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.section-title span {
  color: var(--p-text-muted-color);
  font-size: 0.78rem;
  font-weight: 700;
  white-space: nowrap;
}

.conference-grid {
  display: grid;
  gap: 0.55rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.conference-option {
  display: grid;
  align-items: center;
  gap: 0.5rem;
  grid-template-columns: auto 1fr auto;
  min-width: 0;
  border: 1px solid var(--surface-border);
  border-radius: 6px;
  cursor: pointer;
  padding: 0.62rem 0.7rem;
}

.conference-option span {
  overflow: hidden;
  color: var(--p-text-color);
  font-size: 0.86rem;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.conference-option small {
  color: var(--p-text-muted-color);
  font-family: var(--rs-font-mono);
  font-size: 0.72rem;
  font-weight: 700;
}

.team-option {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
}

.team-option img {
  width: 1.6rem;
  height: 1.6rem;
  object-fit: contain;
}

.selected-teams {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.85rem;
}

.empty-teams {
  border: 1px dashed var(--surface-border);
  border-radius: 6px;
  margin-top: 0.85rem;
  padding: 0.8rem;
}

@media (max-width: 1120px) {
  .rules-top,
  .rules-grid {
    grid-template-columns: 1fr;
  }

  .toggle-card {
    border-right: 0;
    border-bottom: 1px solid var(--surface-border);
  }
}

@media (max-width: 540px) {
  .conference-grid {
    grid-template-columns: 1fr;
  }
}
</style>
