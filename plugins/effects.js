'use strict';

const api = 'https://apis.keithsite.top';

/**
 * Text/image effect commands — each hits a different style endpoint.
 * Pattern: .effect <text>  →  sends a styled image
 */
function makeEffect(command, endpointPath, label) {
  return {
    command: Array.isArray(command) ? command : [command],
    description: `Generate ${label} text effect`,
    category: 'effects',
    handler: async (client, m, { reply, text }) => {
      if (!text) return reply(`Provide text. E.g: .${Array.isArray(command) ? command[0] : command} Hello World`);
      await reply(`✨ _Generating ${label} effect..._`);
      try {
        const res = await global.axios.get(`${api}${endpointPath}`, {
          params: { text },
          responseType: 'arraybuffer',
          timeout: 30000
        });
        await client.sendMessage(m.chat, { image: Buffer.from(res.data), caption: `✨ *${label}*` }, { quoted: m });
      } catch (err) {
        reply(`❌ Failed to generate effect: ${err.message}`);
      }
    }
  };
}

module.exports = [

  makeEffect('metallic',   '/tools/text/metallic',   'Metallic'),
  makeEffect('ice',        '/tools/text/ice',         'Ice'),
  makeEffect('snow',       '/tools/text/snow',        'Snow'),
  makeEffect('impressive', '/tools/text/impressive',  'Impressive'),
  makeEffect('noel',       '/tools/text/noel',        'Noel'),
  makeEffect('matrix',     '/tools/text/matrix',      'Matrix'),
  makeEffect('light',      '/tools/text/light',       'Light'),
  makeEffect('neon',       '/tools/text/neon',        'Neon'),
  makeEffect(['silver', 'silva'],  '/tools/text/silver', 'Silver'),
  makeEffect('devil',      '/tools/text/devil',       'Devil'),
  makeEffect('typography', '/tools/text/typography',  'Typography'),
  makeEffect('purple',     '/tools/text/purple',      'Purple'),
  makeEffect('thunder',    '/tools/text/thunder',     'Thunder'),
  makeEffect('leaves',     '/tools/text/leaves',      'Leaves'),
  makeEffect('1917',       '/tools/text/1917',        '1917'),
  makeEffect('arena',      '/tools/text/arena',       'Arena'),
  makeEffect('hacker',     '/tools/text/hacker',      'Hacker'),
  makeEffect('sand',       '/tools/text/sand',        'Sand'),
  makeEffect('dragonball', '/tools/text/dragonball',  'DragonBall'),
  makeEffect('naruto',     '/tools/text/naruto',      'Naruto'),
  makeEffect('graffiti',   '/tools/text/graffiti',    'Graffiti'),
  makeEffect('cat',        '/tools/text/cat',         'Cat'),
  makeEffect('gold',       '/tools/text/gold',        'Gold'),
  makeEffect('child',      '/tools/text/child',       'Child'),
  makeEffect(['blue', 'blizzards'], '/tools/text/blue', 'Blue Blizzard'),
  makeEffect('carbon',     '/tools/carbon',           'Carbon Code'),
  makeEffect('attp',       '/tools/text/attp',        'ATTP Sticker'),

  {
    command: ['smeme'],
    description: 'Create a meme from a quoted image',
    category: 'effects',
    handler: async (client, m, { reply, text, quoted, mime }) => {
      if (!quoted) return reply('Quote an image to create a meme. E.g: .smeme Top text | Bottom text');
      if (!/image/.test(mime)) return reply('Quote an *image* to create a meme.');
      if (!text) return reply('Provide meme text. E.g: .smeme Top text | Bottom text');
      const [top, bottom] = text.split('|').map(t => t.trim());
      await reply('😂 _Generating meme..._');
      const buf = await client.downloadMediaMessage(quoted);
      const FormData = require('form-data');
      const form = new FormData();
      form.append('image', buf, { filename: 'image.jpg', contentType: 'image/jpeg' });
      form.append('top', top || '');
      form.append('bottom', bottom || '');
      const res = await global.axios.post(`${api}/tools/meme`, form, {
        headers: form.getHeaders(),
        responseType: 'arraybuffer',
        timeout: 30000
      });
      await client.sendMessage(m.chat, { image: Buffer.from(res.data), caption: '😂 *Meme Generated*' }, { quoted: m });
    }
  },

  {
    command: ['img3'],
    description: 'Generate image (3rd model)',
    category: 'effects',
    handler: async (client, m, { reply, text }) => {
      if (!text) return reply('Provide a prompt. E.g: .img3 a wolf howling at the moon');
      await reply('🎨 _Generating image..._');
      const res = await global.axios.get(`${api}/api/ai/image3`, {
        params: { prompt: text },
        responseType: 'arraybuffer',
        timeout: 60000
      });
      await client.sendMessage(m.chat, { image: Buffer.from(res.data), caption: `🎨 *Generated:* ${text}` }, { quoted: m });
    }
  },

];
