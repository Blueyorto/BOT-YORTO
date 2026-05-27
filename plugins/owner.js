module.exports = [

  {
    command: ['settings'],
    description: 'View all bot settings',
    category: 'owner',
    handler: async (client, m, { Owner, NotOwner }) => {
      if (!Owner) return m.reply(NotOwner);
      try {
        const { getSettings } = require('../database/config');
        const s = await getSettings();
        const tog = (v) => v === 'on' ? '✅ ON' : '❌ OFF';
        const msg =
          `╔══════════════════════╗\n` +
          `║     ⚙️  BOT SETTINGS     \n` +
          `╚══════════════════════╝\n\n` +
          `*🔒 Security*\n` +
          `┣ AntiLink: ${tog(s.antilink)}\n` +
          `┣ AntiLinkAll: ${tog(s.antilinkall)}\n` +
          `┣ AntiDelete: ${tog(s.antidelete)}\n` +
          `┣ AntiCall: ${tog(s.anticall)}\n` +
          `┣ AntiBot: ${tog(s.antibot)}\n` +
          `┣ AntiTag: ${tog(s.antitag)}\n` +
          `┗ BadWord: ${tog(s.badword)}\n\n` +
          `*🤖 Automation*\n` +
          `┣ AutoRead: ${tog(s.autoread)}\n` +
          `┣ AutoLike: ${tog(s.autolike)}\n` +
          `┣ AutoView: ${tog(s.autoview)}\n` +
          `┣ AutoBio: ${tog(s.autobio)}\n` +
          `┗ WelcomeGoodbye: ${tog(s.welcomegoodbye)}\n\n` +
          `*💬 Bot-Behaviour*\n` +
          `┣ GPTDM: ${tog(s.gptdm)}\n` +
          `┣ Mode: 🌐 ${(s.mode || 'public').toUpperCase()}\n` +
          `┣ Prefix: ${s.prefix || ''}\n` +
          `┣ MenuType: 📋 ${(s.menutype || 'video').toUpperCase()}\n` +
          `┗ WAPresence: 🟢 ${(s.wapresence || 'recording').toUpperCase()}`;
        await client.sendMessage(m.chat, { text: msg }, { quoted: m });
      } catch (err) {
        m.reply('❌ Failed to fetch settings. Please try again.');
      }
    }
  },

  {
    command: ['antilink'],
    description: 'Toggle anti-link protection',
    category: 'owner',
    handler: async (client, m, { reply, admin, group, isAdmin, Owner, NotOwner, text }) => {
      if (!m.isGroup) return reply(group);
      if (!isAdmin && !Owner) return reply(admin);
      const { getSettings, updateSetting } = require('../database/config');
      const settings = await getSettings();
      const current = settings.antilink;
      if (!text) return reply(`🛡️ Antilink is currently *${current.toUpperCase()}*`);
      if (!['on', 'off'].includes(text)) return reply('Usage: antilink on/off');
      if (text === current) return reply(`✅ Antilink is already *${text.toUpperCase()}*`);
      await updateSetting('antilink', text);
      reply(`✅ Antilink has been turned *${text.toUpperCase()}*`);
    }
  },

  {
    command: ['antilinkall'],
    description: 'Toggle anti-all-links protection',
    category: 'owner',
    handler: async (client, m, { reply, Owner, NotOwner, text }) => {
      if (!Owner) return m.reply(NotOwner);
      const { getSettings, updateSetting } = require('../database/config');
      const settings = await getSettings();
      const current = settings.antilinkall;
      if (!text) return reply(`🛡️ Antilinkall is currently *${current.toUpperCase()}*`);
      if (!['on', 'off'].includes(text)) return reply('Usage: antilinkall on/off');
      if (text === current) return reply(`✅ Antilinkall is already *${text.toUpperCase()}*`);
      await updateSetting('antilinkall', text);
      reply(`✅ Antilinkall has been turned *${text.toUpperCase()}*`);
    }
  },

  {
    command: ['antidelete'],
    description: 'Toggle anti-delete',
    category: 'owner',
    handler: async (client, m, { reply, Owner, NotOwner, text }) => {
      if (!Owner) return m.reply(NotOwner);
      const { getSettings, updateSetting } = require('../database/config');
      const settings = await getSettings();
      const current = settings.antidelete;
      if (!text) return reply(`😊 Antidelete is currently *${current.toUpperCase()}*`);
      if (!['on', 'off'].includes(text)) return reply('Usage: antidelete on/off');
      if (text === current) return reply(`✅ Antidelete is already *${text.toUpperCase()}*`);
      await updateSetting('antidelete', text);
      reply(`✅ Antidelete has been turned *${text.toUpperCase()}*`);
    }
  },

  {
    command: ['gptdm'],
    description: 'Toggle GPT auto-reply in DM',
    category: 'owner',
    handler: async (client, m, { reply, Owner, NotOwner, text }) => {
      if (!Owner) return m.reply(NotOwner);
      const { getSettings, updateSetting } = require('../database/config');
      const settings = await getSettings();
      const current = settings.gptdm;
      if (!text) return reply(`🙂‍↕️ gptdm is currently *${current.toUpperCase()}*`);
      if (!['on', 'off'].includes(text)) return reply('Usage: gptdm on/off');
      if (text === current) return reply(`✅ Gptdm is already *${text.toUpperCase()}*`);
      await updateSetting('gptdm', text);
      reply(`✅ Gptdm has been turned *${text.toUpperCase()}*`);
    }
  },

  {
    command: ['autoread'],
    description: 'Toggle auto-read messages',
    category: 'owner',
    handler: async (client, m, { reply, Owner, NotOwner, text }) => {
      if (!Owner) return m.reply(NotOwner);
      const { getSettings, updateSetting } = require('../database/config');
      const settings = await getSettings();
      const current = settings.autoread;
      if (!text) return reply(`📨 Autoread is currently *${current.toUpperCase()}*`);
      if (!['on', 'off'].includes(text)) return reply('Usage: autoread on/off');
      if (text === current) return reply(`✅ Autoread is already *${text.toUpperCase()}*`);
      await updateSetting('autoread', text);
      reply(`✅ Autoread has been set to *${text.toUpperCase()}*`);
    }
  },

  {
    command: ['mode'],
    description: 'Switch bot mode (public/private)',
    category: 'owner',
    handler: async (client, m, { reply, Owner, NotOwner, text }) => {
      if (!Owner) return m.reply(NotOwner);
      const { getSettings, updateSetting } = require('../database/config');
      const settings = await getSettings();
      const current = settings.mode;
      if (!text) return reply(`👥️ Mode is currently *${current.toUpperCase()}*`);
      if (!['public', 'private'].includes(text)) return reply('Usage: mode public/private');
      if (text === current) return reply(`✅ Mode is already *${text.toUpperCase()}*`);
      await updateSetting('mode', text);
      reply(`✅ Mode changed to *${text.toUpperCase()}*`);
    }
  },

  {
    command: ['prefix'],
    description: 'Change bot command prefix',
    category: 'owner',
    handler: async (client, m, { reply, Owner, NotOwner, args }) => {
      if (!Owner) return m.reply(NotOwner);
      const { getSettings, updateSetting } = require('../database/config');
      const settings = await getSettings();
      const newPrefix = args[0];
      if (newPrefix === 'none') {
        if (!settings.prefix) return m.reply('✅ The bot was already prefixless.');
        await updateSetting('prefix', '');
        await m.reply('✅ The bot is now prefixless.');
      } else if (newPrefix) {
        if (settings.prefix === newPrefix) return m.reply(`✅ The prefix was already set to: ${newPrefix}`);
        await updateSetting('prefix', newPrefix);
        await m.reply(`✅ Prefix has been updated to: ${newPrefix}`);
      } else {
        await m.reply(`👤 Prefix is currently: ${settings.prefix || 'No prefix set.'}\n\nUse _${settings.prefix || '.'}prefix none to remove the prefix.`);
      }
    }
  },

  {
    command: ['autolike'],
    description: 'Toggle auto-like status',
    category: 'owner',
    handler: async (client, m, { reply, Owner, NotOwner, text }) => {
      if (!Owner) return m.reply(NotOwner);
      const { getSettings, updateSetting } = require('../database/config');
      const settings = await getSettings();
      const current = settings.autolike;
      if (!text) return reply(`🫠 Autolike is currently *${current.toUpperCase()}*`);
      if (!['on', 'off'].includes(text)) return reply('Usage: autolike on/off');
      if (text === current) return reply(`✅ Autolike is already *${text.toUpperCase()}*`);
      await updateSetting('autolike', text);
      reply(`✅ Autolike has been turned *${text.toUpperCase()}*`);
    }
  },

  {
    command: ['autobio'],
    description: 'Toggle auto bio update',
    category: 'owner',
    handler: async (client, m, { reply, Owner, NotOwner, text }) => {
      if (!Owner) return m.reply(NotOwner);
      const { getSettings, updateSetting } = require('../database/config');
      const settings = await getSettings();
      const current = settings.autobio;
      if (!text) return reply(`😇 Autobio is currently *${current.toUpperCase()}*`);
      if (!['on', 'off'].includes(text)) return reply('Usage: autobio on/off');
      if (text === current) return reply(`✅ Autobio is already *${text.toUpperCase()}*`);
      await updateSetting('autobio', text);
      reply(`✅ Autobio has been turned *${text.toUpperCase()}*`);
    }
  },

  {
    command: ['autoview'],
    description: 'Toggle auto-view status',
    category: 'owner',
    handler: async (client, m, { reply, Owner, NotOwner, text }) => {
      if (!Owner) return m.reply(NotOwner);
      const { getSettings, updateSetting } = require('../database/config');
      const settings = await getSettings();
      const current = settings.autoview;
      if (!text) return reply(`👀 Auto view status is currently *${current.toUpperCase()}*`);
      if (!['on', 'off'].includes(text)) return reply('Usage: autoview on/off');
      if (text === current) return reply(`✅ Auto view status is already *${text.toUpperCase()}*`);
      await updateSetting('autoview', text);
      reply(`✅ Auto view status updated to *${text.toUpperCase()}*`);
    }
  },

  {
    command: ['menutype'],
    description: 'Set menu display type',
    category: 'owner',
    handler: async (client, m, { reply, Owner, NotOwner, text }) => {
      if (!Owner) return m.reply(NotOwner);
      const { getSettings, updateSetting } = require('../database/config');
      const settings = await getSettings();
      const current = settings.menutype;
      if (!text) return reply(`👤 menutype is currently *${current}*`);
      if (!['video', 'image', 'link', 'text'].includes(text)) return reply('Usage: menutype video/image/link/text');
      if (text === current) return reply(`✅ menutype is already *${text}*`);
      await updateSetting('menutype', text);
      reply(`✅ menutype updated to *${text}*`);
    }
  },

  {
    command: ['wapresence'],
    description: 'Set bot WhatsApp presence',
    category: 'owner',
    handler: async (client, m, { reply, Owner, NotOwner, text }) => {
      if (!Owner) return m.reply(NotOwner);
      const { getSettings, updateSetting } = require('../database/config');
      const settings = await getSettings();
      const current = settings.wapresence;
      if (!text) return reply(`👤 Presence is currently *${current}*`);
      if (!['typing', 'online', 'offline', 'recording'].includes(text)) return reply('Usage: wapresence typing/online/offline/recording');
      if (text === current) return reply(`✅ Presence is already *${text}*`);
      await updateSetting('wapresence', text);
      reply(`✅ Presence updated to *${text}*`);
    }
  },

  {
    command: ['badword'],
    description: 'Toggle bad word filter',
    category: 'owner',
    handler: async (client, m, { reply, Owner, NotOwner, text }) => {
      if (!Owner) return m.reply(NotOwner);
      const { getSettings, updateSetting } = require('../database/config');
      const settings = await getSettings();
      const current = settings.badword;
      if (!text) return reply(`😈 Badword is currently *${current.toUpperCase()}*`);
      if (!['on', 'off'].includes(text)) return reply('Usage: badword on/off');
      if (text === current) return reply(`✅ Badword is already *${text.toUpperCase()}*`);
      await updateSetting('badword', text);
      reply(`✅ Badword has been turned *${text.toUpperCase()}*`);
    }
  },

  {
    command: ['anticall'],
    description: 'Toggle anti-call',
    category: 'owner',
    handler: async (client, m, { reply, Owner, NotOwner, text }) => {
      if (!Owner) return m.reply(NotOwner);
      const { getSettings, updateSetting } = require('../database/config');
      const settings = await getSettings();
      const current = settings.anticall;
      if (!text) return reply(`🔰 Anticall is currently *${current.toUpperCase()}*`);
      if (!['on', 'off'].includes(text)) return reply('Usage: Anticall on/off');
      if (text === current) return reply(`✅ Anticall is already *${text.toUpperCase()}*`);
      await updateSetting('anticall', text);
      reply(`✅ Anticall has been turned *${text.toUpperCase()}*`);
    }
  },

  {
    command: ['antibot'],
    description: 'Toggle anti-bot',
    category: 'owner',
    handler: async (client, m, { reply, Owner, NotOwner, text }) => {
      if (!Owner) return m.reply(NotOwner);
      const { getSettings, updateSetting } = require('../database/config');
      const settings = await getSettings();
      const current = settings.antibot;
      if (!text) return reply(`👾 Antibot is currently *${current.toUpperCase()}*`);
      if (!['on', 'off'].includes(text)) return reply('Usage: antibot on/off');
      if (text === current) return reply(`✅ Antibot is already *${text.toUpperCase()}*`);
      await updateSetting('antibot', text);
      reply(`✅ Antibot has been turned *${text.toUpperCase()}*`);
    }
  },

  {
    command: ['antitag'],
    description: 'Toggle anti-tag',
    category: 'owner',
    handler: async (client, m, { reply, Owner, NotOwner, text }) => {
      if (!Owner) return m.reply(NotOwner);
      const { getSettings, updateSetting } = require('../database/config');
      const settings = await getSettings();
      const current = settings.antitag;
      if (!text) return reply(`🤖 Antitag is currently *${current.toUpperCase()}*`);
      if (!['on', 'off'].includes(text)) return reply('Usage: antitag on/off');
      if (text === current) return reply(`✅ Antitag is already *${text.toUpperCase()}*`);
      await updateSetting('antitag', text);
      reply(`✅ Antitag has been turned *${text.toUpperCase()}*`);
    }
  },

  {
    command: ['welcomegoodbye'],
    description: 'Toggle welcome/goodbye messages',
    category: 'owner',
    handler: async (client, m, { reply, Owner, NotOwner, text }) => {
      if (!Owner) return m.reply(NotOwner);
      const { getSettings, updateSetting } = require('../database/config');
      const settings = await getSettings();
      const current = settings.welcomegoodbye;
      if (!text) return reply(`🕳 Welcomegoodbye is currently *${current.toUpperCase()}*`);
      if (!['on', 'off'].includes(text)) return reply('Usage: welcomegoodbye on/off');
      if (text === current) return reply(`✅ Welcomegoodbye is already *${text.toUpperCase()}*`);
      await updateSetting('welcomegoodbye', text);
      reply(`✅ Welcomegoodbye has been turned *${text.toUpperCase()}*`);
    }
  },

  {
    command: ['broadcast'],
    description: 'Broadcast a message to all groups',
    category: 'owner',
    handler: async (client, m, { reply, Owner, NotOwner, text }) => {
      if (!Owner) return m.reply(NotOwner);
      if (!text) return reply('Provide a message to broadcast.');
      await reply('📢 _Broadcasting..._');
      const groups = await client.groupFetchAllParticipating();
      let count = 0;
      for (const id of Object.keys(groups)) {
        try {
          await client.sendMessage(id, { text: `📢 *BROADCAST*\n\n${text}` });
          count++;
        } catch {}
      }
      reply(`✅ Broadcast sent to *${count}* groups.`);
    }
  },

  {
    command: ['restart'],
    description: 'Restart the bot',
    category: 'owner',
    handler: async (client, m, { Owner, NotOwner, reply }) => {
      if (!Owner) return m.reply(NotOwner);
      const { sleep } = require('../lib/ravenfunc');
      reply('Restarting. . .');
      await sleep(3000);
      process.exit();
    }
  },

  {
    command: ['fullpp'],
    description: 'Set bot profile picture with full resolution (Owner only)',
    category: 'owner',
    handler: async (client, m, { Owner, NotOwner, msgR }) => {
        if (!Owner) return m.reply(NotOwner);
        const { S_WHATSAPP_NET, generateProfilePicture, downloadMediaMessage } = require('@whiskeysockets/baileys');
        try {
            if (!msgR) { m.reply('𝗤𝘂𝗼𝘁𝗲 𝗮𝗻 𝗶𝗺𝗮𝗴𝗲...'); return; }

            if (!msgR.imageMessage) {
                return m.reply('𝗛𝘂𝗵 𝘁𝗵𝗶𝘀 𝗶𝘀 𝗻𝗼𝘁 𝗮𝗻 𝗶𝗺𝗮𝗴𝗲...');
            }

            const medisBuffer = await downloadMediaMessage(msgR, 'buffer', {});

            const { img } = await generateProfilePicture(medisBuffer);

            await client.query({
                tag: 'iq',
                attrs: {
                    target: undefined,
                    to: S_WHATSAPP_NET,
                    type: 'set',
                    xmlns: 'w:profile:picture'
                },
                content: [
                    {
                        tag: 'picture',
                        attrs: { type: 'image' },
                        content: img
                    }
                ]
            });

            m.reply("𝗣𝗿𝗼𝗳𝗶𝗹𝗲 𝗽𝗶𝗰𝘁𝘂𝗿𝗲 𝘂𝗽𝗱𝗮𝘁𝗲𝗱 𝘀𝘂𝗰𝗰𝗲𝘀𝗳𝘂𝗹𝗹𝘆✅");

        } catch (error) {
            m.reply("An error occured while updating profile photo\n" + error);
        }
    }
},

  {
    command: ['eval'],
    description: 'Evaluate a bot Baileys function',
    category: 'owner',
    handler: async (client, m, { reply, Owner, NotOwner, text }) => {
      if (!Owner) return m.reply(NotOwner);
      if (!text) return reply('Provide a valid Bot Baileys Function to evaluate');
      try {
        let evaled = await eval(text);
        if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
        await reply(evaled);
      } catch (err) {
        await reply(String(err));
      }
    }
  },

  {
    command: ['block'],
    description: 'Block a user',
    category: 'owner',
    handler: async (client, m, { Owner, NotOwner }) => {
      if (!Owner) return m.reply(NotOwner);
      if (!m.quoted) return m.reply('Reply to a message to block that user.');
      const { jidNormalizedUser } = require('@whiskeysockets/baileys');
      try {
        if (m.isGroup) {
          const groupLid = m.quoted.sender;
          const metadata = await client.groupMetadata(m.chat);
          const participant = metadata.participants.find(p => p.id === groupLid);
          if (!participant) return m.reply('Could not find that participant in this group.');
          const realJid = participant.phoneNumber || participant.id;
          const ownerJid = '254114283550@s.whatsapp.net';
          const botJid = jidNormalizedUser(client.user.id);
          if (realJid === ownerJid) return m.reply('I cannot block my Owner 😡');
          if (realJid === botJid) return m.reply('I cannot block myself 😡');
          await client.updateBlockStatus(groupLid, realJid, 'block');
        } else {
          const dmJid = m.quoted.sender;
          const dmLid = m.chat.endsWith('@lid') ? m.chat : null;
          const ownerJid = '254114283550@s.whatsapp.net';
          const botJid = jidNormalizedUser(client.user.id);
          if (dmJid === ownerJid) return m.reply('I cannot block my Owner 😡');
          if (dmJid === botJid) return m.reply('I cannot block myself 😡');
          if (dmLid) {
            await client.updateBlockStatus(dmLid, dmJid, 'block');
          } else {
            await client.updateBlockStatus(dmJid, 'block');
          }
        }
        m.reply('✅ Blocked successfully!');
      } catch (err) {
        m.reply('❌ Error: ' + err.message);
      }
    }
  },

  {
    command: ['unblock'],
    description: 'Unblock a user',
    category: 'owner',
    handler: async (client, m, { Owner, NotOwner }) => {
      if (!Owner) return m.reply(NotOwner);
      if (!m.quoted) return m.reply('Reply to a message to unblock that user.');
      try {
        if (m.isGroup) {
          const groupLid = m.quoted.sender;
          const metadata = await client.groupMetadata(m.chat);
          const participant = metadata.participants.find(p => p.id === groupLid);
          if (!participant) return m.reply('Could not find that participant in this group.');
          const realJid = participant.phoneNumber || participant.id;
          await client.updateBlockStatus(groupLid, realJid, 'unblock');
        } else {
          const dmJid = m.quoted.sender;
          const dmLid = m.chat.endsWith('@lid') ? m.chat : null;
          if (dmLid) {
            await client.updateBlockStatus(dmLid, dmJid, 'unblock');
          } else {
            await client.updateBlockStatus(dmJid, 'unblock');
          }
        }
        m.reply('✅ Unblocked successfully!');
      } catch (err) {
        m.reply('❌ Error: ' + err.message);
      }
    }
  },

  
  {
    command: ['blocklist'],
    description: 'Show blocked contacts (Owner only)',
    category: 'owner',
    handler: async (client, m, { Owner, NotOwner }) => {
      if (!Owner) return m.reply(NotOwner);
      try {
        let blocked = await client.fetchBlocklist();
        if (!blocked || blocked.length === 0) return m.reply('You have no blocked contacts.');
        let list = `*Blocked Contacts (${blocked.length})*\n\n`;
        blocked.forEach((jid, i) => { list += `${i + 1}. +${jid.replace(/@.+/, '')}\n`; });
        m.reply(list.trim());
      } catch (err) {
        m.reply('Error fetching blocklist: ' + err.message);
      }
    }
  },
  
  {
    command: ['togroupstatus', 'groupstatus', 'statusgroup'],
    description: 'Send a message/media to group status',
    category: 'owner',
    handler: async (client, m, { reply, Owner, NotOwner, group, text }) => {
      if (!Owner) return m.reply(NotOwner);
      if (!m.isGroup) return reply(group);
      if (!text && !m.quoted) {
        return m.reply(
          '📌 Usage:\n' +
          '• togroupstatus <text>\n' +
          '• Reply to an image/video/audio/document/sticker with togroupstatus <caption>\n' +
          '• Or just togroupstatus to forward quoted media without caption'
        );
      }
      try {
        const fs = require('fs');
        let payload = { groupStatusMessage: {} };
        if (m.quoted) {
          const qtype = m.quoted.mtype || '';
          if (qtype === 'imageMessage') {
            const caption = text || m.quoted.msg?.caption || '';
            const filePath = await client.downloadAndSaveMediaMessage(m.quoted);
            payload.groupStatusMessage.image = { url: filePath };
            if (caption) payload.groupStatusMessage.caption = caption;
          } else if (qtype === 'videoMessage') {
            const caption = text || m.quoted.msg?.caption || '';
            const filePath = await client.downloadAndSaveMediaMessage(m.quoted);
            payload.groupStatusMessage.video = { url: filePath };
            if (caption) payload.groupStatusMessage.caption = caption;
          } else if (qtype === 'audioMessage') {
            const filePath = await client.downloadAndSaveMediaMessage(m.quoted);
            const opusPath = filePath + '_converted.ogg';
            await new Promise((resolve, reject) => {
              require('fluent-ffmpeg')(filePath)
                .audioCodec('libopus')
                .audioBitrate(128)
                .toFormat('ogg')
                .on('end', resolve)
                .on('error', reject)
                .save(opusPath);
            });
            try { fs.unlinkSync(filePath); } catch (e) {}
            payload.groupStatusMessage.audio = { url: opusPath };
            payload._opusCleanup = opusPath;
          } else if (qtype === 'documentMessage') {
            const filePath = await client.downloadAndSaveMediaMessage(m.quoted);
            payload.groupStatusMessage.document = { url: filePath };
          } else if (qtype === 'stickerMessage') {
            const filePath = await client.downloadAndSaveMediaMessage(m.quoted);
            payload.groupStatusMessage.sticker = { url: filePath };
          } else if (m.quoted.text) {
            payload.groupStatusMessage.text = m.quoted.text;
          }
          if (text && !payload.groupStatusMessage.caption) {
            payload.groupStatusMessage.caption = text;
          }
        } else {
          payload.groupStatusMessage.text = text;
        }
        const opusCleanup = payload._opusCleanup;
        delete payload._opusCleanup;
        await client.sendMessage(m.chat, payload, { quoted: m });
        if (opusCleanup) try { fs.unlinkSync(opusCleanup); } catch (e) {}
      } catch (err) {
        m.reply(`❌ Error sending group status: ${err.message}`);
      }
    }
  },

];
