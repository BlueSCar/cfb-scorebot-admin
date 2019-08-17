const serviceConstructor = require('./service');

module.exports = (db) => {
    const service = serviceConstructor(db);

    const getGames = async (req, res) => {
        if (!req.query.guildId) {
            res.sendStatus(400);
        } else if (req.isAuthenticated() && req.user && req.user.guilds.find(g => g.id == req.query.guildId)) {
            const games = await service.getGames(req.query.guildId);
            res.send(games);
        } else {
            res.sendStatus(403);
        }
    };

    const toggleGame = async (req, res) => {
        if (!req.body.guildId || !req.body.gameId) {
            res.sendStatus(400);
        } else if (req.isAuthenticated() && req.user && req.user.guilds.find(g => g.id == req.body.guildId)) {
            await service.toggleGame(req.body.guildId, req.body.gameId, req.body.active);
            res.sendStatus(200);
        } else {
            res.sendStatus(403);
        }
    };

    return {
        getGames,
        toggleGame
    };
};
