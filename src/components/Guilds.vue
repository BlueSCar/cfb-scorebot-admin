<template>
    <div>
        <b-row>
            <b-col>
                <b-card class='shadow-lg'>
                    <b-row>
                        <b-col />
                        <b-col lg='6'>
                            <b-row>
                                <b-form-select @input='onGuildSelect' v-model="selectedGuild">
                                    <option :value='null'>Select a guild (must be an admin)</option>
                                    <option v-for='guild in guilds' :key='guild.id'
                                        :value='guild.id'>{{ guild.name }}</option>
                                </b-form-select>
                            </b-row>
                            <b-row>
                                <b-form-select @input='onChannelSelect' v-model='selectedChannel'
                                    size='sm' class='mt-3'>
                                    <option :value='null'>Select a channel for broadcasting scores
                                    </option>
                                    <option v-for='channel in channels' :key='channel.id'
                                        :value='channel.id'>#{{ channel.name }}</option>
                                </b-form-select>
                            </b-row>
                            <b-row class='justify-content-center'>
                                <b-form-checkbox@click.native.stop @change="toggleCloseGamesBroadcast()" v-model="closeGamesToggle">Broadcast close games</b-form-checkbox>
                            </b-row>
                            <b-row class='justify-content-center'>
                                <b-form-checkbox@click.native.stop @change="toggleAllFBSGamesBroadcast()" v-model="fbsGamesToggle">Broadcast all FBS games</b-form-checkbox>
                            </b-row>
                            <b-row class='mt-3 justify-content-center'>
                                <div>Can't find your guild?</div>
                            </b-row>
                            <b-row class='justify-content-center'>
                                <div><b-link href="https://discord.com/oauth2/authorize?client_id=472423746901377025">Click here to add cfb-risk-bot to your guild.</b-link></div>
                            </b-row>
                            <b-row class='justify-content-center'>
                                <div>You may need to <b-link href='/auth/discord'>log back in</b-link> afterwards.</div>
                            </b-row>
                        </b-col>
                        <b-col />
                    </b-row>
                </b-card>
            </b-col>
        </b-row>
        <b-row v-if='this.selectedGuild && this.selectedChannel'>
            <b-col>
                <b-card>
                    <b-row>
                        <b-col md='12'>
                            <h4>Game Search</h4>
                            <b-input placeholder="Start typing a team or conference game to filter games" v-model='searchTerm'>
                            </b-input>
                        </b-col>
                    </b-row>
                </b-card>
            </b-col>
        </b-row>
        <b-row v-if='this.selectedGuild && this.selectedChannel'>
            <b-col>
                <b-card>
                    <b-table id="GamesTable" :items="tableItems" :fields="fields">
                        <template #cell(tracked)='data'>
                            <b-form-checkbox @click.native.stop
                                :disabled="fbsGamesToggle"
                                @change="toggleGame(data.item.id, data.item.active)"
                                v-model="data.item.active">
                            </b-form-checkbox>
                        </template>
                        <template #cell(date)='data'>
                            <span>{{data.value | moment('LLLL')}}</span>
                        </template>
                        <template #cell(matchup)='data'>
                            <b-row>
                                <b-img :src="data.item.awayLogo" width="25px" height="25px"></b-img>
                                {{data.item.name}}
                                <b-img :src="data.item.homeLogo" width="25px" height="25px"></b-img>
                            </b-row>
                        </template>
                    </b-table>
                    <div class='spinner-container' v-if='isLoading'>
                        <b-spinner variant="primary" label="Spinning" style="width: 5em; height: 5em;" />
                    </div>
                </b-card>
            </b-col>
        </b-row>
    </div>
</template>

<script>
    export default {
        props: ['guilds'],
        data() {
            return {
                selectedGuild: null,
                selectedChannel: null,
                closeGamesToggle: true,
                fbsGamesToggle: false,
                channels: [],
                fields: ["tracked", "date", "matchup"],
                isLoading: false,
                games: [],
                searchTerm: ''
            };
        },
        methods: {
            onGuildSelect(guildId) {
                if (!guildId) {
                    this.channels = null;
                    this.selectedChannel = null;
                    this.games = [];
                    return;
                }

                this.refreshGames(guildId);

                let guild = this.guilds.find(g => g.id == guildId);
                if (guild) {
                    this.channels = guild.channels;
                    this.selectedChannel = guild.selectedChannelId;
                    this.closeGamesToggle = guild.broadcastCloseGames;
                    this.fbsGamesToggle = guild.broadcastAllFBS;
                }
            },
            onChannelSelect(channelId) {
                if (channelId) {
                    this.$axios.post('/api/discord/channel', {
                        guildId: this.selectedGuild,
                        channelId
                    });
                }
            },
            refreshGames(guildId) {
                this.isLoading = true;

                return this.$axios.get('/api/games', {
                    params: {
                        guildId
                    }
                }).then((response) => {
                    this.games = response.data;
                }).finally(() => {
                    this.isLoading = false;
                });
            },
            toggleGame(id, active) {
                if (!this.fbsGamesToggle) {
                    this.$axios.post('api/game/toggle', {
                        gameId: id,
                        active: active,
                        guildId: this.selectedGuild
                    });
                }
            },
            toggleCloseGamesBroadcast() {
                if (this.selectedGuild) {
                    this.$axios.post('/api/discord/closegames/toggle', {
                        guildId: this.selectedGuild,
                        broadcastCloseGames: this.closeGamesToggle
                    });
                }
            },
            toggleAllFBSGamesBroadcast() {
                if (this.selectedGuild) {
                    this.$axios.post('/api/discord/allfbs/toggle', {
                        guildId: this.selectedGuild,
                        broadcastAllFBSGames: this.fbsGamesToggle
                    });
                }
            },
            selectAllGames() {
                if (!this.fbsGamesToggle) {
                    this.$axios.post('/api/games/all', {
                        guildId: this.selectedGuild
                    }).then((res) => {
                        for (let game of this.games) {
                            game.active = true;
                        }
                    });
                }
            }
        },
        computed: {
            tableItems() {
                if (!this.searchTerm) {
                    return this.games;
                } else {
                    return this.games.filter(g => g.homeTeam.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1 || g.awayTeam.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1 || (g.homeConference && g.homeConference.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1) || (g.awayConference && g.awayConference.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1));
                }
            }
        }
    };

</script>

<style>

</style>
