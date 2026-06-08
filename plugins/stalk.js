'use strict';

const axios = global.axios || require('axios');

function formatNum(n) {
  if (!n && n !== 0) return 'N/A';
  n = Number(n);
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + 'B';
  if (n >= 1_000_000)     return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000)         return (n / 1_000).toFixed(1) + 'K';
  return n.toString();
}

function getUsername(text) {
  return text.trim()
    .replace(/https?:\/\/(www\.)?(instagram\.com|tiktok\.com|twitter\.com|x\.com|facebook\.com)\/@?/i, '')
    .replace(/^@/, '')
    .split(/[/?#]/)[0]
    .trim();
}

module.exports = [

  // ── INSTAGRAM ──────────────────────────────────────────────────────────────
  {
    command: ['igstalk'],
    aliases: ['instastalk', 'stalkim', 'ig'],
    description: 'Stalk an Instagram profile',
    category: 'stalk',
    handler: async (client, m, { reply, text }) => {
      if (!text) return reply('📸 Usage: *.igstalk <username>*\nExample: *.igstalk cristiano*');
      const username = getUsername(text);
      try {
        reply(`🔍 Fetching *@${username}* on Instagram...`);
        const res = await axios.get(
          `https://i.instagram.com/api/v1/users/web_profile_info/?username=${encodeURIComponent(username)}`,
          {
            headers: {
              'User-Agent': 'Instagram 219.0.0.12.117 Android (28/9; 411dpi; 1080x2176; Xiaomi; MI 8; dipper; qcom; en_US; 302733750)',
              'Accept': '*/*',
              'X-IG-Capabilities': '3brTvw==',
              'X-IG-Connection-Type': 'WIFI',
            },
            timeout: 15000,
          }
        );

        const u = res.data?.data?.user;
        if (!u) return reply('❌ User not found or profile is private.');

        const caption =
          `📸 *Instagram Profile*\n\n` +
          `👤 *Name:* ${u.full_name || username}\n` +
          `🔖 *Username:* @${u.username}\n` +
          `📝 *Bio:* ${u.biography || 'N/A'}\n` +
          `🌐 *Website:* ${u.external_url || 'None'}\n\n` +
          `📊 *Stats*\n` +
          `👥 *Followers:* ${formatNum(u.edge_followed_by?.count)}\n` +
          `➡️ *Following:* ${formatNum(u.edge_follow?.count)}\n` +
          `🖼️ *Posts:* ${formatNum(u.edge_owner_to_timeline_media?.count)}\n\n` +
          `🔒 *Private:* ${u.is_private ? 'Yes' : 'No'}\n` +
          `✅ *Verified:* ${u.is_verified ? 'Yes ✔️' : 'No'}\n` +
          `🏢 *Business:* ${u.is_business_account ? 'Yes' : 'No'}\n\n` +
          `🔗 https://instagram.com/${u.username}`;

        const pfp = u.profile_pic_url_hd || u.profile_pic_url;
        if (pfp) {
          await client.sendMessage(m.chat, { image: { url: pfp }, caption }, { quoted: m });
        } else {
          await client.sendMessage(m.chat, { text: caption }, { quoted: m });
        }
      } catch (err) {
        console.error('igstalk error:', err.message);
        reply('❌ Could not fetch Instagram profile. Username may not exist.');
      }
    }
  },

  // ── TIKTOK ─────────────────────────────────────────────────────────────────
  {
    command: ['ttstalk'],
    aliases: ['tikstalk', 'tiktokstalk', 'tt'],
    description: 'Stalk a TikTok profile',
    category: 'stalk',
    handler: async (client, m, { reply, text }) => {
      if (!text) return reply('🎵 Usage: *.ttstalk <username>*\nExample: *.ttstalk charlidamelio*');
      const username = getUsername(text);
      try {
        reply(`🔍 Fetching *@${username}* on TikTok...`);

        const res = await axios.get(`https://www.tiktok.com/@${encodeURIComponent(username)}`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9',
          },
          timeout: 15000,
        });

        const html = res.data;

        // Try to extract embedded JSON data
        let user = null, stats = null;
        const scriptMatch = html.match(/<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__"[^>]*>([\s\S]*?)<\/script>/);
        if (scriptMatch) {
          try {
            const find = (obj, check, depth = 0) => {
              if (depth > 8 || !obj || typeof obj !== 'object') return null;
              if (check(obj)) return obj;
              for (const v of Object.values(obj)) { const r = find(v, check, depth + 1); if (r) return r; }
              return null;
            };
            const pageData = JSON.parse(scriptMatch[1]);
            user  = find(pageData, o => o.uniqueId && o.nickname);
            stats = find(pageData, o => 'followerCount' in o && 'followingCount' in o);
          } catch (_) {}
        }

        // Fallback to og meta tags
        const getMeta = (prop) => html.match(new RegExp(`<meta[^>]+property=["']og:${prop}["'][^>]+content=["']([^"']+)["']`, 'i'))?.[1]
                                || html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:${prop}["']`, 'i'))?.[1];

        if (!user) {
          const caption =
            `🎵 *TikTok Profile*\n\n` +
            `👤 *Username:* @${username}\n` +
            `📌 *Title:* ${getMeta('title') || 'N/A'}\n` +
            `📝 *About:* ${getMeta('description') || 'N/A'}\n\n` +
            `🔗 https://tiktok.com/@${username}`;
          const img = getMeta('image');
          if (img) return await client.sendMessage(m.chat, { image: { url: img }, caption }, { quoted: m });
          return await client.sendMessage(m.chat, { text: caption }, { quoted: m });
        }

        const caption =
          `🎵 *TikTok Profile*\n\n` +
          `👤 *Name:* ${user.nickname}\n` +
          `🔖 *Username:* @${user.uniqueId}\n` +
          `📝 *Bio:* ${user.signature || 'N/A'}\n\n` +
          `📊 *Stats*\n` +
          `👥 *Followers:* ${formatNum(stats?.followerCount)}\n` +
          `➡️ *Following:* ${formatNum(stats?.followingCount)}\n` +
          `❤️ *Likes:* ${formatNum(stats?.heartCount || stats?.heart)}\n` +
          `🎬 *Videos:* ${formatNum(stats?.videoCount)}\n\n` +
          `✅ *Verified:* ${user.verified ? 'Yes ✔️' : 'No'}\n` +
          `🔒 *Private:* ${user.privateAccount ? 'Yes' : 'No'}\n\n` +
          `🔗 https://tiktok.com/@${user.uniqueId}`;

        const pfp = user.avatarLarger || user.avatarMedium;
        if (pfp) {
          await client.sendMessage(m.chat, { image: { url: pfp }, caption }, { quoted: m });
        } else {
          await client.sendMessage(m.chat, { text: caption }, { quoted: m });
        }
      } catch (err) {
        console.error('ttstalk error:', err.message);
        reply('❌ Could not fetch TikTok profile. Username may not exist.');
      }
    }
  },

  // ── TWITTER / X ────────────────────────────────────────────────────────────
  {
    command: ['twstalk'],
    aliases: ['twitterstalk', 'xstalk', 'tw'],
    description: 'Stalk a Twitter/X profile',
    category: 'stalk',
    handler: async (client, m, { reply, text }) => {
      if (!text) return reply('🐦 Usage: *.twstalk <username>*\nExample: *.twstalk elonmusk*');
      const username = getUsername(text);
      try {
        reply(`🔍 Fetching *@${username}* on Twitter/X...`);

        const res = await axios.get(`https://api.fxtwitter.com/${encodeURIComponent(username)}`, {
          timeout: 15000,
        });

        const u = res.data?.user;
        if (!u) return reply('❌ User not found or account is private/suspended.');

        const joined = u.joined ? new Date(u.joined).toDateString() : 'N/A';

        const caption =
          `🐦 *Twitter / X Profile*\n\n` +
          `👤 *Name:* ${u.name}\n` +
          `🔖 *Username:* @${u.screen_name}\n` +
          `📝 *Bio:* ${u.description || 'N/A'}\n` +
          `📍 *Location:* ${u.location || 'N/A'}\n` +
          `🌐 *Website:* ${u.website || 'None'}\n` +
          `📅 *Joined:* ${joined}\n\n` +
          `📊 *Stats*\n` +
          `👥 *Followers:* ${formatNum(u.followers)}\n` +
          `➡️ *Following:* ${formatNum(u.following)}\n` +
          `🐦 *Tweets:* ${formatNum(u.tweets)}\n` +
          `❤️ *Likes:* ${formatNum(u.likes)}\n\n` +
          `✅ *Verified:* ${u.verification?.verified ? 'Yes ✔️' : 'No'}\n` +
          `🔒 *Protected:* ${u.protected ? 'Yes' : 'No'}\n\n` +
          `🔗 https://x.com/${u.screen_name}`;

        const pfp = u.avatar_url?.replace('_normal', '_400x400');
        if (pfp) {
          await client.sendMessage(m.chat, { image: { url: pfp }, caption }, { quoted: m });
        } else {
          await client.sendMessage(m.chat, { text: caption }, { quoted: m });
        }
      } catch (err) {
        console.error('twstalk error:', err.message);
        reply('❌ Could not fetch Twitter profile. Username may not exist or account is suspended.');
      }
    }
  },

  // ── FACEBOOK ───────────────────────────────────────────────────────────────
  {
    command: ['fbstalk'],
    aliases: ['facebookstalk', 'stalkfb', 'fb'],
    description: 'Stalk a Facebook profile or page',
    category: 'stalk',
    handler: async (client, m, { reply, text }) => {
      if (!text) return reply('📘 Usage: *.fbstalk <username>*\nExample: *.fbstalk zuck*');
      const username = getUsername(text);
      try {
        reply(`🔍 Fetching *${username}* on Facebook...`);

        const res = await axios.get(`https://www.facebook.com/${encodeURIComponent(username)}`, {
          headers: {
            'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
            'Accept-Language': 'en-US,en;q=0.9',
          },
          timeout: 15000,
          maxRedirects: 5,
        });

        const html = res.data;
        const getMeta = (prop) =>
          html.match(new RegExp(`<meta[^>]+property=["']og:${prop}["'][^>]+content=["']([^"']+)["']`, 'i'))?.[1]?.trim()
          || html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:${prop}["']`, 'i'))?.[1]?.trim();

        const title       = getMeta('title') || username;
        const description = getMeta('description') || 'N/A';
        const image       = getMeta('image');

        const followersMatch = html.match(/(\d[\d,.]+)\s*(?:people follow|followers)/i);
        const likesMatch     = html.match(/(\d[\d,.]+)\s*(?:people like|likes this)/i);

        const caption =
          `📘 *Facebook Profile*\n\n` +
          `👤 *Name:* ${title}\n` +
          `🔖 *Username:* ${username}\n` +
          `📝 *About:* ${description.replace(/&amp;/g,'&').replace(/&#039;/g,"'")}\n` +
          (followersMatch ? `👥 *Followers:* ${followersMatch[1]}\n` : '') +
          (likesMatch     ? `👍 *Likes:* ${likesMatch[1]}\n`         : '') +
          `\n🔗 https://facebook.com/${username}`;

        if (image && !image.includes('static.xx')) {
          await client.sendMessage(m.chat, { image: { url: image }, caption }, { quoted: m });
        } else {
          await client.sendMessage(m.chat, { text: caption }, { quoted: m });
        }
      } catch (err) {
        console.error('fbstalk error:', err.message);
        reply(
          `📘 *Facebook: ${username}*\n\n` +
          `⚠️ Facebook blocks automated lookups for private profiles.\n\n` +
          `🔗 View manually: https://facebook.com/${username}`
        );
      }
    }
  },

  {
    command: ['whois'],
    aliases: ['wacheck', 'wainfo', 'numberinfo', 'whoami'],
    description: 'Look up a WhatsApp number — name, profile picture, and about',
    category: 'stalk',
    handler: async (client, m, { reply, text, quoted }) => {
      // ── Resolve the target number ──────────────────────────────────────
      let jid;

      if (m.mentionedJid?.length > 0) {
        jid = m.mentionedJid[0];

      } else if (quoted) {
        jid = quoted.sender || quoted.key?.participant || quoted.key?.remoteJid;

      } else if (text) {
        const num = text.replace(/[^0-9]/g, '').trim();
        if (!num) return reply('📱 Usage: *.whois <number>*\nExample: *.whois 254712345678*\nOr reply to someone\'s message.');
        jid = num + '@s.whatsapp.net';

      } else {
        return reply(
          '📱 *Whois — WhatsApp Lookup*\n\n' +
          'Usage:\n' +
          '• *.whois 254712345678* — lookup a number\n' +
          '• Reply to any message with *.whois* — lookup that person\n' +
          '• *.whois @mention* — lookup a mentioned person'
        );
      }

      if (jid && !jid.includes('@')) jid = jid + '@s.whatsapp.net';

      try {
        // ── Check if number is on WhatsApp ─────────────────────────────
        let exists = true;
        try {
          const check = await client.onWhatsApp(jid.replace('@s.whatsapp.net', ''));
          if (!check || check.length === 0) exists = false;
          else jid = check[0].jid || jid;
        } catch (_) {}

        if (!exists) {
          const num = jid.split('@')[0];
          return reply(`❌ *+${num}* is not registered on WhatsApp.`);
        }

        const num = jid.split('@')[0];
        let name   = null;
        let about  = null;
        let pfpUrl = null;

        // Profile picture
        try {
          pfpUrl = await client.profilePictureUrl(jid, 'image');
        } catch (_) { pfpUrl = null; }

        // About / status
        try {
          const status = await client.fetchStatus(jid);
          about = status?.status || null;
        } catch (_) { about = null; }

        // Display name from contacts store
        try {
          const contact = client.store?.contacts?.[jid];
          name = contact?.notify || contact?.name || contact?.verifiedName || null;
        } catch (_) {}

        // Fallback: name from reply
        if (!name && quoted) name = quoted.pushName || null;

        const caption =
          `📱 *WhatsApp Lookup*\n\n` +
          `📞 *Number:* +${num}\n` +
          `👤 *Name:* ${name || 'Hidden / Unknown'}\n` +
          `💬 *About:* ${about || 'Hidden / Not set'}\n` +
          `🖼️ *Profile Pic:* ${pfpUrl ? 'Available ✅' : 'Hidden / None ❌'}\n\n` +
          `🔗 *Chat link:* https://wa.me/${num}`;

        if (pfpUrl) {
          await client.sendMessage(m.chat, { image: { url: pfpUrl }, caption }, { quoted: m });
        } else {
          await client.sendMessage(m.chat, { text: caption }, { quoted: m });
        }

      } catch (err) {
        console.error('whois error:', err.message);
        reply('❌ Could not look up that number. Make sure it includes the country code (e.g. 254712345678).');
      }
    }
  }

];
