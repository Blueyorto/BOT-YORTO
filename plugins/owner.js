'use strict';

module.exports = [

  {
    command: ['settings'],
    description: 'View all bot settings',
    category: 'owner',
    handler: async (client, m, { Owner, NotOwner }) => {
      if (!Owner) return m.reply(NotOwner);
      const { getSettings } = require('../database/config');
      const settings = await getSettings();
      let txt = `⚙️ *BLACK-MD Settings*\n\n`;
      for (const [key, val] of Object.entries(settings)) {
        txt += `*${key}:* ${val}\n`;
      }
      m.reply(txt.trim());
    }
  },

  {
    command: ['antilink'],
    description: 'Toggle anti-link protection',
    category: 'owner',
    handler: async (client, m, { reply, admin, group, botAdmin, isAdmin, isBotAdmin, Owner, NotOwner, text }) => {
      if (!m.isGroup) return reply(group);
      if (!isAdmin && !Owner) return reply(admin);
      const state = text?.toLowerCase();
      if (!['on', 'off'].includes(state)) return reply('Usage: .antilink on/off');
      const { updateSetting } = require('../database/config');
      await updateSetting('antilink', state);
      reply(`✅ Anti-link is now *${state.toUpperCase()}*`);
    }
  },

  {
    command: ['antilinkall'],
    description: 'Toggle anti-all-links protection',
    category: 'owner',
    handler: async (client, m, { reply, admin, group, isAdmin, Owner, text }) => {
      if (!m.isGroup) return reply(group);
      if (!isAdmin && !Owner) return reply(admin);
      const state = text?.toLowerCase();
      if (!['on', 'off'].includes(state)) return reply('Usage: .antilinkall on/off');
      const { updateSetting } = require('../database/config');
      await updateSetting('antilinkall', state);
      reply(`✅ Anti-link-all is now *${state.toUpperCase()}*`);
    }
  },

  {
    command: ['antidelete'],
    description: 'Toggle anti-delete',
    category: 'owner',
    handler: async (client, m, { reply, Owner, NotOwner, text }) => {
      if (!Owner) return reply(NotOwner);
      const state = text?.toLowerCase();
      if (!['on', 'off'].includes(state)) return reply('Usage: .antidelete on/off');
      const { updateSetting } = require('../database/config');
      await updateSetting('antidelete', state);
      reply(`✅ Anti-delete is now *${state.toUpperCase()}*`);
    }
  },

  {
    command: ['gptdm'],
    description: 'Toggle GPT auto-reply in DM',
    category: 'owner',
    handler: async (client, m, { reply, Owner, NotOwner, text }) => {
      if (!Owner) return reply(NotOwner);
      const state = text?.toLowerCase();
      if (!['on', 'off'].includes(state)) return reply('Usage: .gptdm on/off');
      const { updateSetting } = require('../database/config');
      await updateSetting('gptdm', state);
      reply(`✅ GPT DM auto-reply is now *${state.toUpperCase()}*`);
    }
  },

  {
    command: ['autoread'],
    description: 'Toggle auto-read messages',
    category: 'owner',
    handler: async (client, m, { reply, Owner, NotOwner, text }) => {
      if (!Owner) return reply(NotOwner);
      const state = text?.toLowerCase();
      if (!['on', 'off'].includes(state)) return reply('Usage: .autoread on/off');
      const { updateSetting } = require('../database/config');
      await updateSetting('autoread', state);
      reply(`✅ Auto-read is now *${state.toUpperCase()}*`);
    }
  },

  {
    command: ['mode'],
    description: 'Switch bot mode (public/private)',
    category: 'owner',
    handler: async (client, m, { reply, Owner, NotOwner, text }) => {
      if (!Owner) return reply(NotOwner);
      const state = text?.toLowerCase();
      if (!['public', 'private'].includes(state)) return reply('Usage: .mode public/private');
      const { updateSetting } = require('../database/config');
      await updateSetting('mode', state);
      reply(`✅ Bot mode is now *${state.toUpperCase()}*`);
    }
  },

  {
    command: ['prefix'],
    description: 'Change bot command prefix',
    category: 'owner',
    handler: async (client, m, { reply, Owner, NotOwner, text }) => {
      if (!Owner) return reply(NotOwner);
      if (!text || text.length > 2) return reply('Usage: .prefix !\nPrefix must be 1-2 characters.');
      const { updateSetting } = require('../database/config');
      await updateSetting('prefix', text);
      reply(`✅ Prefix changed to *${text}*`);
    }
  },

  {
    command: ['autolike'],
    description: 'Toggle auto-like status',
    category: 'owner',
    handler: async (client, m, { reply, Owner, NotOwner, text }) => {
      if (!Owner) return reply(NotOwner);
      const state = text?.toLowerCase();
      if (!['on', 'off'].includes(state)) return reply('Usage: .autolike on/off');
      const { updateSetting } = require('../database/config');
      await updateSetting('autolike', state);
      reply(`✅ Auto-like is now *${state.toUpperCase()}*`);
    }
  },

  {
    command: ['autobio'],
    description: 'Toggle auto bio update',
    category: 'owner',
    handler: async (client, m, { reply, Owner, NotOwner, text }) => {
      if (!Owner) return reply(NotOwner);
      const state = text?.toLowerCase();
      if (!['on', 'off'].includes(state)) return reply('Usage: .autobio on/off');
      const { updateSetting } = require('../database/config');
      await updateSetting('autobio', state);
      reply(`✅ Auto-bio is now *${state.toUpperCase()}*`);
    }
  },

  {
    command: ['autoview'],
    description: 'Toggle auto-view status',
    category: 'owner',
    handler: async (client, m, { reply, Owner, NotOwner, text }) => {
      if (!Owner) return reply(NotOwner);
      const state = text?.toLowerCase();
      if (!['on', 'off'].includes(state)) return reply('Usage: .autoview on/off');
      const { updateSetting } = require('../database/config');
      await updateSetting('autoview', state);
      reply(`✅ Auto-view is now *${state.toUpperCase()}*`);
    }
  },

  {
    command: ['menutype'],
    description: 'Toggle menu type (image/text)',
    category: 'owner',
    handler: async (client, m, { reply, Owner, NotOwner, text }) => {
      if (!Owner) return reply(NotOwner);
      const state = text?.toLowerCase();
      if (!['image', 'text'].includes(state)) return reply('Usage: .menutype image/text');
      const { updateSetting } = require('../database/config');
      await updateSetting('menutype', state);
      reply(`✅ Menu type is now *${state.toUpperCase()}*`);
    }
  },

  {
    command: ['wapresence'],
    description: 'Set bot WhatsApp presence',
    category: 'owner',
    handler: async (client, m, { reply, Owner, NotOwner, text }) => {
      if (!Owner) return reply(NotOwner);
      const valid = ['online', 'typing', 'recording', 'offline'];
      if (!valid.includes(text?.toLowerCase())) return reply(`Usage: .wapresence ${valid.join('/')}`);
      const { updateSetting } = require('../database/config');
      await updateSetting('wapresence', text.toLowerCase());
      reply(`✅ Presence set to *${text.toUpperCase()}*`);
    }
  },

  {
    command: ['badword'],
    description: 'Toggle bad word filter',
    category: 'owner',
    handler: async (client, m, { reply, admin, group, isAdmin, Owner, text }) => {
      if (!m.isGroup) return reply(group);
      if (!isAdmin && !Owner) return reply(admin);
      const state = text?.toLowerCase();
      if (!['on', 'off'].includes(state)) return reply('Usage: .badword on/off');
      const { updateSetting } = require('../database/config');
      await updateSetting('badword', state);
      reply(`✅ Bad word filter is now *${state.toUpperCase()}*`);
    }
  },

  {
    command: ['anticall'],
    description: 'Toggle anti-call',
    category: 'owner',
    handler: async (client, m, { reply, Owner, NotOwner, text }) => {
      if (!Owner) return reply(NotOwner);
      const state = text?.toLowerCase();
      if (!['on', 'off'].includes(state)) return reply('Usage: .anticall on/off');
      const { updateSetting } = require('../database/config');
      await updateSetting('anticall', state);
      reply(`✅ Anti-call is now *${state.toUpperCase()}*`);
    }
  },

  {
    command: ['antibot'],
    description: 'Toggle anti-bot',
    category: 'owner',
    handler: async (client, m, { reply, admin, group, isAdmin, Owner, text }) => {
      if (!m.isGroup) return reply(group);
      if (!isAdmin && !Owner) return reply(admin);
      const state = text?.toLowerCase();
      if (!['on', 'off'].includes(state)) return reply('Usage: .antibot on/off');
      const { updateSetting } = require('../database/config');
      await updateSetting('antibot', state);
      reply(`✅ Anti-bot is now *${state.toUpperCase()}*`);
    }
  },

  {
    command: ['antitag'],
    description: 'Toggle anti-tag',
    category: 'owner',
    handler: async (client, m, { reply, admin, group, isAdmin, Owner, text }) => {
      if (!m.isGroup) return reply(group);
      if (!isAdmin && !Owner) return reply(admin);
      const state = text?.toLowerCase();
      if (!['on', 'off'].includes(state)) return reply('Usage: .antitag on/off');
      const { updateSetting } = require('../database/config');
      await updateSetting('antitag', state);
      reply(`✅ Anti-tag is now *${state.toUpperCase()}*`);
    }
  },

  {
    command: ['welcomegoodbye'],
    description: 'Toggle welcome/goodbye messages',
    category: 'owner',
    handler: async (client, m, { reply, admin, group, isAdmin, Owner, text }) => {
      if (!m.isGroup) return reply(group);
      if (!isAdmin && !Owner) return reply(admin);
      const state = text?.toLowerCase();
      if (!['on', 'off'].includes(state)) return reply('Usage: .welcomegoodbye on/off');
      const { updateSetting } = require('../database/config');
      await updateSetting('welcomegoodbye', state);
      reply(`✅ Welcome/Goodbye is now *${state.toUpperCase()}*`);
    }
  },

  {
    command: ['broadcast'],
    description: 'Broadcast a message to all groups',
    category: 'owner',
    handler: async (client, m, { reply, Owner, NotOwner, text }) => {
      if (!Owner) return reply(NotOwner);
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
      if (!Owner) return reply(NotOwner);
      await m.reply('🔄 _Restarting bot..._');
      process.exit(0);
    }
  },

  {
    command: ['getcase'],
    description: 'Get source code of a command',
    category: 'owner',
    handler: async (client, m, { reply, Owner, NotOwner, text }) => {
      if (!Owner) return reply(NotOwner);
      if (!text) return reply('Provide a command name. E.g: .getcase ping');
      reply(`ℹ️ With the plugin system, each command lives in its own file in the *plugins/* folder.\n\nTo view *${text}*, open the relevant plugin file in the plugins directory.`);
    }
  },

  {
    command: ['togroupstatus', 'groupstatus', 'statusgroup'],
    description: 'Toggle sending status to a group',
    category: 'owner',
    handler: async (client, m, { reply, Owner, NotOwner, admin, group, isAdmin, text }) => {
      if (!m.isGroup) return reply(group);
      if (!Owner && !isAdmin) return reply(admin);
      const state = text?.toLowerCase();
      if (!['on', 'off'].includes(state)) return reply('Usage: .groupstatus on/off');
      const { updateSetting } = require('../database/config');
      await updateSetting('groupstatus', state);
      reply(`✅ Group status forwarding is now *${state.toUpperCase()}*`);
    }
  },

];
