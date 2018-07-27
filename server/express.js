const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const session = require('cookie-session');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

const bundle = require('../dist/server.bundle.js');
const renderer = require('vue-server-renderer').createRenderer({
  template: fs.readFileSync('./index.html', 'utf-8')
});

const team = process.env.TEAM;
const sessionSecret = process.env.SESSION_SECRET;
const host = process.env.HOST;
const port = process.env.PORT;

module.exports = (db, passport, cfb) => {
  const app = express();
  app.use(helmet());

  app.use('/dist', express.static(path.join(__dirname, '../dist')));

  app.enable('trust proxy');
  app.use(cookieParser());

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(session({
    name: 'session',
    secret: sessionSecret,
    maxAge: 7 * 24 * 60 * 60 * 1000
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  // routes config
  require('./user/user.routes')(app, db, passport);
  require('./games/games.routes')(app, db, cfb);

  app.get('*', (req, res) => {

    if (!req.isAuthenticated()) {
      res.redirect(`http://${host}/auth/discord`)
    }

    bundle.default({
      url: req.url
    }).then((app) => {
      const context = {
        title: `CFB Score Bot Admin`,
        meta: `
            <meta description="cfb scores admin">
        `
      };

      renderer.renderToString(app, context, function (err, html) {
        if (err) {
          if (err.code === 404) {
            res.status(404).end('Page not found')
          } else {
            res.status(500).end('Internal Server Error')
          }
        } else {
          res.send(html)
        }
      });
    }, (err) => {
      console.log(err);
    });
  });

  return app;
}
