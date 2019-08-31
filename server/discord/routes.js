const discordController = require('./controller');

module.exports = async (app, auth, db) => {
    const controller = await discordController(db);
    app.route('/api/discord/channels').get(auth, controller.getChannels);
    app.route('/api/discord/guilds').get(auth, controller.getUserGuilds);
    app.route('/api/discord/channel').post(auth, controller.addBroadcastChannel);
    app.route('/api/discord/closegames/toggle').post(auth, controller.toggleBroadcastCloseGames);
};
