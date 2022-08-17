const serviceConstructor = require('./service');

module.exports = async (db) => {
    const service = await serviceConstructor(db);

    const getChannels = async (req, res) => {
        if (req.isAuthenticated() && req.user) {
            if (!req.query.guildId) {
                res.sendStatus(400);
            } else if (!req.user.guilds.find(g => g.id == req.query.guildId)) {
                res.sendStatus(403);
            } else {
                const channels = await service.getChannels(req.query.guildId);
                res.send(channels);
            }
        } else {
            res.sendStatus(403);
        }
    };

    const getUserGuilds = async (req, res) => {
        if (req.isAuthenticated() && req.user) {
            let guilds = await service.getUserGuilds(req.user);
            res.send(guilds);
        } else {
            res.sendStatus(403);
        }
    };

    const addBroadcastChannel = async (req, res) => {
        if (!req.body.guildId || !req.body.channelId) {
            res.sendStatus(400);
        } else if (req.isAuthenticated() && req.user && req.user.guilds.find(g => g.id == req.body.guildId)) {
            await service.addBroadcastChannel(req.body.guildId, req.body.channelId);
            res.sendStatus(200);
        } else {
            res.sendStatus(403);
        }
    };

    const toggleBroadcastCloseGames = async (req, res) => {
        if (!req.body.guildId || req.body.broadcastCloseGames == null || req.body.broadcastCloseGames == undefined) {
            res.sendStatus(400);
        } else if (req.isAuthenticated() && req.user && req.user.guilds.find(g => g.id == req.body.guildId)) {
            await service.toggleBroadcastCloseGames(req.body.guildId, req.body.broadcastCloseGames);
            res.sendStatus(200);
        } else {
            res.sendStatus(403);
        }
    };

    const toggleBroadcastAllFBSGames = async (req, res) => {
        if (!req.body.guildId || req.body.broadcastAllFBSGames == null || req.body.broadcastAllFBSGames == undefined) {
            res.sendStatus(400);
        } else if (req.isAuthenticated() && req.user && req.user.guilds.find(g => g.id == req.body.guildId)) {
            await service.toggleBroadcastAllFBSGames(req.body.guildId, req.body.broadcastAllFBSGames);
            res.sendStatus(200);
        } else {
            res.sendStatus(403);
        }
    };

    return {
        getChannels,
        getUserGuilds,
        addBroadcastChannel,
        toggleBroadcastCloseGames,
        toggleBroadcastAllFBSGames
    };
};
