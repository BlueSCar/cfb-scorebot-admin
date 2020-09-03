const cfb = require('cfb-data');

module.exports = (db) => {
    const getGames = async (guildId) => {
        const guildGames = await db.any('SELECT * FROM guild_game WHERE guild_id = $1',
            [
                guildId
            ]);
        let scoreboard = null;

        do {
            try {
                scoreboard = await cfb.scoreboard.getScoreboard({ // eslint-disable-line
                    groups: 80
                });
            } catch (err) {
                // do nothing
            }
        } while (!scoreboard);

        const games = scoreboard
            .events
            .filter(e => !e.status.type.completed && e.status.type.id != 6)
            .map((e) => {
                const activeGame = guildGames.find(ag => ag.game_id == e.id);

                return {
                    id: e.id,
                    active: activeGame != null,
                    name: e.name,
                    date: e.date,
                    homeLogo: e.competitions[0].competitors.find(c => c.homeAway === 'home').team.logo,
                    awayLogo: e.competitions[0].competitors.find(c => c.homeAway === 'away').team.logo,
                    homeRank: e.competitions[0].competitors.find(c => c.homeAway === 'home').curatedRank.current,
                    awayRank: e.competitions[0].competitors.find(c => c.homeAway === 'away').curatedRank.current
                };
            }).sort((a, b) => a.date < b.date ? -1 : b.date < a.date ? 1 : 0); // eslint-disable-line

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

    return {
        getGames,
        toggleGame
    };
};
