const DiscordStrategy = require('passport-discord');
const appId = process.env.DISCORD_APP_ID;
const secret = process.env.DISCORD_SECRET;
const host = process.env.HOST;
const port = process.env.PORT;
const guildId = process.env.GUILD_ID;
const adminPermission = 0x00000008;

module.exports = (passport, db) => {
    passport.use(new DiscordStrategy({
        clientID: appId,
        clientSecret: secret,
        callbackURL: `http://${host}/auth/discord/callback`,
        scope: 'identify guilds',
        passReqToCallback: true
    }, (req, accessToken, refreshToken, profile, done) => {
        process.nextTick(() => {
            // TODO: persist stuff to the database
            let guildMember = profile.guilds.find(g => g.id == guildId);
            let isAdmin = false;
            if (guildMember){
                isAdmin = (guildMember.permissions & adminPermission) == adminPermission;
            }
            
            return done(null, {
                isAdmin,
                profile
            });
        });
    }));
}