'use strict';

const api = 'https://apis.keithsite.top';

module.exports = [

  {
    command: ['play', 'ytmp3', 'yta'],
    description: 'Play/download audio from YouTube',
    category: 'music',
    handler: async (client, m, { reply, text }) => {
      if (!text) return reply('Provide a song name or YouTube URL. E.g: .play Alan Walker Alone');
      await reply('🎵 _Searching..._');
      const search = await global.axios.get(`${api}/search/yts`, { params: { query: text } });
      const videos = search.data?.result;
      if (!Array.isArray(videos) || videos.length === 0) return reply(`❌ No results found for: *${text}*`);
      const video = videos[0];
      await reply(`🎵 *Downloading:* ${video.title}\n⏱️ Duration: ${video.duration?.timestamp || 'unknown'}`);
      const download = await global.axios.get(`${api}/download/audio`, { params: { url: video.url } });
      const downloadUrl = download.data?.result;
      if (!downloadUrl) return reply('❌ Download failed. Try again later.');
      await client.sendMessage(m.chat, {
        audio: { url: downloadUrl },
        mimetype: 'audio/mpeg',
        fileName: `${video.title}.mp3`
      }, { quoted: m });
      await client.sendMessage(m.chat, {
        document: { url: downloadUrl },
        mimetype: 'audio/mpeg',
        fileName: `${video.title}.mp3`
      }, { quoted: m });
    }
  },

  {
    command: ['ytv', 'video', 'ytmp4'],
    description: 'Download video from YouTube',
    category: 'music',
    handler: async (client, m, { reply, text }) => {
      if (!text) return reply('Provide a video name or YouTube URL. E.g: .ytv Alan Walker Alone');
      await reply('🎬 _Searching..._');
      const search = await global.axios.get(`${api}/search/yts`, { params: { query: text } });
      const videos = search.data?.result;
      if (!Array.isArray(videos) || videos.length === 0) return reply(`❌ No results found for: *${text}*`);
      const video = videos[0];
      if (video.duration?.seconds > 600) return reply('❌ Video is too long (max 10 minutes).');
      await reply(`🎬 *Downloading:* ${video.title}\n⏱️ Duration: ${video.duration?.timestamp || 'unknown'}`);
      const download = await global.axios.get(`${api}/download/video`, { params: { url: video.url } });
      const downloadUrl = download.data?.result;
      if (!downloadUrl) return reply('❌ Download failed. Try again later.');
      await client.sendMessage(m.chat, {
        video: { url: downloadUrl },
        caption: `🎬 *${video.title}*`,
        fileName: `${video.title}.mp4`
      }, { quoted: m });
    }
  },

  {
    command: ['ytsearch', 'yts'],
    description: 'Search YouTube',
    category: 'music',
    handler: async (client, m, { reply, text }) => {
      if (!text) return reply('Provide a search term. E.g: .yts Alan Walker Alone');
      const yts = require('yt-search');
      const { videos } = await yts(text);
      if (!videos || videos.length === 0) return reply(`No matching videos found for: *${text}*`);
      const length = Math.min(videos.length, 10);
      let tex = `📺 *YouTube Search*\n🔍 Query: ${text}\n\n`;
      for (let i = 0; i < length; i++) {
        tex += `*${i + 1}.* ${videos[i].title}\n🔗 ${videos[i].url}\n📺 ${videos[i].author.name}\n\n`;
      }
      reply(tex);
    }
  },

  {
    command: ['whatsong', 'shazam'],
    description: 'Identify a song from audio/video',
    category: 'music',
    handler: async (client, m, { reply }) => {
      try {
        if (!m.quoted) return reply('Quote a short audio or video to identify the song.');
        let d = m.quoted;
        let mimes = (d.msg || d).mimetype || d.mediaType || '';
        if (!/video|audio/i.test(mimes)) return reply('Quote an audio or video message.');
        await reply('🎵 Analyzing the media...');
        let buffer = await client.downloadMediaMessage(d);
        const acrcloud = require('acrcloud');
        let acr = new acrcloud({
          host: 'identify-eu-west-1.acrcloud.com',
          access_key: '2631ab98e77b49509e3edcf493757300',
          access_secret: 'KKbVWlTNCL3JjxjrWnywMdvQGanyhKRN0fpQxyUo'
        });
        let { status, metadata } = await acr.identify(buffer);
        if (status.code !== 0) return reply('❌ Could not identify the song. Try a clearer audio.');
        let { title, artists, album, genres, release_date } = metadata.music[0];
        let artistNames = artists ? artists.map(a => a.name).join(', ') : 'Unknown';
        let txt = `🎵 *Song Identified!*\n\n*• Title:* ${title}\n*• Artists:* ${artistNames}\n` +
          (album ? `*• Album:* ${album.name}\n` : '') +
          (genres ? `*• Genres:* ${genres.map(g => g.name).join(', ')}\n` : '') +
          (release_date ? `*• Released:* ${release_date}\n` : '') +
          `\n⬇️ Downloading...`;
        let infoMsg = await client.sendMessage(m.chat, { text: txt }, { quoted: m });
        let search = await global.axios.get(`${api}/search/yts?query=${encodeURIComponent(title + ' ' + artistNames)}`);
        let videos = search.data?.result;
        if (!Array.isArray(videos) || videos.length === 0) {
          return client.sendMessage(m.chat, { text: txt.replace('⬇️ Downloading...', '❌ No YouTube match found.'), edit: infoMsg.key });
        }
        let videoUrl = videos[0].url;
        let videoTitle = videos[0].title;
        let download = await global.axios.get(`${api}/download/audio?url=${encodeURIComponent(videoUrl)}`);
        let downloadUrl = download.data?.result;
        if (!downloadUrl) {
          return client.sendMessage(m.chat, { text: txt.replace('⬇️ Downloading...', '❌ Download failed.'), edit: infoMsg.key });
        }
        let fileName = `${title} - ${artistNames}.mp3`.replace(/[^\w\s.-]/gi, '');
        await client.sendMessage(m.chat, { audio: { url: downloadUrl }, mimetype: 'audio/mpeg', fileName }, { quoted: m });
        await client.sendMessage(m.chat, { document: { url: downloadUrl }, mimetype: 'audio/mpeg', fileName }, { quoted: m });
        await client.sendMessage(m.chat, { text: txt.replace('⬇️ Downloading...', `✅ Successfully Downloaded *${videoTitle}*`), edit: infoMsg.key });
      } catch (err) {
        reply('❌ Something went wrong identifying or downloading the song.');
      }
    }
  },

  {
    command: ['spotify'],
    description: 'Download from Spotify',
    category: 'music',
    handler: async (client, m, { reply, text }) => {
      if (!text) return reply('Provide a Spotify link or song name. E.g: .spotify Shape of You');
      await reply('🎵 _Processing Spotify request..._');
      const res = await global.axios.get(`${api}/download/spotify`, { params: { q: text } });
      const data = res.data?.result || res.data;
      if (!data || !data.url) return reply('❌ Could not fetch from Spotify. Try a different song.');
      await client.sendMessage(m.chat, {
        audio: { url: data.url },
        mimetype: 'audio/mpeg',
        fileName: `${data.title || 'spotify'}.mp3`
      }, { quoted: m });
    }
  },

];
