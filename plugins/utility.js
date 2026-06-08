
module.exports = [

  {
    command: ['ping'],
    aliases: ['speed'],
    description: 'Check bot response speed',
    category: 'utility',
    handler: async (client, m, { reply, Rspeed }) => {
      m.reply(`𝗣𝗼𝗻𝗴!\n⚡️ *Speed:* ${Rspeed.toFixed(4)} 𝗠𝘀`);
    }
  },

  {
    command: ['uptime'],
    aliases: ['up'],
    description: 'Check bot uptime',
    category: 'utility',
    handler: async (client, m) => {
      const { runtime } = require('../lib/ravenfunc');
      m.reply(runtime(process.uptime()));
    }
  },

  {
    command: ['runtime'],
    aliases: ['stats'],
    description: 'Check bot runtime with rich card',
    category: 'utility',
    handler: async (client, m) => {
      const { runtime } = require('../lib/ravenfunc');
      const raven = `𝐁𝐋𝐀𝐂𝐊-𝐌𝐃 𝗵𝗮𝘀 𝗯𝗲𝗲𝗻 𝗿𝘂𝗻𝗻𝗶𝗻𝗴 𝘀𝗶𝗻𝗰𝗲 ${runtime(process.uptime())}`;
      client.sendMessage(m.chat, {
        text: raven,
        contextInfo: {
          externalAdReply: {
            showAdAttribution: true,
            title: '𝐁𝐋𝐀𝐂𝐊-𝐌𝐃',
            body: 'https://whatsapp.com/channel/0029VaxCd13DzgTGK42G292X',
            thumbnailUrl: 'https://i.ibb.co/HLWq3qVs/faab81f4a3dd.jpg',
            sourceUrl: 'https://whatsapp.com/channel/0029VaxCd13DzgTGK42G292X',
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: m });
    }
  },

  {
    command: ['owner'],
    aliases: ['dev'],
    description: 'Get owner contact',
    category: 'utility',
    handler: async (client, m, { from }) => {
      client.sendContact(from, ['254114283550'], m);
    }
  },

  {
    command: ['advice'],
    description: 'Get a random piece of advice',
    category: 'utility',
    handler: async (client, m, { reply }) => {
      const advice = require('badadvice');
      reply(advice());
    }
  },

  

  {
    command: ['bible'],
    aliases: ['bibble-verse'],
    description: 'Get a Bible verse',
    category: 'utility',
    handler: async (client, m, { reply, text, pushname }) => {
      if (!text) return reply('Please provide a Bible reference.\n\nExample: bible John 3:16');
      try {
        const response = await global.axios.get(`https://bible-api.com/${encodeURIComponent(text)}`);
        if (response.status === 200 && response.data.text) {
          const { reference: ref, text: verseText, translation_name } = response.data;
          reply(
            `*Hello there, below is what you requested*\n\n` +
            `📖 *Reference:* ${ref}\n` +
            ` ${verseText}\n\n` +
            `_Requested by ${pushname}_`
          );
        } else {
          reply('*Verse not found.* Please check the reference and try again.');
        }
      } catch (error) {
        reply('*An error occurred while fetching the Bible verse.* Please try again.');
      }
    }
  },

  {
    command: ['quran'],
    aliases: ['surah'],
    description: 'Get a Quran verse',
    category: 'utility',
    handler: async (client, m, { reply, text, pushname }) => {
      if (!text) return reply('Please provide Surah and Ayah\n*Example:* quran 2:255');
      const input = text.split(':');
      if (input.length !== 2) return reply('Incorrect format. Use: Surah:Ayah (e.g. 2:255)');
      const [surah, ayah] = input;
      try {
        const res = await global.axios.get(`https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/editions/quran-uthmani,en.asad`);
        const arabic = res.data.data[0].text;
        const english = res.data.data[1].text;
        const surahInfo = res.data.data[0].surah;
        const msg =
          `*Holy Qur'an Verse*\n\n` +
          `*Surah:* ${surahInfo.englishName} (${surahInfo.name})\n` +
          `*Ayah:* ${ayah}\n\n` +
          `*Arabic:* ${arabic}\n\n` +
          `*English:* ${english}\n\n` +
          `_Requested by ${pushname}_`;
        client.sendMessage(m.chat, { text: msg }, { quoted: m });
      } catch (e) {
        reply('Could not find the verse. Please check the Surah and Ayah.');
      }
    }
  },

  {
    command: ['tts'],
    aliases: ['say'],
    description: 'Text to speech',
    category: 'utility',
    handler: async (client, m, { reply, text }) => {
      if (!text) return reply('Provide text for conversion!');
      const googleTTS = require('google-tts-api');
      const url = googleTTS.getAudioUrl(text, { lang: 'hi-IN', slow: false, host: 'https://translate.google.com' });
      try {
        const { execSync } = require('child_process');
        const fs = require('fs');
        const tmpMp3 = `/tmp/tts_${Date.now()}.mp3`;
        const tmpOgg = `/tmp/tts_${Date.now()}.ogg`;
        const mp3Buf = (await global.axios.get(url, { responseType: 'arraybuffer' })).data;
        fs.writeFileSync(tmpMp3, Buffer.from(mp3Buf));
        execSync(`ffmpeg -i ${tmpMp3} -c:a libopus -ac 1 -ar 16000 -b:a 32k ${tmpOgg} -y`);
        const oggBuf = fs.readFileSync(tmpOgg);
        await client.sendMessage(m.chat, { audio: oggBuf, mimetype: 'audio/ogg; codecs=opus', ptt: true }, { quoted: m });
        try { fs.unlinkSync(tmpMp3); fs.unlinkSync(tmpOgg); } catch (e) {}
      } catch (e) {
        await client.sendMessage(m.chat, { audio: { url }, mimetype: 'audio/mpeg', ptt: false }, { quoted: m });
      }
    }
  },

  {
    command: ['weather'],
    description: 'Get weather for a location',
    category: 'utility',
    handler: async (client, m, { reply, text }) => {
      if (!text) return reply('provide a city/town name');
      try {
        const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${text}&units=metric&appid=1ad47ec6172f19dfaf89eb3307f74785`);
        const data = await response.json();
        const cityName = data.name;
        const temperature = data.main.temp;
        const description = data.weather[0].description;
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;
        const rainVolume = data.rain ? data.rain['1h'] : 0;
        const cloudiness = data.clouds.all;
        const sunrise = new Date(data.sys.sunrise * 1000);
        const sunset = new Date(data.sys.sunset * 1000);
        await m.reply(
          `❄️ Weather in ${cityName}\n\n` +
          `🌡️ Temperature: ${temperature}°C\n` +
          `📝 Description: ${description}\n` +
          `❄️ Humidity: ${humidity}%\n` +
          `🌀 Wind Speed: ${windSpeed} m/s\n` +
          `🌧️ Rain Volume (last hour): ${rainVolume} mm\n` +
          `☁️ Cloudiness: ${cloudiness}%\n` +
          `🌄 Sunrise: ${sunrise.toLocaleTimeString()}\n` +
          `🌅 Sunset: ${sunset.toLocaleTimeString()}`
        );
      } catch (e) {
        m.reply('Unable to find that location.');
      }
    }
  },

  {
    command: ['calculate'],
    aliases: ['calc', 'math'],
    description: 'Calculate a math expression',
    category: 'utility',
    handler: async (client, m, { reply, text }) => {
      if (!text) return m.reply('*Example usage:* .calculate 5+72');
      if (!/^[0-9+\-*/().\s]+$/.test(text)) return m.reply('Invalid format. Only numbers and +, -, *, /, ( ) are allowed.');
      try {
        let result = eval(text);
        m.reply(`Result: ${result}`);
      } catch {
        reply('❌ Invalid expression.');
      }
    }
  },

  {
    command: ['translate'],
    aliases: ['tl', 'trt', 'trans'],
    description: 'Translate text to any language',
    category: 'utility',
    handler: async (client, m, { reply, text }) => {
      const axios = require('axios');

      const langNames = {
        english: 'en', spanish: 'es', french: 'fr', german: 'de',
        italian: 'it', portuguese: 'pt', russian: 'ru', arabic: 'ar',
        chinese: 'zh', japanese: 'ja', korean: 'ko', hindi: 'hi',
        swahili: 'sw', yoruba: 'yo', zulu: 'zu', igbo: 'ig',
        hausa: 'ha', amharic: 'am', somali: 'so', turkish: 'tr',
        dutch: 'nl', polish: 'pl', swedish: 'sv', greek: 'el',
        hebrew: 'he', thai: 'th', vietnamese: 'vi', indonesian: 'id',
        afrikaans: 'af', romanian: 'ro', ukrainian: 'uk', bengali: 'bn',
        urdu: 'ur', persian: 'fa', malay: 'ms', danish: 'da',
      };

      const msgR       = m.message?.extendedTextMessage?.contextInfo?.quotedMessage || null;
      const quotedText = msgR?.conversation || msgR?.extendedTextMessage?.text || '';

      let targetLang = 'en';
      let inputText  = '';

      if (!text && !quotedText) {
        return reply(
          '🌍 *Translate — Usage:*\n\n' +
          '• *.translate Hello world* → to English\n' +
          '• *.translate es Hello world* → to Spanish\n' +
          '• *.translate fr* (reply to a message) → to French\n' +
          '• *.translate arabic* (reply to a message) → to Arabic\n\n' +
          '_Supported codes: en es fr de ar zh ja ko hi sw yo zu ig ha am tr nl pl sv el he th vi id af ro uk bn ur fa_'
        );
      }

      if (text) {
        const parts     = text.trim().split(/\s+/);
        const firstWord = parts[0].toLowerCase();
        const isLangName = langNames[firstWord];
        const isLangCode = /^[a-z]{2,3}$/.test(firstWord) && parts.length > 1;

        if (isLangName) {
          targetLang = isLangName;
          inputText  = parts.slice(1).join(' ');
        } else if (isLangCode) {
          targetLang = firstWord;
          inputText  = parts.slice(1).join(' ');
        } else {
          inputText = text.trim();
        }
      }

      if (!inputText.trim() && quotedText) inputText = quotedText.trim();
      if (!inputText.trim()) return reply('❌ No text to translate. Type text or reply to a message.');

      try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${encodeURIComponent(targetLang)}&dt=t&dt=ld&q=${encodeURIComponent(inputText)}`;
        const res = await axios.get(url, { timeout: 15000 });

        const translated = (res.data[0] || []).map(seg => seg?.[0] || '').join('').trim();
        if (!translated) return reply('❌ Translation failed. Try again.');

        const detectedLang = res.data?.[2] || 'auto';
        const toLang  = Object.entries(langNames).find(([, v]) => v === targetLang)?.[0]  || targetLang.toUpperCase();
        const fromLang = Object.entries(langNames).find(([, v]) => v === detectedLang)?.[0] || detectedLang.toUpperCase();

        await client.sendMessage(m.chat, {
          text: `🌍 *Translation*\n📥 *From:* ${fromLang}\n📤 *To:* ${toLang}\n\n${translated}`,
        }, { quoted: m });

      } catch (err) {
        console.error('translate error:', err.message);
        reply('❌ Translation failed. Try again in a moment.');
      }
    }
  },

  {
    command: ['zodiac'],
    description: 'Get zodiac sign by birth month and day',
    category: 'utility',
    handler: async (client, m, { reply, text, pushname }) => {
      if (!text) return reply('Please provide your birth month and date\n*Example:* zodiac 8 23 (for August 23)');
      const input = text.split(' ');
      if (input.length !== 2 || isNaN(input[0]) || isNaN(input[1])) return reply('Incorrect format. Use: month day (e.g. zodiac 5 15 for May 15)');
      const month = parseInt(input[0]);
      const day = parseInt(input[1]);
      if (month < 1 || month > 12 || day < 1 || day > 31) return reply('Invalid date. Please check your month (1-12) and day (1-31)');
      let zodiacSign = '';
      let traits = '';
      if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) {
        zodiacSign = 'Aries'; traits = 'Adventurous, energetic, courageous, enthusiastic, confident, dynamic, quick-witted';
      } else if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) {
        zodiacSign = 'Taurus'; traits = 'Patient, reliable, warmhearted, loving, persistent, determined, placid, security loving';
      } else if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) {
        zodiacSign = 'Gemini'; traits = 'Adaptable, versatile, communicative, witty, intellectual, eloquent, youthful, lively';
      } else if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) {
        zodiacSign = 'Cancer'; traits = 'Emotional, loving, intuitive, imaginative, shrewd, cautious, protective, sympathetic';
      } else if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) {
        zodiacSign = 'Leo'; traits = 'Generous, warmhearted, creative, enthusiastic, broad-minded, expansive, faithful, loving';
      } else if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) {
        zodiacSign = 'Virgo'; traits = 'Modest, shy, meticulous, reliable, practical, diligent, intelligent, analytical';
      } else if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) {
        zodiacSign = 'Libra'; traits = 'Diplomatic, urbane, romantic, charming, easygoing, sociable, idealistic, peaceable';
      } else if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) {
        zodiacSign = 'Scorpio'; traits = 'Determined, forceful, emotional, intuitive, powerful, passionate, exciting, magnetic';
      } else if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) {
        zodiacSign = 'Sagittarius'; traits = 'Optimistic, freedom-loving, jovial, good-humored, honest, straightforward, intellectual';
      } else if ((month == 12 && day >= 22) || (month == 1 && day <= 19)) {
        zodiacSign = 'Capricorn'; traits = 'Practical, prudent, ambitious, disciplined, patient, careful, humorous, reserved';
      } else if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) {
        zodiacSign = 'Aquarius'; traits = 'Friendly, humanitarian, honest, loyal, original, inventive, independent, intellectual';
      } else if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) {
        zodiacSign = 'Pisces'; traits = 'Imaginative, sensitive, compassionate, kind, selfless, unworldly, intuitive, sympathetic';
      } else {
        return reply('Could not determine zodiac sign. Please check your birth date.');
      }
      const msg =
        `*Zodiac Sign*\n\n` +
        `*Birth Date:* ${month}/${day}\n` +
        `*Sign:* ${zodiacSign}\n` +
        `*Traits:* ${traits}\n\n` +
        `_Requested by ${pushname}_`;
      client.sendMessage(m.chat, { text: msg }, { quoted: m });
    }
  },

  {
    command: ['joke'],
    description: 'Get a random joke',
    category: 'utility',
    handler: async (client, m, { reply }) => {
      try {
        const response = await global.axios.get('https://official-joke-api.appspot.com/random_joke');
        const joke = response.data;
        const jokeMessage = `😂 *Below is a random joke for you* 😂\n\n*${joke.setup}*\n\n${joke.punchline} 😄`;
        return reply(jokeMessage);
      } catch (e) {
        return reply("Couldn't fetch a joke right now. Please try again later.");
      }
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
    command: ['support'],
    description: 'Get support links',
    category: 'utility',
    handler: async (client, m) => {
      const links = {
        group: 'https://chat.whatsapp.com/LDBdQY8fKbs1qkPWCTuJGX',
        channel: 'https://whatsapp.com/channel/0029VawxyHxLdQeX3kA96G3N',
        email: 'mailto:cryptoboy1649@gmail.com',
        github: 'https://github.com/black-super-bot/issues',
        developer: 'https://wa.me/254114283550'
      };
      const banner = 'https://files.catbox.moe/xiflcv.jpeg';
      await client.sendPresenceUpdate('composing', m.chat);
      const supportMessage =
        `▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄\n` +
        `█                             █\n` +
        `█   🄱🄻🄰🄲🄺🅈 🅂🅄🄿🄿🄾🅁🅃   █\n` +
        `█                             █\n` +
        `▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀\n\n` +
        `✧ 𝙂𝙍𝙊𝙐𝙋 » ${links.group}\n\n` +
        `✧ 𝘾𝙃𝘼𝙉𝙉𝙀𝙇 » ${links.channel}\n\n` +
        `✧ 𝙀𝙈𝘼𝙄𝙇 » ${links.email}\n\n` +
        `✧ 𝙂𝙄𝙏𝙃𝙐𝘽 » ${links.github}\n\n` +
        `✧ 𝘿𝙀𝙑𝙀𝙇𝙊𝙋𝙀𝙍 » ${links.developer}\n\n` +
        `▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄\n` +
        `█  24/7 PREMIUM SUPPORT  █\n` +
        `▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀`;
      await client.sendMessage(m.chat, {
        image: { url: banner },
        caption: supportMessage,
        contextInfo: {
          externalAdReply: {
            title: '🅿🆁🅴🅼🅸🆄🅼 🆂🆄🅿🅿🅾🆁🆃',
            body: 'BLACKY BOT v1.0 | Instant Response',
            thumbnail: { url: banner },
            sourceUrl: links.channel
          }
        }
      });
    }
  },

  {
    command: ['repo'],
    aliases: ['sc', 'script'],
    description: 'Get bot source code and stats',
    category: 'utility',
    handler: async (client, m, { pushname }) => {
      try {
        const repoRes = await global.axios.get('https://api.github.com/repos/Blackie254/black-super-bot', { timeout: 10000 });
        const userRes = await global.axios.get('https://api.github.com/users/Blackie254', { timeout: 10000 });
        const r = repoRes.data;
        const u = userRes.data;
        client.sendMessage(m.chat, {
          image: { url: u.avatar_url },
          caption:
            ` Hello 👋 *${pushname}*,\n` +
            `╔══≪ ✦ ≫══════════≪ ✦ ≫══╗\n` +
            `              𝐁𝐋𝐀𝐂𝐊-𝐌𝐃\n` +
            `    The Ultimate WhatsApp Bot\n` +
            `╚══≪ ✦ ≫══════════≪ ✦ ≫══╝\n\n` +
            `🔷 𝐆𝐢𝐭𝐇𝐮𝐛 𝐑𝐞𝐩𝐨:\n` +
            `   ↳ ${r.html_url}\n` +
            `   ⭐ Stars: ${r.stargazers_count}\n` +
            `   🍴 Forks: ${r.forks_count}\n` +
            `   ★ Don't forget to Fork & Star our repo!\n\n` +
            `👤 𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐫:\n` +
            `   ↳ ${u.name || 'Blackie254'} => https://github.com/Blackie254\n` +
            `   ↳ McrayNick  => https://github.com/McrayNick\n\n` +
            `🔶 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩 𝐏𝐚𝐢𝐫𝐢𝐧𝐠:\n` +
            `   ↳ https://blackmd-pairing.onrender.com\n` +
            `   ★ Save your Session-ID!\n\n` +
            `⚙️ 𝐑𝐞𝐪𝐮𝐢𝐫𝐞𝐦𝐞𝐧𝐭𝐬:\n` +
            `   ✓ Complete all variables\n` +
            `   ✓ Keep API keys secure\n` +
            `   ✓ Deploy properly\n\n` +
            `╔══≪ ✦ ≫═══════════════≪ ✦ ≫══╗\n` +
            `       𝗠𝗮𝗱𝗲 𝗼𝗻 𝗲𝗮𝗿𝘁𝗵 𝗯𝘆 𝗛𝘂𝗺𝗮𝗻𝘀🔥!\n` +
            `╚══≪ ✦ ≫═══════════════≪ ✦ ≫══╝`
        }, { quoted: m });
      } catch (err) {
        client.sendMessage(m.chat, {
          image: { url: 'https://files.catbox.moe/pevpi2.jpg' },
          caption:
            ` Hello 👋 *${pushname}*,\n` +
            `╔══≪ ✦ ≫══════════≪ ✦ ≫══╗\n` +
            `            𝐁𝐋𝐀𝐂𝐊-𝐌𝐃 \n` +
            ` The Ultimate WhatsApp Bot\n` +
            `╚══≪ ✦ ≫══════════≪ ✦ ≫══╝\n\n` +
            `🔷 𝐆𝐢𝐭𝐇𝐮𝐛 𝐑𝐞𝐩𝐨:\n` +
            `   ↳ https://github.com/Blackie254/black-super-bot\n` +
            `   ★ Don't forget to Fork & Star!\n\n` +
            `🔶 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩 𝐏𝐚𝐢𝐫𝐢𝐧𝐠:\n` +
            `   ↳ https://blackmd-pairing.onrender.com\n` +
            `   ★ Save your Session-ID!\n\n` +
            `⚙️ 𝐑𝐞𝐪𝐮𝐢𝐫𝐞𝐦𝐞𝐧𝐭𝐬:\n` +
            `   ✓ Complete all variables\n` +
            `   ✓ Keep API keys secure\n` +
            `   ✓ Deploy properly\n\n` +
            `╔══≪ ✦ ≫═══════════════≪ ✦ ≫══╗\n` +
            `        𝗠𝗮𝗱𝗲 𝗼𝗻 𝗲𝗮𝗿𝘁𝗵 𝗯𝘆 𝗛𝘂𝗺𝗮𝗻𝘀🔥!\n` +
            `╚══≪ ✦ ≫═══════════════≪ ✦ ≫══╝`
        }, { quoted: m });
      }
    }
  },

  {
    command: ['validate'],
    aliases: ['checknum'],
    description: 'Validate a phone number and check WhatsApp',
    category: 'utility',
    handler: async (client, m, { reply, text }) => {
      if (!text) return reply('Usage: validate +254712345678\nProvide the full number with country code (e.g. +1 for US, +44 for UK, +254 for Kenya).');
      const cleaned = text.trim().replace(/[\s\-().]/g, '');
      const digits = cleaned.replace(/^\+/, '');
      if (!digits || !/^\d{7,15}$/.test(digits)) return reply('❌ Invalid number format. Use international format, e.g. +254712345678 or +14155551234');
      m.reply('🔍 Validating +' + digits + ' worldwide...');
      const region = digits.startsWith('1') && digits.length === 11 ? 1 : 3;
      let apiData = null;
      try {
        const apiRes = await global.axios.get('https://api.phonevalidator.com/api/v4/phonesearch', {
          params: { apikey: 'dbc19b10-f34e-4857-b42b-6c12543d42e3', phone: digits, type: 'basic', region },
          timeout: 10000
        });
        apiData = apiRes.data?.PhoneBasic || null;
      } catch (e) {}
      const jid = digits + '@s.whatsapp.net';
      let onWA = false;
      try {
        const [result] = await client.onWhatsApp(jid);
        onWA = result?.exists === true;
      } catch (e) {}
      let about = null;
      try {
        const statusList = await client.fetchStatus(jid);
        if (Array.isArray(statusList) && statusList.length > 0) {
          const st = statusList[0]?.status?.status;
          if (typeof st === 'string' && st.length > 0) about = st;
        }
      } catch (e) {}
      const aboutText = about || '🔒 Private (hidden by WhatsApp privacy settings)';
      let ppStatus = 'None / hidden';
      let ppUrl = null;
      try {
        ppUrl = await client.profilePictureUrl(jid, 'image');
        if (ppUrl) ppStatus = 'Available';
      } catch (e) {}
      const isValid = apiData?.FakeNumber === 'NO';
      const lineType = apiData?.LineType || 'Unknown';
      const carrier = apiData?.PhoneCompany || 'Unknown';
      const country = apiData?.Country || 'Unknown';
      const countryCode = apiData?.CountryCode || '??';
      const fakeReason = apiData?.FakeNumberReason || '';
      const replyText =
        '*📱 Number Validation Results*\n' +
        '━━━━━━━━━━━━━━━━━━━━━━\n\n' +
        '📞 *Number:* +' + digits + '\n' +
        '🌍 *Country:* ' + country + ' (' + countryCode + ')\n' +
        '🏢 *Carrier:* ' + carrier + '\n' +
        '📶 *Line Type:* ' + lineType + '\n' +
        '✅ *Valid Number:* ' + (isValid ? '✅ Yes' : '❌ No' + (fakeReason ? ' — ' + fakeReason : '')) + '\n\n' +
        '💬 *WhatsApp:* ' + (onWA ? '✅ Active on WhatsApp' : '❌ Not registered on WhatsApp') + '\n' +
        '📝 *About/Bio:* ' + aboutText + '\n' +
        '🖼️ *Profile Pic:* ' + ppStatus + '\n\n' +
        '🔗 https://wa.me/' + digits;
      if (ppUrl) {
        await client.sendMessage(m.chat, { image: { url: ppUrl }, caption: replyText }, { quoted: m });
      } else {
        await client.sendMessage(m.chat, { text: replyText }, { quoted: m });
      }
    }
  },

  {
    command: ['github'],
    aliases: ['gitstalk'],
    description: 'Get GitHub user info',
    category: 'utility',
    handler: async (client, m, { reply, text }) => {
      if (!text) return m.reply('Provide a github username to stalk');
      try {
        const response = await fetch(`https://api.github.com/users/${encodeURIComponent(text)}`, { headers: { 'User-Agent': 'BlackMD-Bot' } });
        if (response.status === 404) return m.reply(`❌ GitHub user "${text}" not found.`);
        if (!response.ok) return m.reply(`❌ GitHub API error: ${response.status}`);
        const data = await response.json();
        const username = data.login || 'N/A';
        const nickname = data.name || 'N/A';
        const bio = data.bio || 'N/A';
        const profilePic = data.avatar_url;
        const url = data.html_url;
        const type = data.type || 'N/A';
        const company = data.company || 'N/A';
        const blog = data.blog || 'N/A';
        const location = data.location || 'N/A';
        const publicRepos = data.public_repos ?? 0;
        const publicGists = data.public_gists ?? 0;
        const followers = data.followers ?? 0;
        const following = data.following ?? 0;
        const createdAt = data.created_at ? new Date(data.created_at).toDateString() : 'N/A';
        const message =
          `*GitHub User Info*\n\n` +
          `Username:- ${username}\n\nNickname:- ${nickname}\n\nBio:- ${bio}\n\nLink:- ${url}\n\n` +
          `Location:- ${location}\n\nCompany:- ${company}\n\nBlog:- ${blog}\n\n` +
          `Followers:- ${followers}\n\nFollowing:- ${following}\n\nRepos:- ${publicRepos}\n\n` +
          `Gists:- ${publicGists}\n\nAccount Type:- ${type}\n\nCreated:- ${createdAt}`;
        await client.sendMessage(m.chat, { image: { url: profilePic }, caption: message }, { quoted: m });
      } catch (error) {
        m.reply('Unable to fetch data\n' + error);
      }
    }
  },

  {
    command: ['gitclone'],
    aliases: ['clone'],
    description: 'Download a GitHub repo as ZIP',
    category: 'utility',
    handler: async (client, m, { reply, text }) => {
      if (!text) return m.reply('Where is the link?');
      if (!text.includes('github.com')) return m.reply('Is that a GitHub repo link ?!');
      const regex1 = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i;
      let [, user3, repo] = text.match(regex1) || [];
      repo = repo.replace(/.git$/, '');
      const url = `https://api.github.com/repos/${user3}/${repo}/zipball`;
      const headRes = await fetch(url, { method: 'HEAD' });
      const filename = headRes.headers.get('content-disposition').match(/attachment; filename=(.*)/)[1];
      await client.sendMessage(m.chat, { document: { url }, fileName: filename + '.zip', mimetype: 'application/zip' }, { quoted: m }).catch(() => m.reply('error'));
    }
  },

  {
    command: ['screenshot'],
    aliases: ['ss', 'ssweb'],
    description: 'Screenshot a website',
    category: 'utility',
    handler: async (client, m, { reply, text }) => {
      const { botname } = require('../set');
      if (!text) return m.reply('Provide a website link to screenshot.');
      try {
        const cap = `𝗦𝗰𝗿𝗲𝗲𝗻𝘀𝗵𝗼𝘁 𝗯𝘆 ${botname}`;
        const image = `https://image.thum.io/get/fullpage/${text}`;
        await client.sendMessage(m.chat, { image: { url: image }, caption: cap }, { quoted: m });
      } catch (error) {
        m.reply('An error occured.');
      }
    }
  },

  
    {
    command: ['alive'],
    aliases: ['test'],
    description: 'Check if bot is alive',
    category: 'utility',
    handler: async (client, m, { pushname }) => {
      const os   = require('os');
      const fs   = require('fs');
      const { execSync } = require('child_process');
      const { runtime } = require('../lib/ravenfunc');
      const { botname } = require('../set');

  // ── Hosting platform detection ───────────────────────────────────────
      let platform = '🎛️ PANEL / VPS';
      if (process.env.KOYEB_SERVICE_NAME || process.env.KOYEB_APP_NAME || process.env.KOYEB) {
        platform = '🟢 Koyeb';
      } else if (process.env.DYNO) {
        platform = '🟣 Heroku';
      } else if (process.env.RAILWAY_SERVICE_NAME || process.env.RAILWAY_ENVIRONMENT) {
        platform = '🚂 Railway';
      } else if (process.env.RENDER_SERVICE_NAME || process.env.RENDER) {
        platform = '🔵 Render';
      } else if (process.env.FLY_APP_NAME) {
        platform = '🪁 Fly.io';
      } else if (process.env.REPL_ID || process.env.REPLIT_DB_URL) {
        platform = '🔷 Replit';
      } else if ((os.release() || '').toLowerCase().includes('aws') || (os.hostname() || '').includes('koyeb')) {
        platform = '🟢 Koyeb (AWS)';
      }

// ── Container/allocated RAM (cgroup) ────────────────────────────────
      const toMB = (b) => (b / 1024 / 1024).toFixed(1) + ' MB';
      const toGB = (b) => (b / 1024 / 1024 / 1024).toFixed(2) + ' GB';

      let allocatedRam = null;
      try {
        const raw = fs.readFileSync('/sys/fs/cgroup/memory.max', 'utf8').trim();
        if (raw !== 'max') allocatedRam = parseInt(raw);
      } catch (_) {}
      if (!allocatedRam) {
        try {
          const raw = fs.readFileSync('/sys/fs/cgroup/memory/memory.limit_in_bytes', 'utf8').trim();
          const val = parseInt(raw);
          
          if (val < 256 * 1024 * 1024 * 1024) allocatedRam = val;
        } catch (_) {}
      }

      const botMem   = process.memoryUsage();
      const usedRam  = botMem.rss;                        
      const totalRam = allocatedRam || os.totalmem();  
      const ramPct   = ((usedRam / totalRam) * 100).toFixed(1);
      const ramTotal = toGB(totalRam); 

// ── Storage ─────────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────
      let diskUsedMB = 0, diskUsedStr = 'N/A', diskFreeStr = 'N/A', diskTotalStr = 'N/A', diskPct = 'N/A';
      try {
        const duOut = execSync('du -sk ' + process.cwd()).toString().trim().split(/\s+/);
        diskUsedMB = Math.round(parseInt(duOut[0]) / 1024); 
        diskUsedStr = diskUsedMB + ' MB';
      } catch (_) {}
    
      const diskLimitMB = parseInt(process.env.DISK_LIMIT || '1024');
      const diskFreeMBVal = Math.max(diskLimitMB - diskUsedMB, 0);
      diskTotalStr = diskLimitMB >= 1024 ? (diskLimitMB / 1024).toFixed(0) + ' GB' : diskLimitMB + ' MB';
      diskFreeStr  = diskFreeMBVal >= 1024 ? (diskFreeMBVal / 1024).toFixed(2) + ' GB' : diskFreeMBVal + ' MB';
      diskPct      = diskLimitMB > 0 ? ((diskUsedMB / diskLimitMB) * 100).toFixed(1) + '%' : 'N/A';

// ── Bot uptime ───────────────────────────────────────────────────────
      const botUptime = runtime(process.uptime());

      const msg =
        `════════════════════════\n` +
        `   𝗛𝗶 ${pushname}👋  \n` +
        `════════════════════════\n\n` +
        `✅ *${botname} is Online and Running!*\n\n` +
        `*⏱️ Uptime*\n` +
        `┗ ${botUptime}\n\n` +
        `*🌐 Hosting*\n` +
        `┣ Platform : ${platform}\n` +
        `┗ Node.js  : ${process.version}\n\n` +
        `*🧠 Memory*\n` +
        `┣ RAM Used : ${toMB(usedRam)} / ${ramTotal} (${ramPct}%)\n` +
        `┗ Bot Heap : ${toMB(botMem.heapUsed)}\n\n` +
        `*💾 Storage*\n` +
        `┣ Used  : ${diskUsedStr} / ${diskTotalStr}\n` +
        `┣ % Used  : ${diskPct}\n` +
        `┗ Free  : ${diskFreeStr}\n\n` +
        `════════════════════════\n` +
        `_𝗠𝗮𝗱𝗲 𝗼𝗻 𝗲𝗮𝗿𝘁𝗵 𝗯𝘆 𝗛𝘂𝗺𝗮𝗻𝘀🔥!_ \n` +
        `════════════════════════`;

      m.reply(msg);
    }
  },

  

  {
    command: ['tweet'],
    description: 'Create a fake tweet image',
    category: 'utility',
    handler: async (client, m, { reply, pushname, text }) => {
      if (!text) return m.reply("provide some text for the tweet");

const displayname = pushname;
const username = m.sender.split('@')[0];
const avatar = await client.profilePictureUrl(m.sender, 'image').catch(_ => 'https://i.imgur.com/vuxJCTB.jpeg');
const replies = "246";
const retweets = "125";
const theme = "dark";

const imageurl = `https://some-random-api.com/canvas/misc/tweet?displayname=${encodeURIComponent(displayname)}&username=${encodeURIComponent(username)}&avatar=${encodeURIComponent(avatar)}&comment=${encodeURIComponent(text)}&replies=${encodeURIComponent(replies)}&retweets=${encodeURIComponent(retweets)}&theme=${encodeURIComponent(theme)}`;

await client.sendMessage(m.chat, { image: { url: imageurl}, caption: `𝗖𝗼𝗻𝘃𝗲𝗿𝘁𝗲𝗱 𝗯𝘆 𝐁𝐋𝐀𝐂𝐊-𝐌𝐃 𝗕𝗢𝗧`}, { quoted: m}) 

    }
  },

  
  {
    command: ['poll'],
    description: 'Create a group poll',
    category: 'utility',
    handler: async (client, m, { reply, text, group }) => {
      if (!m.isGroup) return reply(group);
      if (!text) return reply('Format: .poll Question | Option1 | Option2 | ...');
      const parts = text.split('|').map(p => p.trim());
      if (parts.length < 3) return reply('Provide at least a question and 2 options.\nE.g: .poll Best fruit? | Apple | Mango | Banana');
      const [question, ...options] = parts;
      await client.sendMessage(m.chat, { poll: { name: question, values: options, selectableCount: 1 } }, { quoted: m });
    }
  },

  {
  command: ['tg'],
  aliases: ['tgs', 'telegrams'],
  description: 'Download Telegram sticker pack',
  category: 'utility',
  handler: async (client, m, { reply, args }) => {
    if (!args[0]) return m.reply('⚠️ Please provide a Telegram sticker URL!\n\nExample: .tg https://t.me/addstickers/HellsParadise_S2');
    if (!args[0].match(/(https:\/\/t.me\/addstickers\/)/gi)) return m.reply('❌ Invalid URL!');

    const packName = args[0].replace('https://t.me/addstickers/', '').trim();
    const botToken = '8103143873:AAHDq1PpwJaN2f22ASvCWTuDXX-DQ1_ad4U';

    await m.reply(`📦 To avoid stickers will be send to your Dm Processing: ${packName}\n⏳ Downloading...`);

    try {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/getStickerSet?name=${encodeURIComponent(packName)}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const stickerSet = await response.json();
      if (!stickerSet.ok) return m.reply('❌ Sticker pack not found or private');

      let successCount = 0;
      let failCount = 0;
      const totalStickers = Math.min(stickerSet.result.stickers.length, 100);

      const sharp = require('sharp');
      const { Sticker, StickerTypes } = require('wa-sticker-formatter');
      const { execSync } = require('child_process');
      const os = require('os');
      const path = require('path');
      const fs = require('fs');
      let ffmpegPath;
      try { ffmpegPath = require('ffmpeg-static'); } catch { ffmpegPath = 'ffmpeg'; }

      for (let i = 0; i < totalStickers; i++) {
        try {
          const sticker = stickerSet.result.stickers[i];
          const isAnimatedTGS = sticker.is_animated === true;
          const isVideoWebM  = sticker.is_video === true;    

          if (isAnimatedTGS) {
            failCount++;
            continue;
          }

          const fileInfo = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${sticker.file_id}`);
          const fileData = await fileInfo.json();
          if (!fileData.ok) throw new Error('File not found');

          const fileUrl = `https://api.telegram.org/file/bot${botToken}/${fileData.result.file_path}`;
          const fileRes = await fetch(fileUrl);
          const buffer = Buffer.from(await fileRes.arrayBuffer());

          if (isVideoWebM) {
            const id = Date.now() + i;
            const tmpDir = os.tmpdir();
            const inPath  = path.join(tmpDir, `tg_in_${id}.webm`);
            const outPath = path.join(tmpDir, `tg_out_${id}.mp4`);
            fs.writeFileSync(inPath, buffer);

            try {
              execSync(
                `"${ffmpegPath}" -y -i "${inPath}" -t 6 ` +
                `-vf "scale=512:512:force_original_aspect_ratio=decrease,fps=15,` +
                `pad=512:512:(ow-iw)/2:(oh-ih)/2:color=black@0" ` +
                `-an -c:v libx264 -crf 26 -preset ultrafast "${outPath}"`,
                { timeout: 30000, stdio: 'pipe' }
              );
            } catch {
              fs.copyFileSync(inPath, outPath);
            }

            const stickerObj = new Sticker(fs.readFileSync(outPath), {
              pack: 'BLACK-MD',
              author: 'TG Pack',
              type: StickerTypes.FULL,
              quality: 40,
            });
            let stickerBuf = await stickerObj.toBuffer();

            if (stickerBuf.length > 950 * 1024) {
              try {
                execSync(
                  `"${ffmpegPath}" -y -i "${inPath}" -t 4 ` +
                  `-vf "scale=512:512:force_original_aspect_ratio=decrease,fps=8,` +
                  `pad=512:512:(ow-iw)/2:(oh-ih)/2:color=black@0" ` +
                  `-an -c:v libx264 -crf 30 -preset ultrafast "${outPath}"`,
                  { timeout: 30000, stdio: 'pipe' }
                );
                const retry = new Sticker(fs.readFileSync(outPath), {
                  pack: 'BLACK-MD', author: 'TG Pack',
                  type: StickerTypes.FULL, quality: 25,
                });
                const retryBuf = await retry.toBuffer();
                if (retryBuf && retryBuf.length >= 500) stickerBuf = retryBuf;
              } catch {}
            }

            try { fs.unlinkSync(inPath); } catch {}
            try { fs.unlinkSync(outPath); } catch {}

            if (!stickerBuf || stickerBuf.length < 500 || stickerBuf.length > 1024 * 1024) {
              failCount++;
              continue;
            }

            await client.sendMessage(m.sender, { sticker: stickerBuf }, { quoted: m });
            successCount++;

          } else {
            try {
              const processed = await sharp(buffer)
                .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
                .webp({ quality: 90 })
                .toBuffer();
              await client.sendMessage(m.sender, { sticker: processed }, { quoted: m });
              successCount++;
            } catch {
              await client.sendMessage(m.sender, { sticker: buffer }, { quoted: m });
              successCount++;
            }
          }

          await new Promise(r => setTimeout(r, 600));
        } catch (err) {
          failCount++;
        }
      }

      await m.reply(`✅ Mission Complete!\n📊 Success: ${successCount} | Failed: ${failCount}\n📍 Sent to your Dm`);

    } catch (error) {
      await m.reply('❌ Failed: ' + error.message);
    }
  }
},



  {
    command: ['pair'],
    aliases: ['rent'],
    description: 'Get pairing code for bot session',
    category: 'utility',
    handler: async (client, m, { reply, q }) => {
      if (!q) return await reply('𝐡𝐨𝐥𝐥𝐚 𝐩𝐥𝐞𝐚𝐬𝐞 𝐩𝐫𝐨𝐯𝐢𝐝𝐞 𝐚 𝐯𝐚𝐥𝐢𝐝 𝐰𝐡𝐚𝐭𝐬𝐚𝐩𝐩 𝐧𝐮𝐦𝐛𝐞𝐫 𝐦𝐦𝐡... 𝐄𝐱𝐚𝐦𝐩𝐥𝐞- pair 25411428XXX');
      try {
        const numbers = q.split(',').map(v => v.replace(/[^0-9]/g, '')).filter(v => v.length > 5 && v.length < 20);
        if (numbers.length === 0) return m.reply('Invalid number❌️ Please use the correct format!');
        for (const number of numbers) {
          const whatsappID = number + '@s.whatsapp.net';
          const result = await client.onWhatsApp(whatsappID);
          if (!result[0]?.exists) return m.reply('That number is not registered on WhatsApp❗️');
          m.reply('𝐰𝐚𝐢𝐭 𝐚 𝐦𝐨𝐦𝐞𝐧𝐭 𝐟𝐨𝐫 𝐁𝐥𝐚𝐜𝐤 𝐌𝐃 𝐩𝐚𝐢𝐫 𝐜𝐨𝐝𝐞');
          const { data } = await global.axios(`https://blackmd-pairing.onrender.com/code?number=${number}`);
          const code = data.code;
          const { sleep } = require('../lib/ravenfunc');
          await sleep(3000);
          await m.reply(` ${code}`);
        }
      } catch (error) {
        await reply('An error occurred. Please try again later.');
      }
    }
  },

  {
    command: ['vcf'],
    aliases: ['groupvcf', 'group-vcf'],
    description: 'Export group contacts as VCF',
    category: 'utility',
        handler: async (client, m, { reply, group, store }) => {
      if (!m.isGroup) return m.reply('Command meant for groups');
      const fs = require('fs');
      try {
        const metadata = await client.groupMetadata(m.chat);
        const participants = metadata.participants || [];
        let vcard = '';
        let no = 0;
        for (const p of participants) {
          let num = null;
          if (p.pn) {
            num = p.pn.replace(/[^0-9]/g, '');
          } else if (p.id && !p.id.includes('@lid')) {
            num = p.id.split('@')[0].split(':')[0].replace(/[^0-9]/g, '');
          }
          if (!num) continue;

          const jidKey  = num + '@s.whatsapp.net';
          const contact = store?.contacts?.[jidKey] || store?.contacts?.[p.id] || {};
          const name    = contact.name || contact.notify || `+${num}`;

          vcard +=
            `BEGIN:VCARD\n` +
            `VERSION:3.0\n` +
            `FN:${name}\n` +
            `TEL;type=CELL;type=VOICE;waid=${num}:+${num}\n` +
            `END:VCARD\n`;
          no++;
        }
        const filePath = './contacts.vcf';
        await m.reply(`⏳ Compiling ${participants.length} contacts...`);
        fs.writeFileSync(filePath, vcard.trim());
        await client.sendMessage(m.chat, {
          document: fs.readFileSync(filePath),
          mimetype: 'text/vcard',
          fileName: 'Group Contacts.vcf',
                    caption: `📋 VCF for *${metadata.subject}*\n✅ ${no} contacts exported`
        }, { quoted: m });
        fs.unlinkSync(filePath);
      } catch (err) {
        m.reply('❌ Failed to generate VCF.');
      }
     }
  },

];
