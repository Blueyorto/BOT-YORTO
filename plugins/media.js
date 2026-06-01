'use strict';

const fs = require('fs');
const axios = global.axios || require('axios');
const { uploadToUguu, Webp2mp4File } = require('../lib/uploads');

module.exports = [

  {
    command: ['sticker'],
    aliases: ['s'],
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
    aliases: ['steal'],
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
    command: ['mix'],
    aliases: ['emojimix'],
    description: 'Mix two emojis into a sticker',
    category: 'media',
    handler: async (client, m, { reply, text }) => {
      const { Sticker, StickerTypes } = require('wa-sticker-formatter');
      const { botname } = require('../set');
      if (!text) return m.reply('No emojis provided?');
      const emojis = text.split('+');
      if (emojis.length !== 2) return m.reply("Specify the emojis and separate with '+'");
      const emoji1 = emojis[0].trim();
      const emoji2 = emojis[1].trim();
      try {
        const response = await global.axios.get(`https://levanter.onrender.com/emix?q=${emoji1}${emoji2}`);
        if (response.data.status === true) {
          let stickerMess = new Sticker(response.data.result, {
            pack: botname,
            type: StickerTypes.CROPPED,
            categories: ['🤩', '🎉'],
            id: '12345',
            quality: 70,
            background: 'transparent'
          });
          const stickerBuffer = await stickerMess.toBuffer();
          client.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m });
        } else {
          m.reply('Unable to create emoji mix.');
        }
      } catch (error) {
        m.reply('An error occurred while creating the emoji mix.' + error);
      }
    }
  },

  {
    command: ['toimg'],
    aliases: ['photo'],
    description: 'Convert a sticker to image',
    category: 'media',
    handler: async (client, m, { reply, mime, quoted }) => {
      const { exec } = require('child_process');
      if (!quoted) return m.reply('Tag a static video with the command!');
      if (!/webp/.test(mime)) return m.reply(`Tag a sticker to convert to photo`);
      const media = await client.downloadAndSaveMediaMessage(quoted);
      const hikari = `./tmp_${Date.now()}.png`;
      exec(`ffmpeg -i ${media} ${hikari}`, (err) => {
        try { fs.unlinkSync(media); } catch {}
        if (err) return m.reply("❌ Conversion failed.");
        const buffer = fs.readFileSync(hikari);
        client.sendMessage(m.chat, { image: buffer, caption: `𝗖𝗼𝗻𝘃𝗲𝗿𝘁𝗲𝗱 𝗯𝘆 𝐁𝐋𝐀𝐂𝐊-𝐌𝐃` }, { quoted: m });
        try { fs.unlinkSync(hikari); } catch {}
      });
    }
  },

  {
    command: ['smeme'],
    aliases: ['write'],
    description: 'Add words to a sticker',
    category: 'media',
    handler: async (client, m, { reply, text, mime, pushname, qmsg }) => {
                let responnd = `Quote an image with the 2 texts separated with |\nExample: smeme top text|bottom text`
                if (!/image/.test(mime)) return reply(responnd)
                if (!text) return reply(responnd)

                const atas = text.split('|')[0] ? text.split('|')[0].trim() : ''
                const bawah = text.split('|')[1] ? text.split('|')[1].trim() : ''

                let dwnld = await client.downloadAndSaveMediaMessage(qmsg)

                const Jimp = require('jimp')
                const { Sticker, StickerTypes } = require('wa-sticker-formatter')
                const image = await Jimp.read(dwnld)
                const imgW = image.bitmap.width
                const imgH = image.bitmap.height

                const fontWhite = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE)
                const fontBlack = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK)

                const pad = 12
                const textW = imgW - pad * 2
                const outlineOffsets = [[-2,-2],[-2,2],[2,-2],[2,2],[-2,0],[2,0],[0,-2],[0,2]]

                if (atas) {
                    for (const [ox, oy] of outlineOffsets) {
                        image.print(fontBlack, pad + ox, pad + oy, { text: atas, alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER }, textW)
                    }
                    image.print(fontWhite, pad, pad, { text: atas, alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER }, textW)
                }

                if (bawah) {
                    const bottomY = imgH - 80
                    for (const [ox, oy] of outlineOffsets) {
                        image.print(fontBlack, pad + ox, bottomY + oy, { text: bawah, alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER }, textW)
                    }
                    image.print(fontWhite, pad, bottomY, { text: bawah, alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER }, textW)
                }

                const memeBuffer = await image.getBufferAsync(Jimp.MIME_JPEG)

                const stickerMeme = new Sticker(memeBuffer, {
                    pack: pushname,
                    type: StickerTypes.FULL,
                    quality: 70,
                    background: 'transparent'
                })
                const stickerBuffer = await stickerMeme.toBuffer()
                await client.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m })

                try { fs.unlinkSync(dwnld) } catch(e) {}
            }
       },
                
  {
    command: ['vv'],
    aliases: ['retrieve'],
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
    command: ['vv2'],
    aliases: ['mmh', 'uhm'], 
    noprefix: ['😂', '😍', '🌚', '🌝', '😊', '😉', '🙄', '😅', '🫠', '🙂', '🥰', '😘', '🤩', '😙', '🤢', '🤔', '🫣'],
    description: 'Retrieve a view-once message (to DM)',
    category: 'media',
    handler: async (client, m, { Owner }) => {
      if (!m.quoted) return;
      if (!Owner) return;
      const quotedMessage = m.msg?.contextInfo?.quotedMessage;
      if (!quotedMessage) await client.sendMessage(client.user.id, { text: 'Could not find the viewonce message.'});
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
    command: ['botpp'],
    aliases: ['botdp'],
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
    command: ['getpfp'],
    aliases: ['dp', 'getpp'],
    description: 'Get the profile picture of any number',
    category: 'media',
    handler: async (client, m, { reply, text }) => {
      let jid = text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : m.quoted?.sender || m.sender;
      let pp;
      try { pp = await client.profilePictureUrl(jid, 'image'); }
      catch { return reply('Could not fetch profile picture. The number has hidden their profile picture or not registered on WhatsApp.'); }
      client.sendMessage(m.chat, { image: { url: pp }, caption: `Profile picture of @${jid.split('@')[0]}` }, { quoted: m });
    }
  },

  {
    command: ['tovideo'],
    aliases: ['mp4', 'tovid'],
    description: 'Convert animated sticker to video',
    category: 'media',
    handler: async (client, m, { reply, quoted, mime, prefix, command }) => {
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
    command: ['toaudio'],
    aliases: ['audioe'],
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
  
  {
    command: ['removebg'],
    aliases: ['rbg'],
    description: 'remove background of a picture',
    category: 'media',
    handler: async (client, m, { reply, api }) => {
    try {
      const mime = m.quoted.mimetype || '';
      if (!m.quoted) return m.reply('Reply to an image to remove its background.');
      if (!/image/.test(mime)) return m.reply('That is not an image. Quote an image and try again.');

      m.reply('A moment, removing the background...');

      const filePath = await client.downloadAndSaveMediaMessage(m.quoted);
      const uploaded = await uploadToUguu(filePath);
      try { require('fs').unlinkSync(filePath); } catch(e) {}

      const res = await axios.get(`${api}/ai/removebg?url=${encodeURIComponent(uploaded)}`);
      if (!res.data || !res.data.result) return m.reply('Failed to remove background. Try again.');

      await client.sendMessage(m.chat, {
        image: { url: res.data.result },
        caption: 'Edited by BLACK-MD'
      }, { quoted: m });

    } catch (err) {
      m.reply('An error occurred: ' + err.message);
    }
  }
  },
  
  {
  command: ['similarimage'],
  aliases: ['reverseimage', 'ri'],
  description: 'Find similar images using reverse image search',
  category: 'media',
  handler: async (client, m, { reply, from, api, mime }) => {
    if (!m.quoted) return m.reply('Reply to an image only.');
    if (!/image/.test(mime)) return reply('📌 That is not an image!');
    try {
      await reply('🔎 Searching for similar images...');
      // Download the quoted image
      const buf = await client.downloadMediaMessage(m.quoted);
      
      const imageUrl = await uploadToUguu(buf);
      // Call reverse image API
      const res = await global.axios.get(`${api}/search/reverseimage?url=${encodeURIComponent(imageUrl)}`);
      const data = res.data;
      if (!data?.result?.similarImages?.length) return reply('❌ No similar images found.');
      const similarImages = data.result.similarImages.slice(0, 10);
      // Send as album
      const album = [];
      for (let i = 0; i < similarImages.length; i++) {
        const img = similarImages[i];
        const url = img.thumbnailUrl || img.url;
        if (url) {
          album.push({
            image: { url },
            caption: i === 0 ? `🔍 *Similar Images Found*\n📸 ${similarImages.length} results` : undefined
          });
        }
      }
      if (!album.length) return reply('❌ Failed to load similar images.');
      await client.sendMessage(from, { album }, { quoted: m });
    } catch (err) {
      await reply('❌ Error: ' + err.message);
    }
  }
},
  
  
  {
    command: ['save'],
    aliases: ['forward'],
    description: 'Save a status message to DM',
    category: 'media',
    handler: async (client, m, { reply }) => {
      try {
        const quotedMessage = m.msg?.contextInfo?.quotedMessage;
        if (!quotedMessage) return m.reply('❌ Please reply to a status message');
        if (!m.quoted?.chat?.endsWith('@broadcast')) return m.reply('⚠️ That message is not a status! Please reply to a status message.');
        const mediaBuffer = await client.downloadMediaMessage(m.quoted);
        if (!mediaBuffer || mediaBuffer.length === 0) return m.reply('🚫 Could not download the status media. It may have expired.');
        let payload;
        let mediaType;
        if (quotedMessage.imageMessage) {
          mediaType = 'image';
          payload = { image: mediaBuffer, caption: quotedMessage.imageMessage.caption || '📸 Saved status image', mimetype: 'image/jpeg' };
        } else if (quotedMessage.videoMessage) {
          mediaType = 'video';
          payload = { video: mediaBuffer, caption: quotedMessage.videoMessage.caption || '🎥 Saved status video', mimetype: 'video/mp4' };
        } else {
          return m.reply('❌ Only image and video statuses can be saved!');
        }
        await client.sendMessage(m.sender, payload, { quoted: m });
        return m.reply(`✅  ${mediaType} 𝐬𝐚𝐯𝐞𝐝! Check Dm`);
      } catch (error) {
        if (error.message.includes('404') || error.message.includes('not found')) return m.reply('⚠️ The status may have expired or been deleted.');
        return m.reply('❌ Failed to save status. Error: ' + error.message);
      }
    }
  },

];
