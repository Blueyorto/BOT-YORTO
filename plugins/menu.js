'use strict';

const handler = require('../lib/handler');

module.exports = [

  {
    command: ['menu', 'help'],
    description: 'Show command list',
    category: 'menu',
    handler: async (client, m, { prefix, pushname, mode, Rspeed }) => {
      const commands = handler.listCommands();

      // Group by category
      const byCategory = {};
      const fs = require('fs');
      const path = require('path');
      const pluginsDir = path.join(__dirname);
      const files = fs.readdirSync(pluginsDir).filter(f => f.endsWith('.js') && f !== 'menu.js');
      for (const file of files) {
        try {
          const list = require(path.join(pluginsDir, file));
          const arr = Array.isArray(list) ? list : [list];
          for (const plugin of arr) {
            const cat = plugin.category || 'misc';
            if (!byCategory[cat]) byCategory[cat] = [];
            const cmds = Array.isArray(plugin.command) ? plugin.command : [plugin.command];
            byCategory[cat].push({ commands: cmds, description: plugin.description });
          }
        } catch {}
      }

      const categoryIcons = {
        group: '👥',
        media: '🎆',
        ai: '🤖',
        dowloads: '📥',
        coding: '🎭',
        utility: '🔧',
        owner: '👑',
        effects: '✨️',
        football: '⚽️',
        misc: '📦',
      };

      let menu = `╔══════════════════╗\n`;
      menu += `║         𝐁𝐋𝐀𝐂𝐊-𝐌𝐃  \n`;
      menu += `╚══════════════════╝\n\n`;
      menu += `👤 *User:* ${pushname}\n`;
      menu += `🪩 *Mode:* ${mode}\n`;
      menu += `⚡️ *Speed:* ${Rspeed.toFixed(4)}\n`;
      menu += `🔑 *Prefix:* ${prefix}\n`;
      menu += `📦 *Total Commands:* ${commands.length}\n\n`;

      for (const [cat, plugins] of Object.entries(byCategory)) {
        const icon = categoryIcons[cat] || '📌';
        menu += `${icon} *${cat.toUpperCase()}*\n`;
        for (const p of plugins) {
          menu += `╔══════════════════╗\n`;
          menu += `║ ● ${p.commands[0]}`;
          menu += `╚══════════════════╝\n\n`;
          menu += '\n';
        }
        menu += '\n';
      }

      menu += `━━━━━━━━━━━━━━━━━━\n`;
      menu += `_𝗠𝗮𝗱𝗲 𝗼𝗻 𝗲𝗮𝗿𝘁𝗵 𝗯𝘆 𝗛𝘂𝗺𝗮𝗻𝘀🔥!_`;

      m.reply(menu);
    }
  },

];
