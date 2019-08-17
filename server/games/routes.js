const controllerConstructor = require('./controller');

module.exports = (app, auth, db) => {
    const controller = controllerConstructor(db);

    app.route('/api/games').get(auth, controller.getGames);
    app.route('/api/game/toggle').post(auth, controller.toggleGame);
};
