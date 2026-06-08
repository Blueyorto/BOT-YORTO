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
  handler: async (client, m, { reply, text, api }) => {
    if (!text) return reply('📸 Usage: *.igstalk <username>*\nExample: *.igstalk cristiano*');
    const username = text.trim()
      .replace(/https?:\/\/(www\.)?instagram\.com\//i, '')
      .replace(/^@/, '').split(/[/?#]/)[0].trim();
    try {
      reply(`🔍 Fetching *@${username}* on Instagram...`);

      const res = await axios.get(
        `${api}/stalker/ig?user=${encodeURIComponent(username)}`,
        { timeout: 15000 }
      );

      const d = res.data;
      if (!d || d.status === false) return reply('❌ User not found or profile is private.');

      // Access the result object properly
      const result = d.result;
      
      const caption =
        `📸 *Instagram Profile*\n\n` +
        `👤 *Name:* ${result.name || username}\n` +
        `🔖 *Username:* @${result.username || username}\n` +
        `📝 *Bio:* ${result.bio || 'N/A'}\n` +
        `🌐 *Website:* ${result.bioLinks?.[0]?.url || 'None'}\n\n` +
        `📊 *Stats*\n` +
        `👥 *Followers:* ${formatNum(result.followers || 0)}\n` +
        `➡️ *Following:* ${formatNum(result.following || 0)}\n` +
        `🖼️ *Posts:* ${formatNum(result.posts || 0)}\n\n` +
        `🏢 *Business:* ${result.isBusiness ? 'Yes' : 'No'}\n\n` +
        `📅 *Joined:* ${new Date(result.created_at).toLocaleDateString()}\n\n` +
        `🔗 https://instagram.com/${result.username || username}`;

      const pfp = result.profilePic;
      if (pfp) {
        await client.sendMessage(m.chat, { image: { url: pfp }, caption }, { quoted: m });
      } else {
        await client.sendMessage(m.chat, { text: caption }, { quoted: m });
      }
    } catch (err) {
      console.error('igstalk error:', err.message);
      reply('❌ Could not fetch Instagram profile. Username may not exist or is private.');
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

        const getMeta = (prop) =>
          html.match(new RegExp(`<meta[^>]+property=["']og:${prop}["'][^>]+content=["']([^"']+)["']`, 'i'))?.[1]
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
    const username = text.trim()
      .replace(/https?:\/\/(www\.)?facebook\.com\//i, '')
      .replace(/^@/, '').split(/[/?#]/)[0].trim();

    try {
      reply(`🔍 Fetching *${username}* on Facebook...`);

      const decode = s =>
        (s || '')
          .replace(/&#xb7;/gi, '·').replace(/&#183;/g, '·').replace(/&middot;/g, '·')
          .replace(/&amp;/g, '&').replace(/&#039;/g, "'").replace(/&quot;/g, '"')
          .replace(/&#(\d+);/g, (_, c) => String.fromCharCode(c))
          .replace(/<[^>]+>/g, '').trim();

      const extract = (html, patterns) => {
        for (const re of patterns) {
          const match = html.match(re);
          if (match?.[1]) return decode(match[1]);
        }
        return null;
      };

      // 1. mbasic — simpler HTML, may expose stats
      const mbasicRes = await axios.get(
        `https://mbasic.facebook.com/${encodeURIComponent(username)}`,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          },
          timeout: 15000,
          maxRedirects: 5,
        }
      ).catch(() => null);

      const mhtml = mbasicRes?.data || '';

      // 2. og: meta fallback
      const ogRes = await axios.get(
        `https://www.facebook.com/${encodeURIComponent(username)}`,
        {
          headers: {
            'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
            'Accept-Language': 'en-US,en;q=0.9',
          },
          timeout: 15000,
          maxRedirects: 5,
        }
      ).catch(() => null);

      const ohtml = ogRes?.data || '';

      const getMeta = (prop, html) =>
        html.match(new RegExp(`property=["']og:${prop}["'][^>]+content=["']([^"']+)["']`, 'i'))?.[1]?.trim()
        || html.match(new RegExp(`content=["']([^"']+)["'][^>]+property=["']og:${prop}["']`, 'i'))?.[1]?.trim();

      const name    = decode(getMeta('title', ohtml) || getMeta('title', mhtml)) || username;
      const image   = getMeta('image', ohtml) || getMeta('image', mhtml);
      const isRealImage = image && !image.includes('rsrc.php') && image.length > 80;

      const rawBio  = decode(getMeta('description', ohtml) || getMeta('description', mhtml) || '');
      const bio = rawBio
        .replace(/[\d,]+\s+(followers?|following|likes?|talking about this)(\s*·\s*)?/gi, '')
        .replace(/^[^.]+\.\s*/, '')
        .trim() || 'N/A';

      const followers = extract(mhtml, [
        /([\d,.]+\s*[KMB]?)\s*follower/i,
        /follower[^<]*?(\d[\d,.]*\s*[KMB]?)/i,
      ]) || extract(rawBio, [/([\d,]+)\s*follower/i]) || null;

      const following = extract(mhtml, [
        /([\d,.]+\s*[KMB]?)\s*following/i,
        /following[^<]*?(\d[\d,.]*\s*[KMB]?)/i,
      ]) || extract(rawBio, [/([\d,]+)\s*following/i]) || null;

      const posts = extract(mhtml, [
        /([\d,.]+\s*[KMB]?)\s*posts?/i,
        /posts?[^<]*?(\d[\d,.]*\s*[KMB]?)/i,
      ]) || null;

      const likes = extract(mhtml, [
        /([\d,.]+\s*[KMB]?)\s*(?:people\s+)?like\s+this/i,
        /([\d,.]+\s*[KMB]?)\s*likes?\b/i,
      ]) || extract(rawBio, [/([\d,]+)\s+likes/i]) || null;

      const talking = extract(mhtml, [
        /([\d,.]+\s*[KMB]?)\s*talking about this/i,
        /talking about this[^<]*?(\d[\d,.]*\s*[KMB]?)/i,
      ]) || extract(rawBio, [/([\d,]+)\s+talking about this/i]) || null;

      const caption =
        `📘 *Facebook Profile*\n\n` +
        `👤 *Name:* ${name}\n` +
        `🔖 *Username:* ${username}\n` +
        `📝 *About:* ${bio}\n\n` +
        `📊 *Stats*\n` +
        `👍 *Likes:* ${likes || '---'}\n` +
        `👥 *Followers:* ${followers || '---'}\n` +
        `➡️ *Following:* ${following || '---'}\n` +
        `📸 *Posts:* ${posts || '---'}\n` +
        `💬 *Talking about:* ${talking || '---'}\n\n` +
        `🔗 https://facebook.com/${username}`;

      if (isRealImage) {
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
    }

];
