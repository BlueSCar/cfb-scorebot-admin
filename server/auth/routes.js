const crypto = require('crypto');
const authController = require('./controller');

module.exports = (app, passport, auth) => {
    const controller = authController(passport, crypto);

    app.route('/auth').get(controller.authJwt);
    app.route('/auth/discord').get(controller.authDiscord);
    app.route('/auth/discord/callback').get(controller.authDiscordCallback, controller.addTokenToCookie);
    app.route('/api/profile').get(auth, controller.getProfile);
};
