module.exports = (db, cfb) => {
    const getGames = async (guildId) => {
        const guildGames = await db.any('SELECT * FROM guild_game WHERE guild_id = $1',
            [
                guildId
            ]);
        let scoreboard = await cfb.any(`
        WITH this_week AS (
            SELECT DISTINCT season, season_type, week
            FROM game
            WHERE start_date > (now() - interval '10h')
            ORDER BY season, season_type DESC, week
            LIMIT 1
        )
        SELECT g.id, g.start_date, g.neutral_site, t.id AS home_id, t.display_name AS home_team, pr.rank AS home_rank, c.name AS home_conference, t2.id AS away_id, t2.display_name AS away_team, pr2.rank AS away_rank, c2.name AS away_conference
        FROM game AS g
            INNER JOIN this_week AS tw ON g.season = tw.season AND g.week = tw.week AND g.season_type = tw.season_type
            INNER JOIN game_team AS gt ON g.id = gt.game_id AND gt.home_away = 'home'
            INNER JOIN team AS t ON gt.team_id = t.id
            INNER JOIN game_team AS gt2 ON g.id = gt2.game_id AND gt.id <> gt2.id
            INNER JOIN team AS t2 ON gt2.team_id = t2.id
            LEFT JOIN poll AS p ON p.season = g.season AND p.week = g.week AND p.season_type = g.season_type AND p.poll_type_id = 1
            LEFT JOIN poll_rank AS pr ON p.id = pr.poll_id AND t.id = pr.team_id
            LEFT JOIN poll_rank AS pr2 ON p.id = pr2.poll_id AND t2.id = pr2.team_id
            LEFT JOIN conference_team AS ct ON t.id = ct.team_id AND ct.start_year <= g.season AND (ct.end_year IS NULL OR ct.end_year >= g.season)
            LEFT JOIN conference AS c ON ct.conference_id = c.id
            LEFT JOIN conference_team AS ct2 ON t2.id = ct2.team_id AND ct2.start_year <= g.season AND (ct2.end_year IS NULL OR ct2.end_year >= g.season)
            LEFT JOIN conference AS c2 ON ct2.conference_id = c2.id
        WHERE g.start_date > (now() - interval '10h') AND (gt.points IS NULL OR gt2.points IS NULL) AND (c.division = 'fbs' or c2.division = 'fbs')
        ORDER BY start_date
        `);

        const games = scoreboard
            .map((e) => {
                const activeGame = guildGames.find(ag => ag.game_id == e.id);

                return {
                    id: e.id,
                    active: activeGame != null,
                    name: `${e.away_team} ${e.neutral_site ? 'vs' : 'at'} ${e.home_team}`,
                    date: e.start_date,
                    homeTeam: e.home_team,
                    awayTeam: e.away_team,
                    homeLogo: `https://collegefootballdata.com/logos/${e.home_id}.png`,
                    awayLogo: `https://collegefootballdata.com/logos/${e.away_id}.png`,
                    homeConference: e.home_conference,
                    homeRank: e.home_rank,
                    awayConference: e.away_conference,
                    awayRank: e.away_rank
                };
            }); // eslint-disable-line

        return games;
    };

    const toggleGame = async (guildId, gameId, active) => {
        const existing = await db.oneOrNone('SELECT * FROM guild_game WHERE guild_id = $1 AND game_id = $2', [guildId, gameId]);

        if (existing && !active) {
            await db.none('DELETE FROM guild_game WHERE id = $1', [existing.id]);
        } else if (!existing && active) {
            await db.none('INSERT INTO guild_game (guild_id, game_id) VALUES ($1, $2)', [guildId, gameId]);
        }
    };

    const toggleAllGames = async (guildId) => {
        if (!/^\d+$/.test(guildId) || !parseInt(guildId)) {
            return;
        }

        let games = await cfb.any(`
        WITH this_week AS (
            SELECT DISTINCT season, season_type, week
            FROM game
            WHERE start_date > (now() - interval '10h')
            ORDER BY season, season_type DESC, week
            LIMIT 1
        )
        SELECT g.id
        FROM game AS g
            INNER JOIN this_week AS tw ON g.season = tw.season AND g.week = tw.week AND g.season_type = tw.season_type
            INNER JOIN game_team AS gt ON g.id = gt.game_id AND gt.home_away = 'home'
            INNER JOIN team AS t ON gt.team_id = t.id
            INNER JOIN game_team AS gt2 ON g.id = gt2.game_id AND gt.id <> gt2.id
            INNER JOIN team AS t2 ON gt2.team_id = t2.id
            LEFT JOIN conference_team AS ct ON t.id = ct.team_id AND ct.start_year <= g.season AND (ct.end_year IS NULL OR ct.end_year >= g.season)
            LEFT JOIN conference AS c ON ct.conference_id = c.id
            LEFT JOIN conference_team AS ct2 ON t2.id = ct2.team_id AND ct2.start_year <= g.season AND (ct2.end_year IS NULL OR ct2.end_year >= g.season)
            LEFT JOIN conference AS c2 ON ct2.conference_id = c2.id
        WHERE c.division = 'fbs' OR c2.division = 'fbs'
        `);

        let existing = await db.any('SELECT game_id FROM guild_game WHERE guild_id = $1 AND game_id IN ($2:csv)', [guildId, games.map(g => g.id)]);
        let inserts = games.filter(g => !existing.find(e => e.game_id == g.id)).map(g => `(${guildId},${g.id})`);

        await db.none(`INSERT INTO guild_game (guild_id, game_id) VALUES ` + inserts.join(', '));
    };

    return {
        getGames,
        toggleGame,
        toggleAllGames
    };
};
