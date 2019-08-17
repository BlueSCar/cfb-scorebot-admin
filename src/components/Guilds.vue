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
                        </b-col>
                        <b-col />
                    </b-row>
                </b-card>
            </b-col>
        </b-row>
        <b-row v-if='this.selectedGuild && this.selectedChannel'>
            <b-col>
                <b-card>
                    <b-table id="GamesTable" :items="gamesProvider" :fields="fields">
                        <template slot="tracked" slot-scope="row">
                            <b-form-checkbox @click.native.stop
                                @change="toggleGame(row.item.id, row.item.active)"
                                v-model="row.item.active">
                            </b-form-checkbox>
                        </template>
                        <template slot="date" slot-scope="data">
                            <span>{{data.value | moment('LLLL')}}</span>
                        </template>
                        <template slot="matchup" slot-scope="row">
                            <b-row>
                                <b-img :src="row.item.awayLogo" width="25px" height="25px"></b-img>
                                {{row.item.name}}
                                <b-img :src="row.item.homeLogo" width="25px" height="25px"></b-img>
                            </b-row>
                        </template>
                    </b-table>
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
                channels: [],
                fields: ["tracked", "date", "matchup"]
            };
        },
        methods: {
            onGuildSelect(guildId) {
                if (!guildId) {
                    this.channels = null;
                    this.selectedChannel = null;
                    return;
                }

                let guild = this.guilds.find(g => g.id == guildId);
                if (guild) {
                    this.channels = guild.channels;
                    this.selectedChannel = guild.selectedChannelId;
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
            gamesProvider() {
                return this.$axios.get('/api/games', {
                    params: {
                        guildId: this.selectedGuild
                    }
                }).then((response) => {
                    return response.data;
                });
            },
            toggleGame(id, active) {
                this.$axios.post('api/game/toggle', {
                    gameId: id,
                    active: !active,
                    guildId: this.selectedGuild
                });
            }
        }
    };

</script>

<style>

</style>
