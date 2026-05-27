const FormData = require('form-data');
const fs = require('fs-extra');
const axios = require('axios');

async function uploadToImgBB(filePath) {
  const buffer = await fs.readFile(filePath);
  const form = new FormData();
  form.append('image', buffer.toString('base64'));
  
  const { data } = await axios.post('https://api.imgbb.com/1/upload?key=51a83289ef870ddee8d19ccae557fef5', form, {
    headers: form.getHeaders()
  });

  return data.data.url;
}

module.exports = uploadToImgBB;
