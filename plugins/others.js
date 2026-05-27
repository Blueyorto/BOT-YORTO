module.exports = [
  
  {
    command: ['hack'],
    description: 'Fake hacking animation (Owner only)',
    category: 'others',
    handler: async (client, m, { Owner, NotOwner }) => {
      if (!Owner) return m.reply(NotOwner);
      try {
        const steps = [
          '⚠️𝗜𝗻𝗶𝘁𝗶𝗹𝗶𝗮𝘇𝗶𝗻𝗴 𝗛𝗮𝗰𝗸𝗶𝗻𝗴 𝗧𝗼𝗼𝗹𝘀⚠️',
          '𝗜𝗻𝗷𝗲𝗰𝘁𝗶𝗻𝗴 𝗠𝗮𝗹𝘄𝗮𝗿𝗲🐛..\n𝗟𝗼𝗮𝗱𝗶𝗻𝗴 𝗗𝗲𝘃𝗶𝗰𝗲 𝗚𝗮𝗹𝗹𝗲𝗿𝘆 𝗙𝗶𝗹𝗲𝘀⚠️',
          '```██ 10%``` ⏳',
          '```████ 20%``` ⏳',
          '```██████ 30%``` ⏳',
          '```████████ 40%``` ⏳',
          '```██████████ 50%``` ⏳',
          '```████████████ 60%``` ⏳',
          '```██████████████ 70%``` ⏳',
          '```████████████████ 80%``` ⏳',
          '```██████████████████ 90%``` ⏳',
          '```████████████████████ 100%``` ✅',
          '```𝗦𝘆𝘀𝘁𝗲𝗺 𝗛𝘆𝗷𝗮𝗰𝗸𝗶𝗻𝗴 𝗼𝗻 𝗽𝗿𝗼𝗰𝗲𝘀𝘀...```\n```𝗖𝗼𝗻𝗻𝗲𝗰𝘁𝗶𝗻𝗴 𝘁𝗼 𝘁𝗵𝗲 𝗦𝗲𝗿𝘃𝗲𝗿 𝘁𝗼 𝗙𝗶𝗻𝗱 𝗘𝗿𝗿𝗼𝗿 404```',
          '```𝗦𝘂𝗰𝗰𝗲𝘀𝗳𝘂𝗹𝗹𝘆 𝗖𝗼𝗻𝗻𝗲𝗰𝘁𝗲𝗱 𝘁𝗼 𝗗𝗲𝘃𝗶𝗰𝗲...\n𝗥𝗲𝗰𝗲𝗶𝘃𝗶𝗻𝗴 𝗗𝗮𝘁𝗮/𝗦𝗲𝗰𝗿𝗲𝘁 𝗣𝗮𝘀𝘀𝘄𝗼𝗿𝗱𝘀...```',
          '```𝗗𝗮𝘁𝗮 𝗧𝗿𝗮𝗻𝘀𝗳𝗲𝗿𝗲𝗱 𝗙𝗿𝗼𝗺 𝗱𝗲𝘃𝗶𝗰𝗲 100% 𝗖𝗼𝗺𝗽𝗹𝗲𝘁𝗲𝗱\n𝗘𝗿𝗮𝘀𝗶𝗻𝗴 𝗮𝗹𝗹 𝗘𝘃𝗶𝗱𝗲𝗻𝗰𝗲, 𝗞𝗶𝗹𝗹𝗶𝗻𝗴 𝗮𝗹𝗹 𝗠𝗮𝗹𝘄𝗮𝗿𝗲𝘀🐛...```',
          '```𝗦𝗘𝗡𝗗𝗜𝗡𝗚 𝗟𝗢𝗚 𝗗𝗢𝗖𝗨𝗠𝗘𝗡𝗧𝗦...```',
          '```𝗦𝘂𝗰𝗰𝗲𝘀𝗳𝘂𝗹𝗹𝘆 𝗦𝗲𝗻𝘁 𝗗𝗮𝘁𝗮 𝗔𝗻𝗱 𝗖𝗼𝗻𝗻𝗲𝗰𝘁𝗶𝗼𝗻 𝗦𝘂𝗰𝗰𝗲𝘀𝗳𝘂𝗹𝗹𝘆 𝗗𝗶𝘀𝗰𝗼𝗻𝗻𝗲𝗰𝘁𝗲𝗱```',
          '```𝗔𝗹𝗹 𝗕𝗮𝗰𝗸𝗹𝗼𝗴𝘀 𝗖𝗹𝗲𝗮𝗿𝗲𝗱 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆💣\n𝗬𝗼𝘂𝗿 𝗦𝘆𝘀𝘁𝗲𝗺 𝗪𝗶𝗹𝗹 𝗕𝗲 𝗗𝗼𝘄𝗻 𝗜𝗻 𝗧𝗵𝗲 𝗡𝗲𝘅𝘁 𝗠𝗶𝗻𝘂𝘁𝗲⚠️```'
        ];
        for (const line of steps) {
          await client.sendMessage(m.chat, { text: line }, { quoted: m });
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        client.sendMessage(m.chat, { text: `❌ *Error!* Something went wrong. Reason: ${error.message}.` });
      }
    }
  },

  {
    command: ['inspect'],
    description: 'Inspect a website — fetch its HTML, CSS, and JS',
    category: 'others',
    handler: async (client, m, { reply, text }) => {
      const cheerio = require('cheerio');
      if (!text) return m.reply('Provide a valid web link to fetch!');
      if (!/^https?:\/\//i.test(text)) return m.reply('Please provide a URL starting with http:// or https://');
      try {
        const response = await fetch(text);
        const html = await response.text();
        const $ = cheerio.load(html);
        const cssFiles = [];
        $('link[rel="stylesheet"]').each((_, el) => { let href = $(el).attr('href'); if (href) cssFiles.push(href); });
        const jsFiles = [];
        $('script[src]').each((_, el) => { let src = $(el).attr('src'); if (src) jsFiles.push(src); });
        await m.reply(`**Full HTML Content**:\n\n${html}`);
        if (cssFiles.length > 0) {
          for (const cssFile of cssFiles) {
            const cssResponse = await fetch(new URL(cssFile, text));
            const cssContent = await cssResponse.text();
            await m.reply(`**CSS File Content**:\n\n${cssContent}`);
          }
        } else {
          await m.reply('No external CSS files found.');
        }
        if (jsFiles.length > 0) {
          for (const jsFile of jsFiles) {
            const jsResponse = await fetch(new URL(jsFile, text));
            const jsContent = await jsResponse.text();
            await m.reply(`**JavaScript File Content**:\n\n${jsContent}`);
          }
        } else {
          await m.reply('No external JavaScript files found.');
        }
      } catch (err) {
        m.reply('Failed to inspect the URL: ' + err.message);
      }
    }
  },

  {
    command: ['dlt', 'dil'],
    description: "Delete the bot's own quoted message",
    category: 'others',
    handler: async (client, m, { reply }) => {
      if (!m.quoted) return reply('No message quoted for deletion');
      let { isBaileys } = m.quoted;
      if (isBaileys) return reply('I cannot delete. Quoted message is my message or another bot message.');
      client.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: true, id: m.quoted.id, participant: m.quoted.sender } });
    }
  },
  
  {
    command: ['news'],
    description: 'Get a random BBC tech news article',
    category: 'others',
    handler: async (client, m, { reply }) => {
      try {
        const cheerio = require('cheerio');
        const rssRes = await global.axios.get('https://feeds.bbci.co.uk/news/technology/rss.xml', { headers: { 'User-Agent': 'Mozilla/5.0' } });
        const $ = cheerio.load(rssRes.data, { xmlMode: true });
        const items = [];
        $('item').each((_, el) => {
          const title       = $(el).find('title').text();
          const description = $(el).find('description').text();
          const link        = $(el).find('link').text();
          const pubDate     = $(el).find('pubDate').text();
          const thumbnail   = $(el).find('media\\:thumbnail, thumbnail').attr('url') || 'https://news.bbcimg.co.uk/nol/shared/img/bbc_news_120x60.gif';
          if (title) items.push({ title, description, link, pubDate, thumbnail });
        });
        if (!items.length) return reply('❌ Could not fetch news right now. Try again later.');
        const article = items[Math.floor(Math.random() * items.length)];
        const caption =
          `📰 *${article.title}*\n\n${article.description}\n\n🗓️ ${article.pubDate}\n🔗 ${article.link}`;
        await client.sendMessage(m.chat, { image: { url: article.thumbnail }, caption }, { quoted: m });
      } catch (err) {
        reply('❌ Failed to fetch news. Please try again.');
      }
    }
  },

  {
    command: ['anime', 'random-anime'],
    description: 'Get a random anime',
    category: 'others',
    handler: async (client, m, { reply }) => {
      try {
        const response = await global.axios.get('https://api.jikan.moe/v4/random/anime');
        const data = response.data.data;
        const title = data.title;
        const synopsis = data.synopsis;
        const imageUrl = data.images.jpg.image_url;
        const episodes = data.episodes;
        const status = data.status;
        const message = `📺 Title: ${title}\n🎬 Épisodes: ${episodes}\n📡 Status: ${status}\n📝 Synopsis: ${synopsis}\n🔗 URL: ${data.url}`;
        await client.sendMessage(m.chat, { image: { url: imageUrl }, caption: message }, { quoted: m });
      } catch {
        m.reply('𝗢𝗼𝗽𝘀 𝗘𝗿𝗿𝗼𝗿!');
      }
    }
  },

  {
    command: ['mail'],
    description: 'Create a temporary email address',
    category: 'others',
    handler: async (client, m, { reply }) => {
      try {
        const res = await global.axios.get('https://apis.xcasper.space/api/tempmail?action=create');
        if (!res.data.success) return m.reply('Failed to create temp email. Try again.');
        const { email, token } = res.data;
        const tokenMsg = await client.sendMessage(m.chat, { text: token }, { quoted: m });
        await client.sendMessage(m.chat, {
          text: `📧 *Temp Email Created*\n\n*Email:* ${email}\n\n_Quoted message is your token._\nTo check your inbox use:\n*.inbox ${email} <your-token>*`
        }, { quoted: tokenMsg });
      } catch (e) {
        m.reply('Failed to generate temp email. Try again later.');
      }
    }
  },

  {
    command: ['inbox'],
    description: 'Check your temporary email inbox',
    category: 'others',
    handler: async (client, m, { reply, text }) => {
      if (!text) return m.reply('Usage: .inbox <email> <token>');
      const parts = text.trim().split(' ');
      if (parts.length < 2) return m.reply('Usage: .inbox <email> <token>\n\nBoth email and token are required.');
      const [inboxEmail, inboxToken] = parts;
      try {
        const res = await global.axios.get(`https://apis.xcasper.space/api/tempmail?action=check&email=${encodeURIComponent(inboxEmail)}&token=${encodeURIComponent(inboxToken)}`);
        if (!res.data.success) return m.reply('Failed to check inbox. Make sure email and token are correct.');
        const messages = res.data.messages;
        if (!messages || messages.length === 0) return m.reply('📭 Your inbox is empty. No messages yet.');
        for (const msg of messages) {
          const from = msg.from?.address || msg.from || 'Unknown';
          const subject = msg.subject || '(no subject)';
          const date = msg.createdAt ? new Date(msg.createdAt).toLocaleString() : 'Unknown';
          const intro = msg.intro || msg.text || '(no preview)';
          await m.reply(`📩 *New Message*\n\n👤 *From:* ${from}\n📝 *Subject:* ${subject}\n🕐 *Date:* ${date}\n\n${intro}`);
        }
      } catch (e) {
        m.reply('Failed to fetch inbox. Try again later.');
      }
    }
  },

  {
    command: ['system'],
    description: 'Show bot system info',
    category: 'others',
    handler: async (client, m, { Rspeed }) => {
      const { runtime } = require('../lib/ravenfunc');
      client.sendMessage(m.chat, {
        image: { url: 'https://files.catbox.moe/s5nuh3.jpg' },
        caption:
          `*𝐁𝐎𝐓 𝐍𝐀𝐌𝐄: 𝐁𝐋𝐀𝐂𝐊-MD*\n\n` +
          `*𝐒𝐏𝐄𝐄𝐃: ${Rspeed.toFixed(4)} 𝐌𝐒*\n\n` +
          `*𝐑𝐔𝐍𝐓𝐈𝐌𝐄: ${runtime(process.uptime())}*\n\n` +
          `*𝐏𝐋𝐀𝐓𝐅𝐎𝐑𝐌: 𝐇𝐄𝐑𝐎𝐊𝐔*\n\n` +
          `*𝐇𝐎𝐒𝐓𝐍𝐀𝐌𝐄: 𝐁𝐋𝐀𝐂𝐊𝐈𝐄*\n\n` +
          `*𝐋𝐈𝐁𝐑𝐀𝐑𝐘: Baileys*\n\n` +
          `𝐃𝐄𝐕𝐄𝐋𝐎𝐏𝐄𝐑: 𝐁𝐋𝐀𝐂𝐊𝐈𝐄 𝐓𝐄𝐂𝐇`
      }, { quoted: m });
    }
  },

  ];
