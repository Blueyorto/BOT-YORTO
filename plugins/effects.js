'use strict';

const mumaker = require('mumaker');
const fetch = require('node-fetch');

/**
 * Text effect commands using mumaker.ephoto() + ephoto360.com
 */
function makeEffect(command, url, label) {
  return {
    command: Array.isArray(command) ? command : [command],
    description: `Generate ${label} text effect`,
    category: 'effects',
    handler: async (client, m, { reply, text, prefix }) => {
      const cmd = Array.isArray(command) ? command[0] : command;
      if (!text) return reply(`Example: ${prefix}${cmd} YourText`);
      try {
        m.reply('*Wait a moment...*');
        const result = await mumaker.ephoto(url, text);
        await client.sendMessage(m.chat, {
          image: { url: result.image },
          caption: `𝔊𝔢𝔫𝔢𝔯𝔞𝔱𝔢𝔡 𝔟𝔶>>>𝐁𝐋𝐀𝐂𝐊-𝐌𝐃`
        }, { quoted: m });
      } catch (err) {
        m.reply(err.message || 'Failed to generate effect.');
      }
    }
  };
}

module.exports = [

  makeEffect('metallic',   'https://en.ephoto360.com/impressive-decorative-3d-metal-text-effect-798.html',         'Metallic'),
  makeEffect('ice',        'https://en.ephoto360.com/ice-text-effect-online-101.html',                              'Ice'),
  makeEffect('snow',       'https://en.ephoto360.com/create-a-snow-3d-text-effect-free-online-621.html',           'Snow'),
  makeEffect('impressive', 'https://en.ephoto360.com/create-3d-colorful-paint-text-effect-online-801.html',        'Impressive'),
  makeEffect('noel',       'https://en.ephoto360.com/noel-text-effect-online-99.html',                             'Noel'),
  makeEffect('matrix',     'https://en.ephoto360.com/matrix-text-effect-154.html',                                 'Matrix'),
  makeEffect('light',      'https://en.ephoto360.com/light-text-effect-futuristic-technology-style-648.html',      'Light'),
  makeEffect('neon',       'https://en.ephoto360.com/create-colorful-neon-light-text-effects-online-797.html',     'Neon'),
  makeEffect(['silver', 'silva'],  'https://en.ephoto360.com/create-glossy-silver-3d-text-effect-online-802.html','Silver'),
  makeEffect('devil',      'https://en.ephoto360.com/neon-devil-wings-text-effect-online-683.html',                'Devil'),
  makeEffect('typography', 'https://en.ephoto360.com/create-typography-text-effect-on-pavement-online-774.html',  'Typography'),
  makeEffect('purple',     'https://en.ephoto360.com/purple-text-effect-online-100.html',                          'Purple'),
  makeEffect('thunder',    'https://en.ephoto360.com/thunder-text-effect-online-97.html',                          'Thunder'),
  makeEffect('leaves',     'https://en.ephoto360.com/green-brush-text-effect-typography-maker-online-153.html',   'Leaves'),
  makeEffect('1917',       'https://en.ephoto360.com/1917-style-text-effect-523.html',                             '1917'),
  makeEffect('arena',      'https://en.ephoto360.com/create-cover-arena-of-valor-by-mastering-360.html',          'Arena'),
  makeEffect('hacker',     'https://en.ephoto360.com/create-anonymous-hacker-avatars-cyan-neon-677.html',         'Hacker'),
  makeEffect('sand',       'https://en.ephoto360.com/write-names-and-messages-on-the-sand-online-582.html',       'Sand'),
  makeEffect('dragonball', 'https://en.ephoto360.com/create-dragon-ball-style-text-effects-online-809.html',      'DragonBall'),
  makeEffect('naruto',     'https://en.ephoto360.com/naruto-shippuden-logo-style-text-effect-online-808.html',    'Naruto'),
  makeEffect('graffiti',   'https://en.ephoto360.com/create-a-cartoon-style-graffiti-text-effect-online-668.html','Graffiti'),
  makeEffect('cat',        'https://en.ephoto360.com/handwritten-text-on-foggy-glass-online-680.html',            'Cat (Foggy Glass)'),
  makeEffect('gold',       'https://en.ephoto360.com/modern-gold-4-213.html',                                     'Gold'),
  makeEffect('child',      'https://en.ephoto360.com/write-text-on-wet-glass-online-589.html',                    'Child (Wet Glass)'),

  // ── ATTP — animated sticker via lolhuman API ─────────────────────────────
  {
    command: ['attp'],
    description: 'Animated text sticker',
    category: 'effects',
    handler: async (client, m, { reply, q }) => {
      if (!q) return reply('Provide text. E.g: .attp Hello World');
      client.sendMessage(m.chat, {
        sticker: { url: `https://api.lolhuman.xyz/api/attp?apikey=cde5404984da80591a2692b6&text=${encodeURIComponent(q)}` }
      }, { quoted: m });
    }
  },

  // ── Carbon — code screenshot via carbonara ───────────────────────────────
  {
    command: ['carbon'],
    description: 'Turn code into a carbon screenshot',
    category: 'effects',
    handler: async (client, m, { reply }) => {
      if (!m.quoted || !m.quoted.text) return reply('Quote a code message to convert to carbon image.');
      try {
        const response = await fetch('https://carbonara.solopov.dev/api/cook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: m.quoted.text, backgroundColor: '#1F816D' }),
        });
        if (!response.ok) return m.reply('API failed to fetch a valid response.');
        const buffer = await response.buffer();
        await client.sendMessage(m.chat, {
          image: buffer,
          caption: `𝗖𝗢𝗡𝗩𝗘𝗥𝗧𝗘𝗗 𝗕𝗬 𝐁𝐋𝐀𝐂𝐊-𝐌𝐃`
        }, { quoted: m });
      } catch (err) {
        m.reply('❌ Carbon failed: ' + err.message);
      }
    }
  },

  // ── Blue/Blizzards — advertisement info ──────────────────────────────────
  {
    command: ['blue', 'blizzards'],
    description: 'BlueBlizzards services info',
    category: 'effects',
    handler: async (client, m) => {
      const menu =
        '*💙 BLUEBLIZZARDS — Premium Services*\n' +
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n' +
        '🤖 *BOT SHOP*\n' +
        '▸ Anti-ban • Auto-reply • Multi-device\n' +
        '▸ Basic: $1 | Pro: $4 | Ultimate: $10\n' +
        '🔗 https://bot.blueblizzards.site\n\n' +
        '🚀 *DEPLOYMENT*\n' +
        '▸ 5-min setup • DDoS protection\n' +
        '▸ Quick: ksh100/mo | Custom: ksh500/mo\n' +
        '🔗 https://bot.blueblizzards.site\n\n' +
        '📊 *TRADING*\n' +
        '▸ AI signals • 1:500 leverage • 0.1% fees\n' +
        '▸ Crypto & Forex\n' +
        '🔗 https://blueblizzards.site\n\n' +
        '🎬 *FREE FLIX*\n' +
        '▸ 10,000+ titles • HD/4K • Ad-free\n' +
        '🔗 https://freeflix.blueblizzards.site\n\n' +
        '💰 *AFFILIATE PROGRAM*\n' +
        '▸ Earn 30% recurring commission\n' +
        '▸ Daily payouts\n' +
        '🔗 https://blueblizzards.site/affiliate\n\n' +
        '📞 *SUPPORT — 24/7*\n' +
        '🔗 https://blueblizzards.site';
      m.reply(menu);
    }
  },

];
