const JWTStrategy = require('passport-jwt').Strategy;

const cookieExtractor = (req) => { // eslint-disable-line
    return req && req.cookies ? req.cookies['jwt'] : null; // eslint-disable-line
};

module.exports = (passport) => {
    passport.use(new JWTStrategy({
        secretOrKey: process.env.JWT_SECRET,
        issuer: 'CFB Score Bot Admin',
        jwtFromRequest: cookieExtractor,
        passReqToCallback: true
    }, async (req, payload, done) => {
        try {
            done(null, {
                iat: payload.iat,
                id: payload.id,
                username: payload.username,
                guilds: payload.guilds
            });
        } catch (err) {
            done(err, null);
        }
    }));
};
