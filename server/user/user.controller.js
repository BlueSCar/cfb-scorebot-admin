module.exports = (db, passport) => {
    const crypto = require('crypto');

    return {
        discordAuth: (req, res, next) => {
            req.session.state = crypto.randomBytes(32).toString('hex');
            passport.authenticate('discord', {
                state: req.session.state,
                duration: 'permanent'
            })(req, res, next);
        },
        discordAuthCallback: (req, res, next) => {
            passport.authenticate('discord', {
                successRedirect: '/',
                failureRedirect: '/'
            })(req, res, next);
        }
    };
}