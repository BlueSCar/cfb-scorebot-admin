const DiscordStrategy = require('passport-discord').Strategy;
const jwt = require('jsonwebtoken');

const adminPermission = 0x00000008;

module.exports = (passport) => {
    const appId = process.env.DISCORD_ID;
    const appSecret = process.env.DISCORD_SECRET;
    const webHost = process.env.WEB_HOST;

    passport.use(new DiscordStrategy({
        clientID: appId,
        clientSecret: appSecret,
        callbackURL: `http://${webHost}/auth/discord/callback`,
        scope: 'identify guilds',
        passReqToCallback: true
    }, (req, accessToken, refreshToken, profile, done) => {
        process.nextTick(async () => {
            const adminGuilds = profile.guilds.filter(g => (g.permissions & adminPermission) === adminPermission);

            const token = jwt.sign({
                id: profile.id,
                username: profile.username,
                guilds: adminGuilds
            }, process.env.JWT_SECRET, {
                issuer: 'CFB Score Bot Admin',
                subject: profile.username,
                audience: process.env.JWT_DOMAIN
            });

            return done(null, token);
        });
    }));
};
