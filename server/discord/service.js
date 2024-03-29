const { GatewayIntentBits } = require('discord.js');
const Discord = require('discord.js');

module.exports = async (db) => {
    const client = new Discord.Client({
        apiRequestMethod: 'burst',
        intents: [GatewayIntentBits.Guilds]
    });

    await client.login(process.env.DISCORD_TOKEN).catch(err => console.error(err));

    const getChannels = async (guildId) => {
        const guild = client.guilds.get(guildId);
        if (!guild) {
            return [];
        }

        const channels = guild.channels.filter(c => c.type === 'text').map(c => ({ id: c.id, name: c.name }));

        return channels;
    };

    const getUserGuilds = async (user) => {
        const guilds = [];
        if (!user.guilds || !user.guilds.length) {
            return [];
        }

        const channelRecords = await db.any('SELECT * FROM guild_channel WHERE guild_id in ($1:list)', [user.guilds.map(g => g.id)]);
        for (const guild of user.guilds) {
            const discordGuild = client.guilds.cache.get(guild.id);
            if (discordGuild) {
                const selectedChannel = channelRecords.find(r => r.guild_id == discordGuild.id);
                const selectedChannelId = selectedChannel ? selectedChannel.channel_id : null;
                const broadcastCloseGames = selectedChannel ? selectedChannel.close_game_alerts : true;
                const broadcastAllFBS = selectedChannel ? selectedChannel.broadcast_all_fbs : false;

                guilds.push({
                    id: discordGuild.id,
                    name: discordGuild.name,
                    selectedChannelId,
                    broadcastCloseGames,
                    broadcastAllFBS,
                    channels: discordGuild.channels.cache.filter(c => c.type === 0).map(c => ({
                        id: c.id,
                        name: c.name
                    })).sort((a, b) => {
                        if (a.name < b.name) {
                            return -1;
                        }

                        return 1;
                    })
                });
            }
        }

        return guilds;
    };

    const addBroadcastChannel = async (guildId, channelId) => {
        const existing = await db.oneOrNone('SELECT * FROM guild_channel WHERE guild_id = $1', [guildId]);
        if (existing) {
            await db.none('UPDATE guild_channel SET channel_id = $1 WHERE id = $2', [channelId, existing.id]);
        } else {
            await db.none('INSERT INTO guild_channel (guild_id, channel_id, close_game_alerts) VALUES ($1, $2, $3)', [guildId, channelId, true]);
        }
    };

    const toggleBroadcastCloseGames = async (guildId, broadcastCloseGames) => {
        await db.none('UPDATE guild_channel SET close_game_alerts = $1 WHERE guild_id = $2', [broadcastCloseGames, guildId]);
    };

    const toggleBroadcastAllFBSGames = async (guildId, broadcastAllFBS) => {
        await db.none('UPDATE guild_channel SET broadcast_all_fbs = $1 WHERE guild_id = $2', [broadcastAllFBS, guildId]);
    };

    return {
        getChannels,
        getUserGuilds,
        addBroadcastChannel,
        toggleBroadcastCloseGames,
        toggleBroadcastAllFBSGames
    };
};
