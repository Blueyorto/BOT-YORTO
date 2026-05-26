'use strict';

const fs = require('fs');

module.exports = [

  {
    command: ['s', 'sticker'],
    description: 'Convert image/video to sticker',
    category: 'media',
    handler: async (client, m, { reply, msgR }) => {
      const { Sticker, StickerTypes } = require('wa-sticker-formatter');
      const pushname = m.pushName || 'No Name';
      if (!msgR) return m.reply('Quote an image or a short video.');
      let media;
      if (msgR.imageMessage) media = msgR.imageMessage;
      else if (msgR.videoMessage) media = msgR.videoMessage;
      else return m.reply('That is neither an image nor a short video!');
      let result = await client.downloadAndSaveMediaMessage(media);
      let stickerResult = new Sticker(result, {
        pack: pushname,
        type: StickerTypes.FULL,
        categories: ['🤩', '🎉'],
        id: '12345',
        quality: 70,
        background: 'transparent',
      });
      const buf = await stickerResult.toBuffer();
      client.sendMessage(m.chat, { sticker: buf }, { quoted: m });
    }
  },

  {
    command: ['take'],
    description: 'Retake/rewatermark a sticker',
    category: 'media',
    handler: async (client, m, { reply, msgR }) => {
      const { Sticker, StickerTypes } = require('wa-sticker-formatter');
      const pushname = m.pushName || 'No Name';
      if (!msgR) return m.reply('Quote an image, a short video or a sticker to change watermark.');
      let media;
      if (msgR.imageMessage) media = msgR.imageMessage;
      else if (msgR.videoMessage) media = msgR.videoMessage;
      else if (msgR.stickerMessage) media = msgR.stickerMessage;
      else return m.reply('This is neither a sticker, image nor a video...');
      let result = await client.downloadAndSaveMediaMessage(media);
      let stickerResult = new Sticker(result, {
        pack: pushname,
        type: StickerTypes.FULL,
        categories: ['🤩', '🎉'],
        id: '12345',
        quality: 70,
        background: 'transparent',
      });
      const buf = await stickerResult.toBuffer();
      client.sendMessage(m.chat, { sticker: buf }, { quoted: m });
    }
  },

  {
    command: ['vv', 'retrieve'],
    description: 'Retrieve a view-once message (to chat)',
    category: 'media',
    handler: async (client, m) => {
      if (!m.quoted) return m.reply('Quote a viewonce message');
      const quotedMessage = m.msg?.contextInfo?.quotedMessage;
      if (!quotedMessage) return m.reply('Could not find the viewonce message.');
      if (quotedMessage.imageMessage) {
        let imageCaption = quotedMessage.imageMessage.caption;
        let imageUrl = await client.downloadAndSaveMediaMessage(quotedMessage.imageMessage);
        client.sendMessage(m.chat, { image: { url: imageUrl }, caption: `Retrieved by 𝐁𝐋𝐀𝐂𝐊-𝐌𝐃!\n${imageCaption}` }, { quoted: m });
      }
      if (quotedMessage.videoMessage) {
        let videoCaption = quotedMessage.videoMessage.caption;
        let videoUrl = await client.downloadAndSaveMediaMessage(quotedMessage.videoMessage);
        client.sendMessage(m.chat, { video: { url: videoUrl }, caption: `Retrieved by 𝐁𝐋𝐀𝐂𝐊-𝐌𝐃!\n${videoCaption}` }, { quoted: m });
      }
    }
  },

  {
    command: ['vv2', 'mmmh'],
    description: 'Retrieve a view-once message (to DM)',
    category: 'media',
    handler: async (client, m) => {
      if (!m.quoted) return m.reply('Quote a viewonce message');
      const quotedMessage = m.msg?.contextInfo?.quotedMessage;
      if (!quotedMessage) return m.reply('Could not find the viewonce message.');
      if (quotedMessage.imageMessage) {
        let imageCaption = quotedMessage.imageMessage.caption;
        let imageUrl = await client.downloadAndSaveMediaMessage(quotedMessage.imageMessage);
        client.sendMessage(client.user.id, { image: { url: imageUrl }, caption: `Retrieved by Blackie!\n${imageCaption}` }, { quoted: m });
      }
      if (quotedMessage.videoMessage) {
        let videoCaption = quotedMessage.videoMessage.caption;
        let videoUrl = await client.downloadAndSaveMediaMessage(quotedMessage.videoMessage);
        client.sendMessage(client.user.id, { video: { url: videoUrl }, caption: `Retrieved by Blackie!\n${videoCaption}` }, { quoted: m });
      }
    }
  },

  {
    command: ['dp', 'pp'],
    description: 'Get profile picture of a tagged user',
    category: 'media',
    handler: async (client, m, { reply }) => {
      if (!m.quoted) return reply('Tag a user!');
      let ha = m.quoted.sender;
      let qd, pp2;
      try {
        qd = await client.getName(ha);
        pp2 = await client.profilePictureUrl(ha, 'image');
      } catch {
        pp2 = 'https://tinyurl.com/yx93l6da';
        qd = ha.split('@')[0];
      }
      client.sendMessage(m.chat, { image: { url: pp2 }, caption: `Profile Picture of ${qd}`, fileLength: '999999999999' }, { quoted: m });
    }
  },

  {
    command: ['botpp', 'botdp'],
    description: 'Get or change the bot profile picture',
    category: 'media',
    handler: async (client, m, { Owner, NotOwner, quoted, mime, reply }) => {
      if (!Owner) return reply(NotOwner);
      if (!quoted) {
        let pp;
        try { pp = await client.profilePictureUrl(client.user.id, 'image'); }
        catch { pp = 'https://tinyurl.com/yx93l6da'; }
        return client.sendMessage(m.chat, { image: { url: pp }, caption: "Bot's current profile picture" }, { quoted: m });
      }
      if (!/image/.test(mime)) return reply('Send an image to change the bot profile picture');
      let media = await client.downloadAndSaveMediaMessage(quoted);
      await client.updateProfilePicture(client.user.id, { url: media }).catch(() => {});
      reply('Bot profile picture updated!');
    }
  },

  {
    command: ['getpfp', 'getpp', 'getdp', 'profilepic'],
    description: 'Get the profile picture of any number',
    category: 'media',
    handler: async (client, m, { reply, text }) => {
      let jid = text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : m.quoted?.sender || m.sender;
      let pp;
      try { pp = await client.profilePictureUrl(jid, 'image'); }
      catch { return reply('Could not fetch profile picture. The number may not exist or has hidden their picture.'); }
      client.sendMessage(m.chat, { image: { url: pp }, caption: `Profile picture of @${jid.split('@')[0]}` }, { quoted: m });
    }
  },

  {
    command: ['tovideo', 'mp4', 'tovid'],
    description: 'Convert animated sticker to video',
    category: 'media',
    handler: async (client, m, { reply, quoted, mime, prefix, command }) => {
      const { webp2mp4File } = require('../lib/ravenupload');
      if (!quoted) return reply(`📎 Reply to an *animated sticker* with *${prefix + command}* to convert it to a video`);
      if (!/webp/.test(mime)) return reply(`⚠️ That's not a sticker. Reply to an animated sticker with *${prefix + command}*`);
      let media, outputPath;
      try {
        await m.reply('🎬 _Converting sticker to video..._');
        media = await client.downloadMediaMessage(quoted);
        const converted = await webp2mp4File(media);
        outputPath = converted.result;
        const videoBuffer = fs.readFileSync(outputPath);
        await client.sendMessage(m.chat, { video: videoBuffer, caption: '🎬 *Sticker → Video*\n_Converted with ffmpeg_' }, { quoted: m });
      } catch (err) {
        m.reply('❌ Conversion failed. Make sure it is an *animated* sticker (not a static one).');
      } finally {
        try { if (media) fs.unlinkSync(media); } catch {}
        try { if (outputPath) fs.unlinkSync(outputPath); } catch {}
      }
    }
  },

  {
    command: ['toaudio', 'audioe'],
    description: 'Convert video to audio',
    category: 'media',
    handler: async (client, m, { reply, quoted, mime }) => {
      if (!quoted) return reply('Reply to a video message to convert it to audio.');
      if (!/video/.test(mime)) return reply('Reply to a *video* message.');
      await reply('🎵 _Converting video to audio..._');
      const buffer = await client.downloadMediaMessage(quoted);
      const tmpIn = `tmp_in_${Date.now()}.mp4`;
      const tmpOut = `tmp_out_${Date.now()}.mp3`;
      fs.writeFileSync(tmpIn, buffer);
      const { exec } = require('child_process');
      exec(`ffmpeg -i ${tmpIn} -vn -acodec libmp3lame ${tmpOut}`, async (err) => {
        if (err) {
          m.reply('❌ Conversion failed.');
        } else {
          await client.sendMessage(m.chat, { audio: fs.readFileSync(tmpOut), mimetype: 'audio/mpeg', fileName: 'audio.mp3' }, { quoted: m });
        }
        try { fs.unlinkSync(tmpIn); } catch {}
        try { fs.unlinkSync(tmpOut); } catch {}
      });
    }
  },

];
