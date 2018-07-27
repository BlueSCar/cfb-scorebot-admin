module.exports = (app, db, passport) => {
    const controller = require('./user.controller')(db, passport);

    app.route('/auth/discord').get(controller.discordAuth);
    app.route('/auth/discord/callback').get(controller.discordAuthCallback);
}