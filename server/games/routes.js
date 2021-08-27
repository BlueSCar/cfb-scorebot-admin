const controllerConstructor = require('./controller');

module.exports = (app, auth, db, cfb) => {
    const controller = controllerConstructor(db, cfb);

    app.route('/api/games').get(auth, controller.getGames);
    app.route('/api/game/toggle').post(auth, controller.toggleGame);
    app.route('/api/games/all').post(auth, controller.toggleAllGames);
};
