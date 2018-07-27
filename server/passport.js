module.exports = (passport, db) => {
    require('./strategies/discord')(passport, db);

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (id, done) {
        done(null, id);
    });
}