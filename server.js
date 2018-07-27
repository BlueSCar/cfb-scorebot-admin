(async () => {
    require('dotenv').config();

    const port = process.env.PORT;

    const passport = require('passport');
    const cfb = require('cfb-data');
    const db = require('./server/database')(require('bluebird'), require('pg-promise'));
    require('./server/passport')(passport, db);
    const express = require('./server/express');
    const app = express(db, passport, cfb);

    app.listen(port, console.log(`Listening on port ${port}`));
})().catch(err => {
    err;
});