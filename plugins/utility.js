
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
    command: ['trt'],
    aliases: ['translate'],
    description: 'Translate text',
    category: 'utility',
    handler: async (client, m, { reply, text, args, from }) => {
      if (args.length < 2) return m.reply('Please provide a language code and text to translate!');
      const targetLang = args[0];
      const textToTranslate = args.slice(1).join(' ');
      try {
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(textToTranslate)}&langpair=en|${targetLang}`);
        if (!response.ok) return m.reply('Translation service unavailable. Try again later.');
        const data = await response.json();
        const translated = data.responseData?.translatedText;
        if (!translated) return m.reply('Translation failed. Check your language code.');
        await client.sendMessage(from, { text: `🌍 *Translation (${targetLang}):*\n\n${translated}` }, { quoted: m });
      } catch (error) {
        m.reply('Translation failed: ' + error.message);
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
      let platform = 'Unknown / VPS';
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
      let totalDisk = 'N/A', usedDisk = 'N/A', freeDisk = 'N/A';
      try {
        const df = execSync("df -k / | tail -1").toString().trim().split(/\s+/);
        totalDisk = toGB(parseInt(df[1]) * 1024);
        usedDisk  = toGB(parseInt(df[2]) * 1024);
        freeDisk  = toGB(parseInt(df[3]) * 1024);
      } catch (_) {}

// ── Bot uptime ───────────────────────────────────────────────────────
      const botUptime = runtime(process.uptime());

      const msg =
        `════════════════════════\n` +
        `   𝗛𝗶 ${pushname}👋  \n` +
        `════════════════════════\n\n` +
        `✅ *BLACK-MD is Online and Running!*\n\n` +
        `*⏱️ Uptime*\n` +
        `┗ ${botUptime}\n\n` +
        `*🌐 Hosting*\n` +
        `┣ Platform : ${platform}\n` +
        `┗ Node.js  : ${process.version}\n\n` +
        `*🧠 Memory*\n` +
        `┣ RAM Used : ${toMB(usedRam)} / ${ramTotal} (${ramPct}%)\n` +
        `┗ Bot Heap : ${toMB(botMem.heapUsed)}\n\n` +
        `*💾 Storage*\n` +
        `┣ Total : ${totalDisk}\n` +
        `┣ Used  : ${usedDisk}\n` +
        `┗ Free  : ${freeDisk}\n\n` + 
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
    description: 'Download Telegram sticker pack to DM',
    category: 'utility',
    handler: async (client, m, { reply, args }) => {
      if (!args[0]) return m.reply('⚠️ Please provide a Telegram sticker URL!\n\nExample: .tg https://t.me/addstickers/Porcientoreal');
      if (!args[0].match(/(https:\/\/t.me\/addstickers\/)/gi)) return m.reply('❌ Invalid URL! Make sure it\'s a Telegram sticker pack URL.\nExample: https://t.me/addstickers/YourPackName');
      
      const packName = args[0].replace('https://t.me/addstickers/', '').trim();
      const botToken = '8103143873:AAHDq1PpwJaN2f22ASvCWTuDXX-DQ1_ad4U';
      
      const senderNumber = m.sender;
      const isGroup = m.isGroup;
      const targetJid = isGroup ? senderNumber : m.key.remoteJid;
      
      await m.reply(`📦 Processing sticker pack: ${packName}\n⏳ Converting all stickers to WhatsApp format...`);
      
      try {
        const response = await fetch(`https://api.telegram.org/bot${botToken}/getStickerSet?name=${encodeURIComponent(packName)}`, {
          method: 'GET', 
          headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0' }
        });
        
        if (!response.ok) {
          if (response.status === 404) return m.reply('❌ Sticker pack not found.');
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const stickerSet = await response.json();
        if (!stickerSet.ok || !stickerSet.result) return m.reply('❌ Invalid sticker pack.');
        
        let successCount = 0;
        let failedCount = 0;
        const totalStickers = stickerSet.result.stickers.length;
        const maxStickers = Math.min(totalStickers, 30);
        
        await m.reply(`🎨 Found ${totalStickers} total stickers. Converting ${maxStickers} stickers to WhatsApp format...\n⏰ This may take a few minutes.`);
        
        for (let i = 0; i < maxStickers; i++) {
          try {
            const sticker = stickerSet.result.stickers[i];
            const isAnimated = sticker.is_animated || false;
            const isVideo = sticker.is_video || false;
            
            // Get file info
            const fileInfoResponse = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${sticker.file_id}`);
            if (!fileInfoResponse.ok) {
              failedCount++;
              continue;
            }
            
            const fileData = await fileInfoResponse.json();
            if (!fileData.ok || !fileData.result.file_path) {
              failedCount++;
              continue;
            }
            
            const fileUrl = `https://api.telegram.org/file/bot${botToken}/${fileData.result.file_path}`;
            const fileResponse = await fetch(fileUrl);
            
            if (!fileResponse.ok) {
              failedCount++;
              continue;
            }
            
            const arrayBuffer = await fileResponse.arrayBuffer();
            let stickerBuffer = Buffer.from(arrayBuffer);
            
            // Convert based on sticker type
            try {
              let finalSticker = stickerBuffer;
              
              if (isVideo || isAnimated) {
                // For animated/video stickers, extract first frame as static sticker
                // Using ffmpeg or simple frame extraction
                try {
                  // Try to use ffmpeg if available
                  const { exec } = require('child_process');
                  const fs = require('fs');
                  const path = require('path');
                  
                  const tempInput = path.join(__dirname, `temp_${Date.now()}_${i}.${isVideo ? 'webm' : 'tgs'}`);
                  const tempOutput = path.join(__dirname, `temp_${Date.now()}_${i}.webp`);
                  
                  // Save buffer to temp file
                  fs.writeFileSync(tempInput, stickerBuffer);
                  
                  if (isVideo) {
                    // Extract first frame from video
                    await new Promise((resolve, reject) => {
                      exec(`ffmpeg -i "${tempInput}" -vframes 1 -vf "scale=512:512:force_original_aspect_ratio=increase,crop=512:512" -c:v libwebp "${tempOutput}" -y`, (error) => {
                        if (error) reject(error);
                        else resolve();
                      });
                    });
                  } else if (isAnimated) {
                    // For TGS (Lottie) files, you'd need lottie-converter
                    // Alternative: use a service or skip for now
                    // For simplicity, we'll skip animated stickers or use a placeholder
                    throw new Error('Animated TGS stickers require external conversion');
                  }
                  
                  if (fs.existsSync(tempOutput)) {
                    finalSticker = fs.readFileSync(tempOutput);
                    // Cleanup temp files
                    fs.unlinkSync(tempInput);
                    fs.unlinkSync(tempOutput);
                  }
                } catch (convertError) {
                  // If conversion fails, try to use the original as is
                  console.log('Conversion failed, using original:', convertError.message);
                }
              }
              
              // Send as WhatsApp sticker
              await client.sendMessage(targetJid, { 
                sticker: finalSticker
              });
              successCount++;
              
            } catch (sendError) {
              // Fallback: Send as image if sticker fails
              await client.sendMessage(targetJid, { 
                image: stickerBuffer,
                caption: `Sticker ${i+1}/${maxStickers} (converted to image)`
              });
              successCount++;
            }
            
            // Progress update
            if ((i + 1) % 5 === 0) {
              await m.reply(`📥 Progress: ${i+1}/${maxStickers} stickers processed`);
            }
            
            await new Promise(resolve => setTimeout(resolve, 500));
            
          } catch (err) {
            failedCount++;
            console.error(`Sticker ${i+1} failed:`, err);
          }
        }
        
        if (successCount > 0) {
          await client.sendMessage(targetJid, { 
            text: `✅ Sticker pack conversion complete!\n\n📦 Pack: ${packName}\n✅ Success: ${successCount}/${maxStickers} stickers\n❌ Failed: ${failedCount}\n\n💾 All stickers have been sent to this DM!` 
          });
          await m.reply(`✅ Successfully sent ${successCount} working stickers to your DM!\n${failedCount > 0 ? `⚠️ ${failedCount} stickers failed to convert.` : ''}\n\n📌 Check your DM and tap the + icon to add them to your stickers!`);
        } else {
          await m.reply('❌ Failed to convert any stickers. The pack might have unsupported formats.');
        }
        
      } catch (error) {
        console.error('Error:', error);
        await m.reply('❌ Failed to download. Check if the sticker pack exists and is public.');
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
          // Resolve real phone number (pn field avoids LID issues)
          let num = null;
          if (p.pn) {
            num = p.pn.replace(/[^0-9]/g, '');
          } else if (p.id && !p.id.includes('@lid')) {
            num = p.id.split('@')[0].split(':')[0].replace(/[^0-9]/g, '');
          }
          if (!num) continue;

          // Resolve display name from store contacts
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
