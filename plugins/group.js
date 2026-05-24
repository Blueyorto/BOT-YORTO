const axios = require('axios');

module.exports = {
  command: ['antilink','antilinkall','antidelete','gptdm','autoread','mode','prefix','autolike','autobio','autoview','menutype','wapresence','badword','anticall','antibot','antitag','welcomegoodbye','settings','kill','kickall','kill2','kickall2','foreigners','vcf','remove','kick','admin','add','approve','approve-all','reject','reject-all','promote','demote','close','mute','open','unmute','disp-1','disp-7','disp-90','disp-off','icon','revoke','newlink','reset','delete','del','dlt','dil','leave','subject','changesubject','desc','setdesc','hidetag','tag','closetime','opentime','cast','broadcast','link','linkgroup','gcprofile','togroupstatus','groupstatus','statusgroup','poll','tagall','tgall'],
  handler: async (client, m, ctx) => {
    const { command, text, q, args, prefix, pushname, from, isAdmin, isBotAdmin, isOwner } = ctx;

    const group = '❌ This command is for groups only!';
    const admin = '❌ This command is for admins only!';
    const botAdmin = '❌ Bot must be an admin to use this command!';
    const NotOwner = '⭐ *This command is for the bot owner only!*';

    const getSettings = async () => {
      try { const { getSettings } = require('../lib/settings'); return getSettings(); } catch { return {}; }
    };
    const updateSetting = async (key, value) => {
      try { const { updateSetting } = require('../lib/settings'); return updateSetting(key, value); } catch {}
    };

    const settingToggleCommands = { antilink: '🛡️', antilinkall: '🛡️', antidelete: '😊', gptdm: '🙂‍↕️', autoread: '📨', autolike: '🫠', autobio: '😇', autoview: '👀', badword: '😈', anticall: '🔰', antibot: '👾', antitag: '🤖', welcomegoodbye: '🕳' };
    const settingModeCommands = { mode: ['public','private','👥️'], menutype: ['video','image','link','text','👤'], wapresence: ['typing','online','offline','recording','👤'] };

    if (settingToggleCommands[command]) {
      if (!isOwner) return m.reply(NotOwner);
      const s = await getSettings();
      const current = s[command];
      const emoji = settingToggleCommands[command];
      if (!text) return m.reply(`${emoji} ${command} is currently *${(current||'off').toUpperCase()}*`);
      if (!['on','off'].includes(text)) return m.reply(`Usage: ${command} on/off`);
      if (text === current) return m.reply(`✅ ${command} is already *${text.toUpperCase()}*`);
      await updateSetting(command, text);
      return m.reply(`✅ ${command} has been turned *${text.toUpperCase()}*`);
    }

    if (command === 'mode' || command === 'menutype' || command === 'wapresence') {
      if (!isOwner) return m.reply(NotOwner);
      const s = await getSettings();
      const current = s[command];
      const [v1, v2, emoji] = settingModeCommands[command];
      if (!text) return m.reply(`${emoji} ${command} is currently *${current}*`);
      const validOptions = settingModeCommands[command].slice(0, -1);
      if (!validOptions.includes(text)) return m.reply(`Usage: ${command} ${validOptions.join('/')}`);
      if (text === current) return m.reply(`✅ ${command} is already *${text}*`);
      await updateSetting(command, text);
      return m.reply(`✅ ${command} updated to *${text}*`);
    }

    if (command === 'prefix') {
      if (!isOwner) return m.reply(NotOwner);
      const newPrefix = args[0];
      const s = await getSettings();
      if (newPrefix === 'none') {
        if (!s.prefix) return m.reply(`✅ The bot was already prefixless.`);
        await updateSetting('prefix', '');
        return m.reply(`✅ The bot is now prefixless.`);
      } else if (newPrefix) {
        if (s.prefix === newPrefix) return m.reply(`✅ The prefix was already set to: ${newPrefix}`);
        await updateSetting('prefix', newPrefix);
        return m.reply(`✅ Prefix has been updated to: ${newPrefix}`);
      } else {
        return m.reply(`👤 Prefix is currently: ${s.prefix || 'No prefix set.'}`);
      }
    }

    if (command === 'settings') {
      if (!isOwner) return m.reply(NotOwner);
      try {
        const s = await getSettings();
        const tog = (v) => v === 'on' ? '✅ ON' : '❌ OFF';
        const msg = `╔══════════════════════╗\n║     ⚙️  BOT SETTINGS     \n╚══════════════════════╝\n\n*🔒 Security*\n┣ AntiLink: ${tog(s.antilink)}\n┣ AntiLinkAll: ${tog(s.antilinkall)}\n┣ AntiDelete: ${tog(s.antidelete)}\n┣ AntiCall: ${tog(s.anticall)}\n┣ AntiBot: ${tog(s.antibot)}\n┣ AntiTag: ${tog(s.antitag)}\n┗ BadWord: ${tog(s.badword)}\n\n*🤖 Automation*\n┣ AutoRead: ${tog(s.autoread)}\n┣ AutoLike: ${tog(s.autolike)}\n┣ AutoView: ${tog(s.autoview)}\n┣ AutoBio: ${tog(s.autobio)}\n┗ WelcomeGoodbye: ${tog(s.welcomegoodbye)}\n\n*💬 Bot-Behaviour*\n┣ GPTDM: ${tog(s.gptdm)}\n┣ Mode: 🌐 ${(s.mode||'public').toUpperCase()}\n┣ Prefix: ${s.prefix||''}\n┣ MenuType: 📋 ${(s.menutype||'video').toUpperCase()}\n┗ WAPresence: 🟢 ${(s.wapresence||'recording').toUpperCase()}`;
        return client.sendMessage(m.chat, { text: msg }, { quoted: m });
      } catch { return m.reply('❌ Failed to fetch settings.'); }
    }

    if (command === 'foreigners') {
      if (!m.isGroup) return m.reply(group);
      if (!isAdmin) return m.reply(admin);
      if (!isBotAdmin) return m.reply(botAdmin);
      const { jidNormalizedUser } = require('@whiskeysockets/baileys');
      const { mycode } = require('../config');
      const groupMetadata = await client.groupMetadata(m.chat);
      const foreigners = groupMetadata.participants.filter(p => !p.admin).map(p => p.id).filter(id => id && !id.startsWith(mycode) && id !== jidNormalizedUser(client.user.id));
      if (!args?.[0]) {
        if (!foreigners.length) return m.reply("No foreigners detected.");
        let msg = `𝗙𝗼𝗿𝗲𝗶𝗴𝗻𝗲𝗿𝘀 detected (${foreigners.length}):\n`;
        for (let id of foreigners) msg += `𓅂 @${id.split("@")[0]}\n`;
        msg += `\n𝗧𝗼 𝗿𝗲𝗺𝗼𝘃𝗲 𝘁𝗵𝗲𝗺 𝘀𝗲𝗻𝗱 foreigners -x`;
        return client.sendMessage(m.chat, { text: msg, mentions: foreigners }, { quoted: m });
      } else if (args[0] === '-x') {
        await client.sendMessage(m.chat, { text: `Removing all ${foreigners.length} foreigners...` }, { quoted: m });
        await client.groupParticipantsUpdate(m.chat, foreigners, "remove");
        return m.reply("Done! Any remaining foreigners?🌚.");
      }
    }

    if (command === 'vcf' || command === 'group-vcf') {
      if (!m.isGroup) return m.reply("Command meant for groups");
      const fs = require('fs');
      try {
        const metadata = await client.groupMetadata(m.chat);
        const participants = metadata.participants || [];
        let vcard = "", no = 0;
        for (let p of participants) {
          const num = p.id.split("@")[0];
          vcard += `BEGIN:VCARD\nVERSION:3.0\nFN:[${no++}] +${num}\nTEL;type=CELL;type=VOICE;waid=${num}:+${num}\nEND:VCARD\n`;
        }
        const filePath = "./contacts.vcf";
        await m.reply(`⏳ Compiling ${participants.length} contacts...`);
        fs.writeFileSync(filePath, vcard.trim());
        await client.sendMessage(m.chat, { document: fs.readFileSync(filePath), mimetype: "text/vcard", fileName: "Group Contacts.vcf", caption: `VCF for ${metadata.subject}\n${participants.length} contacts` }, { quoted: m });
        fs.unlinkSync(filePath);
      } catch { return m.reply("❌ Failed to generate VCF."); }
    }

    if (command === 'remove' || command === 'kick') {
      if (!m.isGroup) return m.reply(group);
      if (!isBotAdmin) return m.reply(botAdmin);
      if (!isAdmin) return m.reply(admin);
      if (!m.quoted && (!m.mentionedJid?.length)) return m.reply("Who should i remove!?");
      const users = m.mentionedJid?.[0] || m.quoted?.sender;
      const parts = users.split('@')[0];
      if (users === "254114283550@s.whatsapp.net") return m.reply("It's an Owner Number! 😡");
      await client.sendMessage(m.chat, { text: `@${parts}, Goodbye idiot🤧`, contextInfo: { mentionedJid: [parts] } }, { quoted: m });
      return client.groupParticipantsUpdate(m.chat, [users], 'remove');
    }

    if (command === 'admin') {
      if (!m.isGroup) return m.reply(group);
      if (!isBotAdmin) return m.reply(botAdmin);
      if (!isOwner) return m.reply(NotOwner);
      await client.groupParticipantsUpdate(m.chat, [m.sender], 'promote');
      return m.reply('Promoted To Admin🥇');
    }

    if (command === 'add') {
      if (!text) return m.reply('Please provide a number to add.\n\nExample: .add 254114283550');
      if (!m.isGroup) return m.reply(group);
      if (!isAdmin) return m.reply(admin);
      if (!isBotAdmin) return m.reply(botAdmin);
      const rawNum = text.replace(/[^0-9]/g, '').trim();
      if (!rawNum) return m.reply('❌ Invalid number.');
      const targetJid = rawNum + '@s.whatsapp.net';
      try {
        const result = await client.groupParticipantsUpdate(m.chat, [targetJid], 'add');
        const status = String(result?.[0]?.status || '');
        if (status === '200') return client.sendMessage(m.chat, { text: `✅ Successfully added @${rawNum}`, mentions: [targetJid] }, { quoted: m });
        if (status === '403' || status === '401') {
          const code = await client.groupInviteCode(m.chat);
          await client.sendMessage(targetJid, { text: `👋 You've been invited to join a WhatsApp group.\n\nTap to join: https://chat.whatsapp.com/${code}` });
          return client.sendMessage(m.chat, { text: `⚠️ Couldn't add @${rawNum} directly. Invite link sent to their DM.`, mentions: [targetJid] }, { quoted: m });
        }
        if (status === '408') return client.sendMessage(m.chat, { text: `❌ @${rawNum} is not on WhatsApp.`, mentions: [targetJid] }, { quoted: m });
        if (status === '409') return client.sendMessage(m.chat, { text: `ℹ️ @${rawNum} is already a member.`, mentions: [targetJid] }, { quoted: m });
      } catch (err) { return m.reply('Error: ' + err.message); }
    }

    if (command === 'approve' || command === 'approve-all') {
      if (!m.isGroup) return m.reply(group);
      if (!isAdmin) return m.reply(admin);
      if (!isBotAdmin) return m.reply(botAdmin);
      const list = await client.groupRequestParticipantsList(m.chat);
      if (!list.length) return m.reply("𝗡𝗼 𝗣𝗲𝗻𝗱𝗶𝗻𝗴 𝗷𝗼𝗶𝗻 𝗿𝗲𝗾𝘂𝗲𝘀𝘁𝘀 𝘁𝗵𝗶𝘀 𝘁𝗶𝗺𝗲!");
      for (const p of list) await client.groupRequestParticipantsUpdate(m.chat, [p.jid], "approve");
      return m.reply("𝗣𝗲𝗻𝗱𝗶𝗻𝗴 𝗣𝗮𝗿𝘁𝗶𝗰𝗶𝗽𝗮𝗻𝘁𝘀 𝗵𝗮𝘃𝗲 𝗯𝗲𝗲𝗻 𝗮𝗽𝗽𝗿𝗼𝘃𝗲𝗱 𝘀𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆✅");
    }

    if (command === 'reject' || command === 'reject-all') {
      if (!m.isGroup) return m.reply(group);
      if (!isAdmin) return m.reply(admin);
      if (!isBotAdmin) return m.reply(botAdmin);
      const list = await client.groupRequestParticipantsList(m.chat);
      if (!list.length) return m.reply("𝗡𝗼 𝗽𝗲𝗻𝗱𝗶𝗻𝗴 𝗷𝗼𝗶𝗻 𝗿𝗲𝗾𝘂𝗲𝘀𝘁𝘀 𝘁𝗵𝗶𝘀 𝘁𝗶𝗺𝗲");
      for (const p of list) await client.groupRequestParticipantsUpdate(m.chat, [p.jid], "reject");
      return m.reply("𝗣𝗲𝗻𝗱𝗶𝗻𝗴 𝗣𝗮𝗿𝘁𝗶𝗰𝗶𝗽𝗮𝗻𝘁𝘀 𝗵𝗮𝘃𝗲 𝗯𝗲𝗲𝗻 𝗿𝗲𝗷𝗲𝗰𝘁𝗲𝗱!");
    }

    if (command === 'promote') {
      if (!m.isGroup) return m.reply(group);
      if (!isBotAdmin) return m.reply(botAdmin);
      if (!isAdmin) return m.reply(admin);
      const users = m.mentionedJid?.length ? m.mentionedJid : m.quoted ? [m.quoted.sender] : null;
      if (!users) return m.reply(`Tag someone with the command!`);
      await client.groupParticipantsUpdate(m.chat, users, 'promote');
      return m.reply('Successfully promoted! 🦄');
    }

    if (command === 'demote') {
      if (!m.isGroup) return m.reply(group);
      if (!isBotAdmin) return m.reply(botAdmin);
      if (!isAdmin) return m.reply(admin);
      const users = m.mentionedJid?.length ? m.mentionedJid : m.quoted ? [m.quoted.sender] : null;
      if (!users) return m.reply(`Tag someone with the command!`);
      await client.groupParticipantsUpdate(m.chat, users, 'demote');
      return m.reply('Successfully demoted! 😲');
    }

    if (command === 'close' || command === 'mute') {
      if (!m.isGroup) return m.reply(group);
      if (!isBotAdmin) return m.reply(botAdmin);
      if (!isAdmin) return m.reply(admin);
      await client.groupSettingUpdate(m.chat, 'announcement');
      return m.reply('Group successfully locked!');
    }

    if (command === 'open' || command === 'unmute') {
      if (!m.isGroup) return m.reply(group);
      if (!isBotAdmin) return m.reply(botAdmin);
      if (!isAdmin) return m.reply(admin);
      await client.groupSettingUpdate(m.chat, 'not_announcement');
      return m.reply('Group successfully unlocked!');
    }

    const dispMap = { 'disp-1': 1*24*3600, 'disp-7': 7*24*3600, 'disp-90': 90*24*3600, 'disp-off': 0 };
    if (dispMap[command] !== undefined) {
      if (!m.isGroup) return m.reply(group);
      if (!isBotAdmin) return m.reply(botAdmin);
      if (!isAdmin) return m.reply(admin);
      await client.groupToggleEphemeral(m.chat, dispMap[command]);
      const labels = { 'disp-1': '24hrs', 'disp-7': '7 days', 'disp-90': '90 days', 'disp-off': 'turned off' };
      return m.reply(`Disappearing messages successfully ${dispMap[command] === 0 ? 'turned off' : 'turned on for ' + labels[command]}!`);
    }

    if (command === 'icon') {
      if (!m.isGroup) return m.reply(group);
      if (!isAdmin) return m.reply(admin);
      if (!isBotAdmin) return m.reply(botAdmin);
      const quoted = m.quoted;
      const mime = m.quoted?.mimetype || '';
      if (!quoted || !/image/.test(mime) || /webp/.test(mime)) return m.reply(`Send or tag an image with the caption ${prefix + command}`);
      const media = await client.downloadAndSaveMediaMessage(quoted);
      await client.updateProfilePicture(m.chat, { url: media }).catch(() => {});
      return m.reply('Group icon updated');
    }

    if (command === 'revoke' || command === 'newlink' || command === 'reset') {
      if (!m.isGroup) return m.reply(group);
      if (!isAdmin) return m.reply(admin);
      if (!isBotAdmin) return m.reply(botAdmin);
      await client.groupRevokeInvite(m.chat);
      const code = await client.groupInviteCode(m.chat);
      const groupMetadata = await client.groupMetadata(m.chat);
      await m.reply('Group link revoked!');
      await client.sendMessage(m.sender, { text: `https://chat.whatsapp.com/${code}\n\nHere is the new group link for ${groupMetadata.subject}` }, { quoted: m });
      return m.reply(`Sent you the new group link in your inbox!`);
    }

    if (command === 'delete' || command === 'del') {
      if (!m.isGroup) return m.reply(group);
      if (!isBotAdmin) return m.reply(botAdmin);
      if (!isAdmin) return m.reply(admin);
      if (!m.quoted) return m.reply(`No message quoted for deletion`);
      if (m.quoted.isBaileys) return m.reply(`I cannot delete. Quoted message is my message or another bot message.`);
      return client.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.quoted.id, participant: m.quoted.sender } });
    }

    if (command === 'dlt' || command === 'dil') {
      if (!m.quoted) return m.reply(`No message quoted for deletion`);
      if (m.quoted.isBaileys) return m.reply(`I cannot delete. Quoted message is my message or another bot message.`);
      return client.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: true, id: m.quoted.id, participant: m.quoted.sender } });
    }

    if (command === 'leave') {
      if (!isOwner) return m.reply(NotOwner);
      if (!m.isGroup) return m.reply(group);
      const meta = await client.groupMetadata(m.chat);
      const participants = meta.participants;
      await client.sendMessage(m.chat, { text: '𝗚𝗼𝗼𝗱𝗯𝘆𝗲 𝗲𝘃𝗲𝗿𝘆𝗼𝗻𝗲👋. 𝐁𝐋𝐀𝐂𝐊𝐌𝐀𝐂𝐇𝐀𝐍𝐓 𝐁𝐎𝐓-𝗔𝗶 𝗶𝘀 𝗟𝗲𝗮𝘃𝗶𝗻𝗴 𝘁𝗵𝗲 𝗚𝗿𝗼𝘂𝗽 𝗻𝗼𝘄...', mentions: participants.map(a => a.id) }, { quoted: m });
      return client.groupLeave(m.chat);
    }

    if (command === 'subject' || command === 'changesubject') {
      if (!m.isGroup) return m.reply(group);
      if (!isBotAdmin) return m.reply(botAdmin);
      if (!isAdmin) return m.reply(admin);
      if (!text) return m.reply('Provide the text for the group subject.');
      await client.groupUpdateSubject(m.chat, text);
      return m.reply('Group name successfully updated! 💀');
    }

    if (command === 'desc' || command === 'setdesc') {
      if (!m.isGroup) return m.reply(group);
      if (!isBotAdmin) return m.reply(botAdmin);
      if (!isAdmin) return m.reply(admin);
      if (!text) return m.reply('Provide the text for the group description');
      await client.groupUpdateDescription(m.chat, text);
      return m.reply('Group description successfully updated! 🥶');
    }

    if (command === 'hidetag' || command === 'tag' || command === 'tagall' || command === 'tgall') {
      if (!m.isGroup) return m.reply(group);
      if (!isBotAdmin) return m.reply(botAdmin);
      if (!isAdmin) return m.reply(admin);
      const groupMetadata = await client.groupMetadata(m.chat);
      const participants = groupMetadata.participants;
      const mentions = participants.map(p => p.id);
      return client.sendMessage(m.chat, { text: text || `@everyone`, mentions }, { quoted: m });
    }

    if (command === 'closetime') {
      if (!m.isGroup) return m.reply(group);
      if (!isAdmin) return m.reply(admin);
      if (!isBotAdmin) return m.reply(botAdmin);
      const multipliers = { second: 1000, minute: 60000, hour: 3600000, day: 86400000 };
      if (!args[1] || !multipliers[args[1]]) return m.reply('*select:*\nsecond\nminute\nhour\nday\n\n*Example*\n10 second');
      const timer = args[0] * multipliers[args[1]];
      m.reply(`Countdown of ${q} starting from now to close the group`);
      setTimeout(() => { client.groupSettingUpdate(m.chat, 'announcement'); m.reply(`𝗚𝗿𝗼𝘂𝗽 𝗵𝗮𝘀 𝗯𝗲𝗲𝗻 𝗰𝗹𝗼𝘀𝗲𝗱`); }, timer);
    }

    if (command === 'opentime') {
      if (!m.isGroup) return m.reply(group);
      if (!isAdmin) return m.reply(admin);
      if (!isBotAdmin) return m.reply(botAdmin);
      const multipliers = { second: 1000, minute: 60000, hour: 3600000, day: 86400000 };
      if (!args[1] || !multipliers[args[1]]) return m.reply('*select:*\nsecond\nminute\nhour\nday\n\n*example*\n10 second');
      const timer = args[0] * multipliers[args[1]];
      m.reply(`Countdown of ${q} starting from now to open the group`);
      setTimeout(() => { client.groupSettingUpdate(m.chat, 'not_announcement'); m.reply(`𝗚𝗿𝗼𝘂𝗽 𝗼𝗽𝗲𝗻𝗲𝗱 𝘀𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆`); }, timer);
    }

    if (command === 'cast') {
      if (!isOwner) return m.reply(NotOwner);
      if (!m.isGroup) return m.reply(group);
      if (!text) return m.reply(`provide a text to cast!`);
      const castMeta = await client.groupMetadata(m.chat);
      const mem = castMeta.participants.filter(p => p.id.endsWith('.net')).map(p => p.id);
      m.reply(`Casting message to ${mem.length} contacts...`);
      for (let pler of mem) await client.sendMessage(pler, { text: q });
      return m.reply(`Casting completed successfully😁`);
    }

    if (command === 'broadcast') {
      if (!isOwner) return m.reply(NotOwner);
      if (!text) return m.reply("❌ No broadcast message provided!");
      const allGroups = await client.groupFetchAllParticipating();
      const groups = Object.entries(allGroups).map(e => e[1]);
      const res = groups.map(v => v.id);
      m.reply(`Broadcasting in ${res.length} groups...`);
      for (let i of res) {
        const txt = `𝐁𝐋𝐀𝐂𝐊𝐌𝐀𝐂𝐇𝐀𝐍𝐓 𝐁𝐎𝗧 𝗕𝗥𝗢𝗔𝗗𝗖𝗔𝗦𝗧 >\n\n🀄 Message: ${text}\n\nAuthor: ${pushname}`;
        await client.sendMessage(i, { image: { url: "https://telegra.ph/file/416c3ae0cfe59be8db011.jpg" }, caption: txt });
      }
      return m.reply(`Broadcasted to ${res.length} Groups.`);
    }

    if (command === 'link' || command === 'linkgroup') {
      if (!m.isGroup) return m.reply(group);
      if (!isBotAdmin) return m.reply(botAdmin);
      const code = await client.groupInviteCode(m.chat);
      const groupMetadata = await client.groupMetadata(m.chat);
      return m.reply(`https://chat.whatsapp.com/${code}\n\nGroup link for ${groupMetadata.subject}`);
    }

    if (command === 'gcprofile') {
      if (!m.isGroup) return m.reply("This command is meant for groups");
      const info = await client.groupMetadata(m.chat);
      let pp = 'https://files.catbox.moe/t03s77.jpg';
      try { pp = await client.profilePictureUrl(m.chat, 'image'); } catch {}
      const created = new Date(info.creation * 1000).toLocaleString();
      return client.sendMessage(m.chat, { image: { url: pp }, caption: `_Name_ : *${info.subject}*\n_ID_ : *${info.id}*\n_Created_ : *${created}*\n_Participants_ : *${info.size}*\n_Members_ : *${info.participants.filter(p => p.admin == null).length}*\n_Admins_ : *${info.participants.filter(p => p.admin).length}*\n_Who can send_ : *${info.announce ? 'Admins' : 'Everyone'}*\n_Who can edit_ : *${info.restrict ? 'Admins' : 'Everyone'}*` }, { quoted: m });
    }

    if (command === 'togroupstatus' || command === 'groupstatus' || command === 'statusgroup') {
      if (!isOwner) return m.reply(NotOwner);
      if (!m.isGroup) return m.reply(group);
      if (!text && !m.quoted) return m.reply("📌 Usage:\n• togroupstatus <text>\n• Reply to an image/video/audio with togroupstatus <caption>");
      try {
        let payload = { groupStatusMessage: {} };
        if (m.quoted) {
          const qtype = m.quoted.mtype || '';
          const caption = text || m.quoted.msg?.caption || "";
          if (qtype === 'imageMessage') { const fp = await client.downloadAndSaveMediaMessage(m.quoted); payload.groupStatusMessage.image = { url: fp }; if (caption) payload.groupStatusMessage.caption = caption; }
          else if (qtype === 'videoMessage') { const fp = await client.downloadAndSaveMediaMessage(m.quoted); payload.groupStatusMessage.video = { url: fp }; if (caption) payload.groupStatusMessage.caption = caption; }
          else if (m.quoted.text) { payload.groupStatusMessage.text = m.quoted.text; }
        } else { payload.groupStatusMessage.text = text; }
        await client.sendMessage(m.chat, payload, { quoted: m });
      } catch (err) { return m.reply(`❌ Error sending group status: ${err.message}`); }
    }

    if (command === 'poll') {
      if (!text) return m.reply(`Wrong format::\nExample:- poll who is the best president|Putin, Ruto`);
      const [poll, opt] = text.split("|");
      if (!opt) return m.reply(`Wrong format::\nExample:- poll who is the best president|Putin, Ruto`);
      const options = opt.split(',').map(o => o.trim());
      return client.sendMessage(m.chat, { poll: { name: poll, values: options } });
    }
  }
};
