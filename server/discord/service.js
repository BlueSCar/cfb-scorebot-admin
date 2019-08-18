const Discord = require('discord.js');

module.exports = async (db) => {
    const client = new Discord.Client({
        apiRequestMethod: 'burst'
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
            const discordGuild = client.guilds.get(guild.id);
            if (discordGuild) {
                const selectedChannel = channelRecords.find(r => r.guild_id == discordGuild.id);
                const selectedChannelId = selectedChannel ? selectedChannel.channel_id : null;

                guilds.push({
                    id: discordGuild.id,
                    name: discordGuild.name,
                    selectedChannelId,
                    channels: discordGuild.channels.map(c => ({
                        id: c.id,
                        name: c.name
                    }))
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
            await db.none('INSERT INTO guild_channel (guild_id, channel_id) VALUES ($1, $2)', [guildId, channelId]);
        }
    };

    return {
        getChannels,
        getUserGuilds,
        addBroadcastChannel
    };
};
