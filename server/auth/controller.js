module.exports = (passport, crypto) => ({
    authJwt: passport.authenticate('jwt', {
        session: false,
        successRedirect: '/',
        failureRedirect: '/'
    }),
    addTokenToCookie: (req, res) => {
        res.cookie('jwt', req.account ? req.account : req.user, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            domain: process.env.JWT_DOMAIN,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.redirect('/auth');
    },
    authDiscord: (req, res, next) => {
        req.logout();
        passport.authenticate('discord', {
            state: crypto.randomBytes(32).toString('hex'),
            session: false,
            duration: 'permanent'
        })(req, res, next);
    },
    authDiscordCallback: passport.authenticate('discord', {
        session: false,
        failureRedirect: '/'
    }),
    getProfile: (req, res) => {
        if (req.isAuthenticated() && req.user) {
            res.send(req.user);
        } else {
            res.send(null);
        }
    }
});
