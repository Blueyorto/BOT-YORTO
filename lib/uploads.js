  const axios = require('axios');
  const FormData = require('form-data');
  const mime = require('mime-types');
  const fs = require('fs-extra');
  const path = require('path');
  const os = require('os');
  const ffmpeg = require('fluent-ffmpeg');
  const ffmpegPath = require('ffmpeg-static');


async function uploadToImgBB(filePath) {
  const buffer = await fs.readFile(filePath);
  const form = new FormData();
  form.append('image', buffer.toString('base64'));
  
  const { data } = await axios.post('https://api.imgbb.com/1/upload?key=51a83289ef870ddee8d19ccae557fef5', form, {
    headers: form.getHeaders()
  });

  return data.data.url;
  }

async function uploadToUguu(filePath) {
  if (!fs.existsSync(filePath)) throw new Error("File does not exist");

  const mimeType = mime.lookup(filePath) || 'application/octet-stream';
  const form = new FormData();
  form.append('files[]', fs.createReadStream(filePath), {
    filename: path.basename(filePath),
    contentType: mimeType
  });

  const response = await axios.post('https://uguu.se/upload.php', form, {
    headers: {
      ...form.getHeaders(),
      'origin': 'https://uguu.se',
      'referer': 'https://uguu.se/',
      'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36'
    }
  });

  const result = response.data;
  if (result.success && result.files?.[0]?.url) {
    return result.files[0].url;
  } else {
    throw new Error("Uguu upload failed or malformed response");
  }
  }

  async function webp2mp4File(inputPath) {
          return new Promise((resolve, reject) => {
                  try {
                          
                          ffmpeg.setFfmpegPath(ffmpegPath)

                          const outputPath = path.join(os.tmpdir(), 'webp2mp4_' + Date.now() + '.mp4')

                          ffmpeg(inputPath)
                                  .outputOptions([
                                          '-movflags', 'faststart',
                                          '-pix_fmt', 'yuv420p',
                                          '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2'
                                  ])
                                  .toFormat('mp4')
                                  .on('end', () => {
                                          resolve({
                                                  status: true,
                                                  message: 'Converted locally via ffmpeg',
                                                  result: outputPath,
                                                  isLocal: true
                                          })
                                  })
                                  .on('error', (err) => {
                                          reject(new Error('ffmpeg conversion failed: ' + err.message))
                                  })
                                  .save(outputPath)
                  } catch (err) {
                          reject(new Error('webp2mp4File setup error: ' + err.message))
                  }
          })
  }

  module.exports = { uploadToUguu, uploadToImgBB, webp2mp4File }
  
