module.exports = (db, cfb) => {

  return {
    getScoreboard: async (req, res) => {
      let activeGames = await db.any(`SELECT id
                                        FROM game
                                        WHERE completed = false`);

      let scoreboard = await cfb.scoreboard.getScoreboard({
        groups: 80
      });

      let games = scoreboard
        .events
        .filter(e => !e.status.type.completed)
        .map(e => {
          let activeGame = activeGames.find(ag => ag.id == e.id);

          return {
            id: e.id,
            active: activeGame != null,
            name: e.name,
            date: e.date,
            homeLogo: e.competitions[0].competitors.find(c => c.homeAway === 'home').team.logo,
            awayLogo: e.competitions[0].competitors.find(c => c.homeAway === 'away').team.logo,
            homeRank: e.competitions[0].competitors.find(c => c.homeAway === 'home').curatedRank.current,
            awayRank: e.competitions[0].competitors.find(c => c.homeAway === 'away').curatedRank.current
          }
        }).sort((a, b) => {
          // let aMin = Math.min(a.homeRank == 0 ? 100 : a.homeRank, a.awayRank == 0 ? 100 : a.awayRank);
          // let bMin = Math.min(b.homeRank == 0 ? 100 : b.homeRank, b.awayRank == 0 ? 100 : b.awayRank);

          // if (aMin < bMin) {
          //   return -1;
          // } else if (bMin < aMin) {
          //   return 1;
          // } else {
            return a.date < b.date ? -1 : b.date < a.date ? 1 : 0;
          // }
        });

      res.send(games);
    },
    toggleGame: async (req, res) => {
      if (req.isAuthenticated() && req.user.isAdmin) {
        if (req.body.active) {
          let scoreboard = await cfb.scoreboard.getScoreboard({
            groups: 80
          });

          let scoreboardGame = scoreboard.events.find(e => e.id == req.body.id);
          let game = await cfb.games.getPlayByPlay(req.body.id);

          let status = scoreboardGame.status;
          let competitors = scoreboardGame.competitions[0].competitors;

          await db.none(`
            INSERT INTO game (id, completed, quarter, clock, home_score, away_score, videos)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
          `, [req.body.id, status.type.completed, status.period, status.displayClock, competitors[0].score, competitors[1].score, game.videos ? game.videos.length : 0]);
        } else {
          await db.none(`DELETE FROM game WHERE id = $1`, [req.body.id]);
        }
        res.sendStatus(200);
      } else {
        res.sendStatus(403);
      }
    }
  };
}
