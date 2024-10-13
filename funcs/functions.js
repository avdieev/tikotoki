
const axios = require('axios');
const cheerio = require('cheerio');

async function getRandom(ext) {
    return `${Math.floor(Math.random() * 10000)}${ext}`;
}

async function getBuffer(url) {
  try {
    let data = await axios({
      method: 'get',
      url,
      headers: {
        'DNT': 1,
        'Upgrade-Insecure-Requests': 1
      },
      responseType: 'arraybuffer'
    });
    return data.data;
  } catch (err) {
    console.log(err);
    return err;
  }
}

function filterAlphanumericWithDash(inputText) {
  return inputText.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-');
}

function htmlToText(html) {
  let $ = cheerio.load(html);
  return $.text();
}

// Функция для проверки статуса бана пользователя
async function getBanned(chatId) {
  const bannedUsers = [123456789, 987654321]; // Пример массива забаненных пользователей
  if (bannedUsers.includes(chatId)) {
    return {
      status: false,
      reason: "You are banned for violating the rules."
    };
  } else {
    return {
      status: true
    };
  }
}

module.exports = {
  getBuffer,
  htmlToText,
  filterAlphanumericWithDash,
  getRandom,
  getBanned // Экспортируем функцию getBanned
};
