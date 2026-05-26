'use strict';

const api = 'https://apis.keithsite.top';

module.exports = [

  {
    command: ['ai', 'gemini2'],
    description: 'Chat with Gemini AI',
    category: 'ai',
    handler: async (client, m, { reply, text }) => {
      if (!text) return reply('Provide a prompt. E.g: .ai How does the sun work?');
      await reply('🤖 _Thinking..._');
      const res = await global.axios.get(`${api}/api/ai/gemini`, { params: { q: text }, timeout: 30000 });
      const answer = res.data?.result || res.data?.reply || 'No response from AI.';
      m.reply(answer);
    }
  },

  {
    command: ['gemini'],
    description: 'Chat with Gemini (alternative endpoint)',
    category: 'ai',
    handler: async (client, m, { reply, text }) => {
      if (!text) return reply('Provide a prompt. E.g: .gemini Explain quantum physics');
      await reply('🤖 _Processing..._');
      const res = await global.axios.get(`${api}/api/ai/gemini`, { params: { q: text }, timeout: 30000 });
      const answer = res.data?.result || res.data?.reply || 'No response from AI.';
      m.reply(answer);
    }
  },

  {
    command: ['gpt', 'chatgpt'],
    description: 'Chat with ChatGPT',
    category: 'ai',
    handler: async (client, m, { reply, text }) => {
      if (!text) return reply('Provide a prompt. E.g: .gpt Explain machine learning');
      await reply('🤖 _Thinking..._');
      const res = await global.axios.get('https://apis.xcasper.space/api/ai/chatgpt4o', { params: { q: text }, timeout: 30000 });
      const answer = res.data?.reply || 'No response from AI.';
      m.reply(answer);
    }
  },

  {
    command: ['vision', 'imgai', 'analyze', 'geminivision'],
    description: 'Analyze an image with AI',
    category: 'ai',
    handler: async (client, m, { reply, quoted, mime, text }) => {
      if (!quoted) return reply('Quote an image to analyze.');
      if (!/image/.test(mime)) return reply('Quote an *image* message.');
      await reply('👁️ _Analyzing image..._');
      const buffer = await client.downloadMediaMessage(quoted);
      const base64 = buffer.toString('base64');
      const prompt = text || 'Describe this image in detail.';
      const res = await global.axios.post(`${api}/api/ai/vision`, { image: base64, prompt }, { timeout: 30000 });
      const answer = res.data?.result || res.data?.reply || 'Could not analyze image.';
      m.reply(answer);
    }
  },

  {
    command: ['image', 'img'],
    description: 'Generate an image from a prompt',
    category: 'ai',
    handler: async (client, m, { reply, text }) => {
      if (!text) return reply('Provide a prompt. E.g: .image a cat on the moon');
      await reply('🎨 _Generating image..._');
      const res = await global.axios.get(`${api}/api/ai/image`, { params: { prompt: text }, timeout: 60000, responseType: 'arraybuffer' });
      const buf = Buffer.from(res.data);
      await client.sendMessage(m.chat, { image: buf, caption: `🎨 *Generated:* ${text}` }, { quoted: m });
    }
  },

  {
    command: ['image2', 'ai-img'],
    description: 'Generate image (alternative model)',
    category: 'ai',
    handler: async (client, m, { reply, text }) => {
      if (!text) return reply('Provide a prompt. E.g: .ai-img a futuristic city');
      await reply('🎨 _Generating image..._');
      const res = await global.axios.get(`${api}/api/ai/image2`, { params: { prompt: text }, timeout: 60000, responseType: 'arraybuffer' });
      const buf = Buffer.from(res.data);
      await client.sendMessage(m.chat, { image: buf, caption: `🎨 *Generated:* ${text}` }, { quoted: m });
    }
  },

  {
    command: ['dalle', 'createimage', 'imagine'],
    description: 'Generate image using DALL-E',
    category: 'ai',
    handler: async (client, m, { reply, text }) => {
      if (!text) return reply('Provide a prompt. E.g: .imagine a dragon flying over a mountain');
      await reply('🎨 _DALL-E is painting..._');
      const res = await global.axios.get(`${api}/api/ai/dalle`, { params: { prompt: text }, timeout: 60000, responseType: 'arraybuffer' });
      const buf = Buffer.from(res.data);
      await client.sendMessage(m.chat, { image: buf, caption: `🎨 *DALL-E:* ${text}` }, { quoted: m });
    }
  },

  {
    command: ['wormgpt', 'worm'],
    description: 'Chat with WormGPT (uncensored AI)',
    category: 'ai',
    handler: async (client, m, { reply, text }) => {
      if (!text) return reply('Provide a prompt. E.g: .wormgpt How do hackers work');
      await reply('🤖 _WormGPT thinking..._');
      const res = await global.axios.get('https://apiz.xhclinton.me/api/ai/wormgpt', {
        params: { apikey: 'toxicapis', prompt: text },
        timeout: 30000
      });
      const answer = res.data?.result || res.data?.reply || res.data?.response || JSON.stringify(res.data);
      m.reply(answer);
    }
  },

  {
    command: ['url'],
    description: 'Summarize or chat about a URL',
    category: 'ai',
    handler: async (client, m, { reply, text }) => {
      if (!text) return reply('Provide a URL. E.g: .url https://example.com');
      await reply('🔗 _Fetching and analyzing URL..._');
      const res = await global.axios.get(`${api}/api/ai/url`, { params: { url: text }, timeout: 30000 });
      const answer = res.data?.result || res.data?.reply || 'Could not process URL.';
      m.reply(answer);
    }
  },

];
