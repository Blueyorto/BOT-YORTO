'use strict';

const fs = require('fs');
const path = require('path');

const plugins = new Map();

/**
 * Load all plugins from the plugins/ directory.
 * Each file must export an array of plugin objects:
 *   { command: string|string[], handler: async (client, m, ctx) => {} }
 */
function loadPlugins(pluginsDir) {
  const files = fs.readdirSync(pluginsDir).filter(f => f.endsWith('.js'));
  for (const file of files) {
    const fullPath = path.join(pluginsDir, file);
    try {
      delete require.cache[require.resolve(fullPath)];
      const list = require(fullPath);
      const arr = Array.isArray(list) ? list : [list];
      for (const plugin of arr) {
        const cmds = Array.isArray(plugin.command) ? plugin.command : [plugin.command];
        for (const cmd of cmds) {
          plugins.set(cmd.toLowerCase(), plugin);
        }
      }
      console.log(`[HANDLER] Loaded plugin: ${file}`);
    } catch (err) {
      console.error(`[HANDLER] Failed to load ${file}:`, err.message);
    }
  }
}

/**
 * Dispatch an incoming command to the matching plugin.
 * Returns true if handled, false if no plugin matched.
 */
async function dispatch(command, client, m, ctx) {
  const plugin = plugins.get(command.toLowerCase());
  if (!plugin) return false;
  try {
    await plugin.handler(client, m, ctx);
  } catch (err) {
    console.error(`[HANDLER] Error in plugin for "${command}":`, err);
    m.reply(`❌ An error occurred while running *${command}*: ${err.message}`);
  }
  return true;
}

/**
 * Watch the plugins directory and hot-reload changed files.
 */
function watchPlugins(pluginsDir) {
  fs.watch(pluginsDir, (eventType, filename) => {
    if (!filename || !filename.endsWith('.js')) return;
    const fullPath = path.join(pluginsDir, filename);
    console.log(`[HANDLER] Reloading plugin: ${filename}`);
    try {
      delete require.cache[require.resolve(fullPath)];
      const list = require(fullPath);
      const arr = Array.isArray(list) ? list : [list];
      // Remove old entries for this file first
      for (const [key, plugin] of plugins.entries()) {
        if (plugin._file === filename) plugins.delete(key);
      }
      for (const plugin of arr) {
        plugin._file = filename;
        const cmds = Array.isArray(plugin.command) ? plugin.command : [plugin.command];
        for (const cmd of cmds) {
          plugins.set(cmd.toLowerCase(), plugin);
        }
      }
    } catch (err) {
      console.error(`[HANDLER] Reload failed for ${filename}:`, err.message);
    }
  });
}

/** List all registered commands */
function listCommands() {
  return [...plugins.keys()];
}

module.exports = { loadPlugins, watchPlugins, dispatch, listCommands };
