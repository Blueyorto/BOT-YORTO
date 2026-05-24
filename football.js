const axios = require('axios');
const api = 'https://apis.keithsite.top';

module.exports = {
  command: ['epl', 'premierleague', 'laliga', 'bundesliga', 'ligue1', 'seriea', 'ucl', 'fifa', 'euro', 'eplscorers', 'laligascorers', 'bundesligascorers', 'serieascorers', 'ligue1scorers', 'uclscorers'],
  handler: async (client, m, ctx) => {
    const { command } = ctx;

    const standingsMap = {
      epl: { path: 'epl/standings', title: '📊 *Premier League Standings*', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
      premierleague: { path: 'epl/standings', title: '📊 *Premier League Standings*', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
      laliga: { path: 'laliga/standings', title: '📊 *La Liga Standings*', flag: '🇪🇸' },
      bundesliga: { path: 'bundesliga/standings', title: '📊 *Bundesliga Standings*', flag: '🇩🇪' },
      ligue1: { path: 'ligue1/standings', title: '📊 *Ligue 1 Standings*', flag: '🇫🇷' },
      seriea: { path: 'seriea/standings', title: '📊 *Serie A Standings*', flag: '🇮🇹' },
      ucl: { path: 'ucl/standings', title: '🏆 *UCL Standings*', flag: '⭐' },
      fifa: { path: 'fifa/standings', title: '🌍 *FIFA Rankings*', flag: '🌍' },
      euro: { path: 'euros/standings', title: '🇪🇺 *Euro Standings*', flag: '🇪🇺' }
    };

    const scorersMap = {
      eplscorers: { path: 'epl/scorers', title: '⚽ *Premier League Top Scorers*' },
      laligascorers: { path: 'laliga/scorers', title: '⚽ *La Liga Top Scorers*' },
      bundesligascorers: { path: 'bundesliga/scorers', title: '⚽ *Bundesliga Top Scorers*' },
      serieascorers: { path: 'seriea/scorers', title: '⚽ *Serie A Top Scorers*' },
      ligue1scorers: { path: 'ligue1/scorers', title: '⚽ *Ligue 1 Top Scorers*' },
      uclscorers: { path: 'ucl/scorers', title: '🏆 *UCL Top Scorers*' }
    };

    if (standingsMap[command]) {
      const { path, title, flag } = standingsMap[command];
      try {
        const res = await axios.get(`${api}/${path}`, { timeout: 15000 });
        const data = res.data;
        if (!data?.result?.standings?.length) return m.reply(`❌ Failed to fetch ${title}.`);
        let text = `${title}\n\n`;
        for (const t of data.result.standings) {
          let tag = flag;
          if (command === 'epl' || command === 'premierleague') {
            if (t.position <= 4) tag = '🏆';
            else if (t.position <= 6) tag = '🥈';
            else if (t.position >= 18) tag = '⚠️';
            else tag = '🧱';
            text += `${tag} *${t.position}. ${t.team}*\nP:${t.played} W:${t.won} D:${t.draw} L:${t.lost} Pts:${t.points} GD:${t.goalDifference}\n\n`;
          } else {
            text += `${flag} ${t.position}. ${t.team} - ${t.points} pts\n`;
          }
        }
        return m.reply(text);
      } catch { return m.reply(`❌ Error fetching ${title}.`); }
    }

    if (scorersMap[command]) {
      const { path, title } = scorersMap[command];
      try {
        await client.sendMessage(m.chat, { react: { text: "⚽", key: m.key } });
        const res = await axios.get(`${api}/${path}`, { timeout: 15000 });
        const data = res.data;
        const scorers = data?.result?.topScorers;
        if (!scorers?.length) return m.reply(`❌ Failed to fetch scorers.`);
        let text = `${title}\n\n`;
        scorers.slice(0, 10).forEach(s => {
          const medal = s.rank == 1 ? "🥇" : s.rank == 2 ? "🥈" : s.rank == 3 ? "🥉" : "⚽";
          if (command === 'eplscorers') {
            text += `${medal} *${s.rank}. ${s.player}* (${s.team})\nGoals: ${s.goals} | Assists: ${s.assists}\nPenalties: ${s.penalties}\n\n`;
          } else {
            text += `${medal} ${s.rank}. ${s.player}${s.team ? ` (${s.team})` : ''} - ${s.goals}⚽\n`;
          }
        });
        return m.reply(text);
      } catch { return m.reply(`❌ Error fetching scorers.`); }
    }
  }
};
