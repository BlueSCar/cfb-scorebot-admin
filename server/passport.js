const jwtStrategy = require('./strategies/jwt');
const discordStrategy = require('./strategies/discord');

module.exports = (passport, db) => {
    jwtStrategy(passport, db);
    discordStrategy(passport, db);
};
