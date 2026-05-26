const mumaker = require('mumaker');

const effects = {
  hacker:     { url: 'https://en.ephoto360.com/create-anonymous-hacker-avatars-cyan-neon-677.html', eg: 'Blacky' },
  graffiti:   { url: 'https://en.ephoto360.com/create-a-cartoon-style-graffiti-text-effect-online-668.html', eg: 'Black-merchant' },
  sand:       { url: 'https://en.ephoto360.com/write-names-and-messages-on-the-sand-online-582.html', eg: 'BLACK' },
  gold:       { url: 'https://en.ephoto360.com/golden-3d-text-effect-online-generator-399.html', eg: 'BLACKY' },
  arena:      { url: 'https://en.ephoto360.com/create-cover-arena-of-valor-by-mastering-360.html', eg: 'BLACK-BOT' },
  dragonball: { url: 'https://en.ephoto360.com/create-dragon-ball-style-text-effects-online-809.html', eg: 'Black-merchant' },
  naruto:     { url: 'https://en.ephoto360.com/naruto-shippuden-logo-style-text-effect-online-808.html', eg: 'Blacky' },
  child:      { url: 'https://en.ephoto360.com/create-colorful-kids-cute-3d-text-effect-online-803.html', eg: 'Blacky' },
  leaves:     { url: 'https://en.ephoto360.com/green-brush-text-effect-typography-maker-online-153.html', eg: 'BLACKMARCHANT-BOT' },
  '1917':     { url: 'https://en.ephoto360.com/1917-style-text-effect-523.html', eg: 'Black-merchant' },
  typography: { url: 'https://en.ephoto360.com/create-typography-text-effect-on-pavement-online-774.html', eg: 'Merchant' },
  purple:     { url: 'https://en.ephoto360.com/purple-text-effect-online-100.html', eg: 'Blacky' },
  neon:       { url: 'https://en.ephoto360.com/create-colorful-neon-light-text-effects-online-797.html', eg: 'Blacky' },
  noel:       { url: 'https://en.ephoto360.com/noel-text-effect-online-99.html', eg: 'Blacky' },
  metallic:   { url: 'https://en.ephoto360.com/metallic-gradient-text-effect-online-800.html', eg: 'BLACKY' },
  devil:      { url: 'https://en.ephoto360.com/neon-devil-wings-text-effect-online-683.html', eg: 'Blacky' },
  impressive: { url: 'https://en.ephoto360.com/create-3d-colorful-paint-text-effect-online-801.html', eg: 'BLACKY' },
  snow:       { url: 'https://en.ephoto360.com/create-a-snow-3d-text-effect-free-online-621.html', eg: 'BLACKY' },
  water:      { url: 'https://en.ephoto360.com/water-text-effect-online-96.html', eg: 'BLACKY' },
  thunder:    { url: 'https://en.ephoto360.com/thunder-text-effect-online-97.html', eg: 'STEVOH' },
  ice:        { url: 'https://en.ephoto360.com/ice-text-effect-online-101.html', eg: 'Nick' },
  matrix:     { url: 'https://en.ephoto360.com/matrix-text-effect-154.html', eg: 'myself' },
  silver:     { url: 'https://en.ephoto360.com/create-glossy-silver-3d-text-effect-online-802.html', eg: 'Nick' },
  silva:      { url: 'https://en.ephoto360.com/create-glossy-silver-3d-text-effect-online-802.html', eg: 'Nick' },
  light:      { url: 'https://en.ephoto360.com/light-text-effect-futuristic-technology-style-648.html', eg: 'myself' },
  cat:        { url: 'https://en.ephoto360.com/cat-text-effect-online-104.html', eg: 'Blacky' },
};

module.exports = {
  command: Object.keys(effects),
  handler: async (client, m, ctx) => {
    const { command, text, prefix } = ctx;
    const effect = effects[command];
    if (!effect) return;
    if (!text) return m.reply(`Example Usage: ${prefix}${command} ${effect.eg}`);
    try {
      m.reply("*Wait a moment...*");
      const result = await mumaker.ephoto(effect.url, text);
      return client.sendMessage(m.chat, { image: { url: result.image }, caption: `𝔊𝔢𝔫𝔢𝔯𝔞𝔱𝔢𝔡 𝔟𝔶>>>𝐁𝐋𝐀𝐂𝐊-𝐌𝐃` }, { quoted: m });
    } catch (e) { return m.reply("❌ Error: " + e.message); }
  }
};
