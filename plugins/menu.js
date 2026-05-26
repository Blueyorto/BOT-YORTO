'use strict';

const handler = require('../lib/handler');

module.exports = [

  {
    command: ['menu', 'help'],
    description: 'Show command list',
    category: 'menu',
    handler: async (client, m, { prefix, pushname }) => {
      const commands = handler.listCommands();

      // Group by category
      const byCategory = {};
      // Re-import all plugin objects to get categories
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
        media: '🎭',
        ai: '🤖',
        music: '🎵',
        utility: '🔧',
        owner: '👑',
        fun: '🎉',
        misc: '📦',
      };

      let menu = `╔══════════════════╗\n`;
      menu += `║   𝐁𝐋𝐀𝐂𝐊-𝐌𝐃 𝐌𝐄𝐍𝐔   ║\n`;
      menu += `╚══════════════════╝\n\n`;
      menu += `👤 *User:* ${pushname}\n`;
      menu += `🔑 *Prefix:* ${prefix}\n`;
      menu += `📦 *Total Commands:* ${commands.length}\n\n`;

      for (const [cat, plugins] of Object.entries(byCategory)) {
        const icon = categoryIcons[cat] || '📌';
        menu += `${icon} *${cat.toUpperCase()}*\n`;
        for (const p of plugins) {
          menu += `  • ${prefix}${p.commands[0]}`;
          if (p.commands.length > 1) menu += ` _(${p.commands.slice(1).join(', ')})_`;
          if (p.description) menu += ` — ${p.description}`;
          menu += '\n';
        }
        menu += '\n';
      }

      menu += `━━━━━━━━━━━━━━━━━━\n`;
      menu += `_Powered by BLACK-MD Bot_`;

      m.reply(menu);
    }
  },

];
