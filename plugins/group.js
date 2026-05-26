'use strict';

module.exports = [

  {
    command: ['disp-on'],
    description: 'Turn on disappearing messages (90 days)',
    category: 'group',
    handler: async (client, m, { reply, admin, group, botAdmin, isAdmin, isBotAdmin }) => {
      if (!m.isGroup) return reply(group);
      if (!isBotAdmin) return reply(botAdmin);
      if (!isAdmin) return reply(admin);
      await client.groupToggleEphemeral(m.chat, 90 * 24 * 3600);
      m.reply('Disappearing messages successfully turned on for 90 days!');
    }
  },

  {
    command: ['disp-off'],
    description: 'Turn off disappearing messages',
    category: 'group',
    handler: async (client, m, { reply, admin, group, botAdmin, isAdmin, isBotAdmin }) => {
      if (!m.isGroup) return reply(group);
      if (!isBotAdmin) return reply(botAdmin);
      if (!isAdmin) return reply(admin);
      await client.groupToggleEphemeral(m.chat, 0);
      m.reply('Disappearing messages successfully turned off!');
    }
  },

  {
    command: ['icon'],
    description: 'Change group icon',
    category: 'group',
    handler: async (client, m, { reply, admin, group, botAdmin, isAdmin, isBotAdmin, quoted, mime, prefix, command }) => {
      if (!m.isGroup) return reply(group);
      if (!isAdmin) return reply(admin);
      if (!isBotAdmin) return reply(botAdmin);
      if (!quoted) return reply(`Send or tag an image with the caption ${prefix + command}`);
      if (!/image/.test(mime)) return reply(`Send or tag an image with the caption ${prefix + command}`);
      if (/webp/.test(mime)) return reply(`Send or tag an image with the caption ${prefix + command}`);
      let media = await client.downloadAndSaveMediaMessage(quoted);
      await client.updateProfilePicture(m.chat, { url: media }).catch(() => {});
      reply('Group icon updated');
    }
  },

  {
    command: ['revoke', 'newlink', 'reset'],
    description: 'Reset group invite link',
    category: 'group',
    handler: async (client, m, { reply, admin, group, botAdmin, isAdmin, isBotAdmin, groupMetadata }) => {
      if (!m.isGroup) return reply(group);
      if (!isAdmin) return reply(admin);
      if (!isBotAdmin) return reply(botAdmin);
      await client.groupRevokeInvite(m.chat);
      await client.sendText(m.chat, 'Group link revoked!', m);
      let response = await client.groupInviteCode(m.chat);
      client.sendText(m.sender, `https://chat.whatsapp.com/${response}\n\nHere is the new group link for ${groupMetadata.subject}`, m, { detectLink: true });
      client.sendText(m.chat, 'Sent you the new group link in your inbox!', m);
    }
  },

  {
    command: ['delete', 'del'],
    description: 'Delete a quoted message',
    category: 'group',
    handler: async (client, m, { reply, admin, group, botAdmin, isAdmin, isBotAdmin }) => {
      if (!m.isGroup) return reply(group);
      if (!isBotAdmin) return reply(botAdmin);
      if (!isAdmin) return reply(admin);
      if (!m.quoted) return reply('No message quoted for deletion');
      let { isBaileys } = m.quoted;
      if (isBaileys) return reply('I cannot delete. Quoted message is my message or another bot message.');
      client.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.quoted.id, participant: m.quoted.sender } });
    }
  },

  {
    command: ['leave'],
    description: 'Make bot leave the group',
    category: 'group',
    handler: async (client, m, { Owner, NotOwner, participants }) => {
      if (!Owner) return m.reply(NotOwner);
      if (!m.isGroup) return m.reply('This command is meant for groups');
      await client.sendMessage(m.chat, { text: '𝗚𝗼𝗼𝗱𝗯𝘆𝗲 𝗲𝘃𝗲𝗿𝘆𝗼𝗻𝗲👋. 𝐁𝐋𝐀𝐂𝐊𝐌𝐀𝐂𝐇𝐀𝐍𝐓 𝐁𝐎𝐓-𝗔𝗶 𝗶𝘀 𝗟𝗲𝗮𝘃𝗶𝗻𝗴 𝘁𝗵𝗲 𝗚𝗿𝗼𝘂𝗽 𝗻𝗼𝘄...', mentions: participants.map(a => a.id) }, { quoted: m });
      await client.groupLeave(m.chat);
    }
  },

  {
    command: ['subject', 'changesubject'],
    description: 'Change group subject/name',
    category: 'group',
    handler: async (client, m, { reply, admin, group, botAdmin, isAdmin, isBotAdmin, text }) => {
      if (!m.isGroup) return reply(group);
      if (!isBotAdmin) return reply(botAdmin);
      if (!isAdmin) return reply(admin);
      if (!text) return reply('Provide the text for the group subject.');
      await client.groupUpdateSubject(m.chat, text);
      m.reply('Group name successfully updated! 💀');
    }
  },

  {
    command: ['desc', 'setdesc'],
    description: 'Change group description',
    category: 'group',
    handler: async (client, m, { reply, admin, group, botAdmin, isAdmin, isBotAdmin, text }) => {
      if (!m.isGroup) return reply(group);
      if (!isBotAdmin) return reply(botAdmin);
      if (!isAdmin) return reply(admin);
      if (!text) return reply('Provide the text for the group description');
      await client.groupUpdateDescription(m.chat, text);
      m.reply('Group description successfully updated! 🥶');
    }
  },

  {
    command: ['hidetag', 'tag'],
    description: 'Tag all members silently',
    category: 'group',
    handler: async (client, m, { reply, admin, group, botAdmin, isAdmin, isBotAdmin, q }) => {
      if (!m.isGroup) return reply(group);
      if (!isBotAdmin) return reply(botAdmin);
      if (!isAdmin) return reply(admin);
      let groupMeta = await client.groupMetadata(m.chat);
      let mentionIds = groupMeta.participants.map(p => p.id);
      await client.sendMessage(m.chat, { text: q ? q : '@all', mentions: mentionIds }, { quoted: m });
    }
  },

  {
    command: ['tagall'],
    description: 'Tag all members with list',
    category: 'group',
    handler: async (client, m, { reply, admin, group, botAdmin, isAdmin, isBotAdmin, q }) => {
      if (!m.isGroup) return reply(group);
      if (!isBotAdmin) return reply(botAdmin);
      if (!isAdmin) return reply(admin);
      let groupMeta = await client.groupMetadata(m.chat);
      let members = groupMeta.participants;
      let teks = `🚀 *BLACK-MD TAG ALL*\n\nMessage: ${q ? q : 'No message'}\n\n`;
      for (let mem of members) teks += `𓅂 @${mem.id.split('@')[0]}\n`;
      await client.sendMessage(m.chat, { text: teks, mentions: members.map(a => a.id) }, { quoted: m });
    }
  },

  {
    command: ['gcprofile'],
    description: 'Show group profile info',
    category: 'group',
    handler: async (client, m, { reply }) => {
      if (!m.isGroup) return m.reply('This command is meant for groups');
      const { convertTimestamp } = require('../lib/ravenfunc');
      let info = await client.groupMetadata(m.chat);
      let ts = await convertTimestamp(info.creation);
      let pp;
      try { pp = await client.profilePictureUrl(m.chat, 'image'); }
      catch { pp = 'https://files.catbox.moe/t03s77.jpg'; }
      await client.sendMessage(m.chat, {
        image: { url: pp },
        caption: `_Name_ : *${info.subject}*\n\n_ID_ : *${info.id}*\n\n_Group owner_ : ${'@' + (info.owner || '').split('@')[0]}\n\n_Group created_ : *${ts.day}, ${ts.date} ${ts.month} ${ts.year}, ${ts.time}*\n\n_Participants_ : *${info.size}*\n_Members_ : *${info.participants.filter(p => p.admin == null).length}*\n\n_Admins_ : *${info.participants.length - info.participants.filter(p => p.admin == null).length}*\n\n_Who can send message_ : *${info.announce ? 'Admins' : 'Everyone'}*\n\n_Who can edit group info_ : *${info.restrict ? 'Admins' : 'Everyone'}*\n\n_Who can add participants_ : *${info.memberAddMode ? 'Everyone' : 'Admins'}*`
      }, { quoted: m });
    }
  },

  {
    command: ['add'],
    description: 'Add a member to the group',
    category: 'group',
    handler: async (client, m, { reply, admin, group, botAdmin, isAdmin, isBotAdmin, text, args }) => {
      if (!m.isGroup) return reply(group);
      if (!isBotAdmin) return reply(botAdmin);
      if (!isAdmin) return reply(admin);
      if (!text) return reply('Provide the phone number to add (with country code)');
      let num = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
      let res = await client.groupParticipantsUpdate(m.chat, [num], 'add');
      reply(JSON.stringify(res, null, 2));
    }
  },

  {
    command: ['approve', 'approve-all'],
    description: 'Approve pending join requests',
    category: 'group',
    handler: async (client, m, { reply, admin, group, botAdmin, isAdmin, isBotAdmin, command }) => {
      if (!m.isGroup) return reply(group);
      if (!isBotAdmin) return reply(botAdmin);
      if (!isAdmin) return reply(admin);
      let meta = await client.groupMetadata(m.chat);
      let requests = meta.membershipApprovalRequests || [];
      if (!requests.length) return reply('No pending join requests.');
      if (command === 'approve-all') {
        for (let r of requests) await client.groupParticipantsUpdate(m.chat, [r.jid], 'add');
        reply(`✅ Approved all ${requests.length} pending requests.`);
      } else {
        if (!m.quoted) return reply('Quote a message from the person to approve, or use *approve-all*.');
        await client.groupParticipantsUpdate(m.chat, [m.quoted.sender], 'add');
        reply('✅ Request approved.');
      }
    }
  },

  {
    command: ['reject', 'reject-all'],
    description: 'Reject pending join requests',
    category: 'group',
    handler: async (client, m, { reply, admin, group, botAdmin, isAdmin, isBotAdmin, command }) => {
      if (!m.isGroup) return reply(group);
      if (!isBotAdmin) return reply(botAdmin);
      if (!isAdmin) return reply(admin);
      let meta = await client.groupMetadata(m.chat);
      let requests = meta.membershipApprovalRequests || [];
      if (!requests.length) return reply('No pending join requests.');
      for (let r of requests) await client.groupParticipantsUpdate(m.chat, [r.jid], 'remove');
      reply(`❌ Rejected ${requests.length} pending requests.`);
    }
  },

  {
    command: ['kill', 'kickall'],
    description: 'Kick all non-admin members',
    category: 'group',
    handler: async (client, m, { reply, admin, group, botAdmin, isAdmin, isBotAdmin, Owner, NotOwner }) => {
      if (!m.isGroup) return reply(group);
      if (!isBotAdmin) return reply(botAdmin);
      if (!isAdmin) return reply(admin);
      if (!Owner) return reply(NotOwner);
      let meta = await client.groupMetadata(m.chat);
      let nonAdmins = meta.participants.filter(p => !p.admin).map(p => p.id);
      if (!nonAdmins.length) return reply('No non-admin members to kick.');
      for (let jid of nonAdmins) await client.groupParticipantsUpdate(m.chat, [jid], 'remove');
      reply(`Kicked ${nonAdmins.length} members.`);
    }
  },

  {
    command: ['blocklist'],
    description: 'Show blocked contacts',
    category: 'group',
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
    command: ['join'],
    description: 'Join a group via invite link',
    category: 'group',
    handler: async (client, m, { Owner, NotOwner, reply, args, text }) => {
      if (!Owner) return m.reply(NotOwner);
      if (!text) return reply('Provide a valid group link');
      let result = args[0].split('https://chat.whatsapp.com/')[1];
      await client.groupAcceptInvite(result)
        .then(res => reply(JSON.stringify(res)))
        .catch(() => reply('Link has a problem.'));
    }
  },

];
