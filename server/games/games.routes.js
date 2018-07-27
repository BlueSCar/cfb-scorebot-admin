module.exports = (app, db, cfb) => {
    const controller = require('./games.controller')(db, cfb);

    app.route('/api/games').get(controller.getScoreboard);
    app.route('/api/game/toggle').post(controller.toggleGame);
}