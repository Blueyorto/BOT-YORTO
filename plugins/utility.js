'use strict';

const api = 'https://apis.keithsite.top';

module.exports = [

  {
    command: ['ping', 'speed'],
    description: 'Check bot response speed',
    category: 'utility',
    handler: async (client, m, { reply }) => {
      const start = Date.now();
      await reply('🏓 Pong');
      const end = Date.now();
      m.reply(`🏓 *Pong*\n⚡ Speed: *${end - start}ms*`);
    }
  },

  {
    command: ['uptime', 'runtime'],
    description: 'Check bot uptime',
    category: 'utility',
    handler: async (client, m, { reply }) => {
      const { runtime } = require('../lib/ravenfunc');
      m.reply(runtime(process.uptime()));
    }
  },

  {
    command: ['owner'],
    description: 'Get owner contact',
    category: 'utility',
    handler: async (client, m) => {
      const { dev } = require('../set');
      const owners = dev.split(',');
      client.sendContact(m.chat, owners, m);
    }
  },

  {
    command: ['advice'],
    description: 'Get a random piece of advice',
    category: 'utility',
    handler: async (client, m) => {
      const advice = require('badadvice');
      m.reply(advice());
    }
  },

  {
    command: ['lyrics'],
    description: 'Get song lyrics',
    category: 'utility',
    handler: async (client, m, { reply, text }) => {
      if (!text) return reply('Provide a song name. E.g: .lyrics Shape of You');
      await reply('🎵 _Searching lyrics..._');
      const Genius = require('genius-lyrics');
      const Client = new Genius.Client('TUoAEhL79JJyU-MpOsBDkFhJFWFH28nv6dgVgPA-9R1YRwLNP_zicdX2omG2qKE8gYLJat5F5VSBNLfdnlpfJg');
      try {
        const searches = await Client.songs.search(text);
        if (!searches.length) return reply(`❌ No lyrics found for: *${text}*`);
        const song = searches[0];
        const lyricsText = await song.lyrics();
        const output = `🎵 *${song.title}* — ${song.artist.name}\n\n${lyricsText}`;
        if (output.length > 4000) {
          return m.reply(output.slice(0, 4000) + '\n\n_[Lyrics truncated]_');
        }
        m.reply(output);
      } catch (e) {
        reply('❌ Could not fetch lyrics: ' + e.message);
      }
    }
  },

  {
    command: ['bible'],
    description: 'Get a Bible verse',
    category: 'utility',
    handler: async (client, m, { reply, text }) => {
      if (!text) return reply('Provide a verse. E.g: .bible John 3:16');
      await reply('📖 _Fetching verse..._');
      const res = await global.axios.get(`https://bible-api.com/${encodeURIComponent(text)}`);
      if (!res.data || res.data.error) return reply('❌ Verse not found. Try: .bible John 3:16');
      const v = res.data;
      m.reply(`📖 *${v.reference}*\n\n${v.text.trim()}\n\n_— ${v.translation_name}_`);
    }
  },

  {
    command: ['quran'],
    description: 'Get a Quran verse',
    category: 'utility',
    handler: async (client, m, { reply, text }) => {
      if (!text) return reply('Provide a verse. E.g: .quran 1:1');
      await reply('📖 _Fetching verse..._');
      const [surah, ayah] = text.split(':');
      const res = await global.axios.get(`https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/en.asad`);
      const data = res.data?.data;
      if (!data) return reply('❌ Verse not found. Try: .quran 1:1');
      m.reply(`☪️ *Surah ${data.surah.englishName} (${data.surah.name}) — Ayah ${data.numberInSurah}*\n\n${data.text}\n\n_— Translation: Muhammad Asad_`);
    }
  },

  {
    command: ['google'],
    description: 'Google search',
    category: 'utility',
    handler: async (client, m, { reply, text }) => {
      if (!text) return reply('Provide a search query. E.g: .google what is AI');
      await reply('🔍 _Searching..._');
      const res = await global.axios.get(`${api}/search/google`, { params: { q: text } });
      const results = res.data?.result || res.data?.results;
      if (!results || !results.length) return reply('❌ No results found.');
      let txt = `🔍 *Google: ${text}*\n\n`;
      for (let i = 0; i < Math.min(results.length, 5); i++) {
        const r = results[i];
        txt += `*${i + 1}. ${r.title}*\n${r.description || ''}\n🔗 ${r.url || ''}\n\n`;
      }
      m.reply(txt.trim());
    }
  },

  {
    command: ['tts', 'say'],
    description: 'Text to speech',
    category: 'utility',
    handler: async (client, m, { reply, text }) => {
      if (!text) return reply('Provide text to convert to speech. E.g: .tts Hello World');
      await reply('🎙️ _Converting text to speech..._');
      const googleTTS = require('google-tts-api');
      const url = googleTTS.getAudioUrl(text, { lang: 'en', slow: false });
      await client.sendMessage(m.chat, { audio: { url }, mimetype: 'audio/ogg; codecs=opus', ptt: true }, { quoted: m });
    }
  },

  {
    command: ['weather'],
    description: 'Get weather for a location',
    category: 'utility',
    handler: async (client, m, { reply, text }) => {
      if (!text) return reply('Provide a location. E.g: .weather Nairobi');
      await reply('🌤️ _Fetching weather..._');
      const res = await global.axios.get(`${api}/tools/weather`, { params: { city: text } });
      const data = res.data?.result || res.data;
      if (!data) return reply('❌ Could not find weather for that location.');
      m.reply(typeof data === 'string' ? data : JSON.stringify(data, null, 2));
    }
  },

  {
    command: ['calculate', 'calc'],
    description: 'Calculate a math expression',
    category: 'utility',
    handler: async (client, m, { reply, text }) => {
      if (!text) return reply('Provide a math expression. E.g: .calc 2 + 2');
      try {
        const result = eval(text.replace(/[^0-9+\-*/().\s%^]/g, ''));
        m.reply(`🧮 *${text}*\n= *${result}*`);
      } catch {
        reply('❌ Invalid expression. E.g: .calc 2 + 2 * 5');
      }
    }
  },

  {
    command: ['trt', 'translate'],
    description: 'Translate text',
    category: 'utility',
    handler: async (client, m, { reply, text, args }) => {
      if (!text) return reply('Provide target language and text.\nE.g: .translate fr Hello how are you\nLanguage codes: fr=French, es=Spanish, sw=Swahili, ar=Arabic');
      const lang = args[0];
      const content = args.slice(1).join(' ');
      if (!content) return reply('Provide text after the language code.\nE.g: .translate sw Hello');
      await reply('🌍 _Translating..._');
      const res = await global.axios.get(`${api}/tools/translate`, { params: { text: content, lang } });
      const result = res.data?.result || res.data?.translated;
      if (!result) return reply('❌ Translation failed. Check your language code.');
      m.reply(`🌍 *Translation (${lang}):*\n\n${result}`);
    }
  },

  {
    command: ['define'],
    description: 'Define a word',
    category: 'utility',
    handler: async (client, m, { reply, text }) => {
      if (!text) return reply('Provide a word to define. E.g: .define serendipity');
      await reply('📚 _Looking up definition..._');
      const res = await global.axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(text)}`);
      const data = res.data?.[0];
      if (!data) return reply(`❌ No definition found for: *${text}*`);
      const meaning = data.meanings?.[0];
      const def = meaning?.definitions?.[0];
      let txt = `📚 *${data.word}*`;
      if (data.phonetic) txt += ` _(${data.phonetic})_`;
      txt += `\n\n*${meaning.partOfSpeech}*\n${def.definition}`;
      if (def.example) txt += `\n\n_"${def.example}"_`;
      m.reply(txt);
    }
  },

  {
    command: ['zodiac'],
    description: 'Get zodiac sign info',
    category: 'utility',
    handler: async (client, m, { reply, text }) => {
      if (!text) return reply('Provide your zodiac sign. E.g: .zodiac aries');
      await reply('♈ _Fetching zodiac info..._');
      const res = await global.axios.get(`${api}/fun/zodiac`, { params: { sign: text.toLowerCase() } });
      const data = res.data?.result || res.data;
      if (!data) return reply('❌ Invalid zodiac sign. Try: aries, taurus, gemini, cancer, leo, virgo, libra, scorpio, sagittarius, capricorn, aquarius, pisces');
      m.reply(typeof data === 'string' ? data : JSON.stringify(data, null, 2));
    }
  },

  {
    command: ['joke'],
    description: 'Get a random joke',
    category: 'utility',
    handler: async (client, m) => {
      const res = await global.axios.get('https://official-joke-api.appspot.com/random_joke');
      m.reply(`😂 *${res.data.setup}*\n\n${res.data.punchline}`);
    }
  },

  {
    command: ['quotes'],
    description: 'Get an inspirational quote',
    category: 'utility',
    handler: async (client, m) => {
      const res = await global.axios.get('https://api.quotable.io/random');
      m.reply(`💬 *"${res.data.content}"*\n\n— _${res.data.author}_`);
    }
  },

  {
    command: ['pickupline'],
    description: 'Get a random pickup line',
    category: 'utility',
    handler: async (client, m) => {
      const res = await global.axios.get('https://api.jcwyt.com/pickup');
      m.reply(`💘 ${res.data?.pickup || res.data}`);
    }
  },

  {
    command: ['save'],
    description: 'Save a quoted message to bot DM',
    category: 'utility',
    handler: async (client, m, { reply }) => {
      if (!m.quoted) return reply('Quote a message to save.');
      const q = m.quoted;
      if (q.text) {
        await client.sendMessage(client.user.id, { text: `📌 Saved:\n\n${q.text}` });
      } else if (q.msg?.mimetype) {
        const buf = await client.downloadMediaMessage(q);
        const mime = q.msg.mimetype;
        if (/image/.test(mime)) await client.sendMessage(client.user.id, { image: buf, caption: '📌 Saved image' });
        else if (/video/.test(mime)) await client.sendMessage(client.user.id, { video: buf, caption: '📌 Saved video' });
        else if (/audio/.test(mime)) await client.sendMessage(client.user.id, { audio: buf, mimetype: mime });
        else await client.sendMessage(client.user.id, { document: buf, mimetype: mime, fileName: 'saved_file' });
      } else {
        return reply('Cannot save that type of message.');
      }
      reply('✅ Saved to your DM!');
    }
  },

  {
    command: ['sc', 'script', 'repo'],
    description: 'Get bot source code link',
    category: 'utility',
    handler: async (client, m) => {
      m.reply(`📂 *BLACK-MD Source Code*\n\nhttps://github.com/McrayNick/black-super-bot\n\n_Star ⭐ the repo if you enjoy the bot!_`);
    }
  },

  {
    command: ['support'],
    description: 'Get support group link',
    category: 'utility',
    handler: async (client, m) => {
      m.reply(`🆘 *BLACK-MD Support*\n\nJoin our support group for help and updates.\n\nhttps://chat.whatsapp.com/LDBdQY8fKbs1qkPWCTuJGX`);
    }
  },

  {
    command: ['checknum', 'validate'],
    description: 'Check if a number is on WhatsApp',
    category: 'utility',
    handler: async (client, m, { reply, text }) => {
      if (!text) return reply('Provide a phone number with country code. E.g: .checknum 254712345678');
      const num = text.replace(/[^0-9]/g, '');
      await reply(`🔍 Checking *+${num}*...`);
      const results = await client.onWhatsApp(num);
      if (!results || !results[0] || !results[0].exists) {
        return reply(`❌ +${num} is *NOT* on WhatsApp`);
      }
      reply(`✅ +${num} is on WhatsApp\nJID: ${results[0].jid}`);
    }
  },

  {
    command: ['enc', 'encrypte'],
    description: 'Obfuscate/encrypt JavaScript code',
    category: 'utility',
    handler: async (client, m, { reply }) => {
      const Obf = require('javascript-obfuscator');
      if (!m.quoted || !m.quoted.text) return reply('Quote/Tag a valid JavaScript code to encrypt!');
      const obfuscationResult = Obf.obfuscate(m.quoted.text, {
        compact: true,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 1,
        numbersToExpressions: true,
        simplify: true,
        stringArrayShuffle: true,
        splitStrings: true,
        stringArrayThreshold: 1
      });
      m.reply(obfuscationResult.getObfuscatedCode());
    }
  },

  {
    command: ['gpass', 'genpassword'],
    description: 'Generate a strong password',
    category: 'utility',
    handler: async (client, m, { reply, text }) => {
      const length = parseInt(text) || 16;
      if (length < 4 || length > 64) return reply('Password length must be between 4 and 64.');
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
      let password = '';
      for (let i = 0; i < length; i++) password += chars[Math.floor(Math.random() * chars.length)];
      m.reply(`🔐 *Generated Password (${length} chars):*\n\`${password}\`\n\n_Keep this safe!_`);
    }
  },

  {
    command: ['tg', 'telegram'],
    description: 'Get Telegram group/channel info',
    category: 'utility',
    handler: async (client, m, { reply, text }) => {
      if (!text) return reply('Provide a Telegram username or link. E.g: .tg @durov');
      await reply('📱 _Fetching Telegram info..._');
      const res = await global.axios.get(`${api}/tools/tg`, { params: { user: text } });
      const data = res.data?.result || res.data;
      if (!data) return reply('❌ Could not fetch Telegram info.');
      m.reply(typeof data === 'string' ? data : JSON.stringify(data, null, 2));
    }
  },

  {
    command: ['gitclone'],
    description: 'Clone a GitHub repo',
    category: 'utility',
    handler: async (client, m, { reply, text, Owner, NotOwner }) => {
      if (!Owner) return reply(NotOwner);
      if (!text) return reply('Provide a GitHub repo URL. E.g: .gitclone https://github.com/user/repo');
      const { exec } = require('child_process');
      await reply(`📦 _Cloning ${text}..._`);
      exec(`git clone ${text}`, (err, stdout, stderr) => {
        if (err) return reply(`❌ Clone failed:\n${stderr || err.message}`);
        reply(`✅ Successfully cloned!\n${stdout || ''}`);
      });
    }
  },

  {
    command: ['github'],
    description: 'Get GitHub user/repo info',
    category: 'utility',
    handler: async (client, m, { reply, text }) => {
      if (!text) return reply('Provide a GitHub username or repo. E.g: .github McrayNick or .github McrayNick/black-super-bot');
      await reply('🐙 _Fetching GitHub info..._');
      const url = text.includes('/')
        ? `https://api.github.com/repos/${text}`
        : `https://api.github.com/users/${text}`;
      const res = await global.axios.get(url);
      const d = res.data;
      if (text.includes('/')) {
        m.reply(`🐙 *${d.full_name}*\n\n📝 ${d.description || 'No description'}\n⭐ Stars: ${d.stargazers_count}\n🍴 Forks: ${d.forks_count}\n👁️ Watchers: ${d.watchers_count}\n💻 Language: ${d.language || 'N/A'}\n🔗 ${d.html_url}`);
      } else {
        m.reply(`👤 *${d.name || d.login}*\n\n📝 ${d.bio || 'No bio'}\n👥 Followers: ${d.followers}\n➡️ Following: ${d.following}\n📦 Repos: ${d.public_repos}\n🔗 ${d.html_url}`);
      }
    }
  },

  {
    command: ['tweet'],
    description: 'Create a fake tweet image',
    category: 'utility',
    handler: async (client, m, { reply, text }) => {
      if (!text) return reply('Provide tweet text. E.g: .tweet Hello World');
      await reply('🐦 _Generating tweet..._');
      const res = await global.axios.get(`${api}/tools/tweet`, { params: { text }, responseType: 'arraybuffer' });
      await client.sendMessage(m.chat, { image: Buffer.from(res.data), caption: '🐦 *Tweet Generated*' }, { quoted: m });
    }
  },

  {
    command: ['poll'],
    description: 'Create a group poll',
    category: 'utility',
    handler: async (client, m, { reply, text }) => {
      if (!m.isGroup) return reply('Polls only work in groups.');
      if (!text) return reply('Format: .poll Question | Option1 | Option2 | ...');
      const parts = text.split('|').map(p => p.trim());
      if (parts.length < 3) return reply('Provide at least a question and 2 options.\nE.g: .poll Best fruit? | Apple | Mango | Banana');
      const [question, ...options] = parts;
      await client.sendMessage(m.chat, {
        poll: { name: question, values: options, selectableCount: 1 }
      }, { quoted: m });
    }
  },

];
