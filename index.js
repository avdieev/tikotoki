
require('dotenv').config();
const express = require('express');
const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');
const app = express();

const {
  getTiktokInfo,
  tiktokVideo,
  tiktokAudio,
  tiktokSound
} = require('./funcs/tiktok');
const {
  getDataTwitter,
  downloadTwitterHigh,
  downloadTwitterLow,
  downloadTwitterAudio
} = require('./funcs/twitter');
const {
  getPlaylistSpotify,
  getAlbumsSpotify,
  getSpotifySong
} = require('./funcs/spotify');
const {
  downloadInstagram
} = require('./funcs/instagram');
const {
  pinterest,
  pinSearch
} = require('./funcs/pinterest');
const {
  getBanned
} = require('./funcs/functions'); 
const {
  getYoutube,
  getYoutubeAudio,
  getYoutubeVideo
} = require('./funcs/youtube');
const {
  getFacebook,
  getFacebookNormal,
  getFacebookHD,
  getFacebookAudio
} = require('./funcs/facebook');
const {
  threadsDownload
} = require('./funcs/threads');
const {
  getAiResponse
} = require('./funcs/ai');
const {
  getBrainlyAnswer
} = require('./funcs/brainly');
const {
  googleSearch
} = require('./funcs/google');
const {
  gitClone
} = require('./funcs/github');
const {
  getNetworkUploadSpeed,
  getNetworkDownloadSpeed,
  evaluateBot,
  executeBot
} = require('./funcs/dev');
const {
  telegraphUpload,
  Pomf2Upload,
  Ocr
} = require('./funcs/images');
const {
  readDb,
  writeDb,
  addUserDb,
  changeBoolDb
} = require('./funcs/database');

const token = process.env.TOKEN;
const bot = new TelegramBot(token, { webHook: true });

const url = 'https://your-domain.com'; // Замените на ваш HTTPS URL
const port = process.env.PORT || 3000;

// Устанавливаем вебхук
bot.setWebHook(`${url}/bot${token}`);

// Обработка входящих сообщений от Telegram через вебхук
app.use(express.json());

app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body); // Передаем обновления в бота
  res.sendStatus(200); // Отправляем статус 200 Telegram
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// ОСТАЛЬНЫЕ ФУНКЦИИ БОТА ОСТАЮТСЯ БЕЗ ИЗМЕНЕНИЙ

bot.on('photo', async (msg) => {
  let chatId = msg.chat.id;
  if (typeof getBanned !== 'function') {
    return bot.sendMessage(chatId, 'Function getBanned is not available.');
  }
  let getban = await getBanned(chatId);
  if (!getban.status) return bot.sendMessage(chatId, `You have been banned

Reason : ${getban.reason}`);
  if (!fs.existsSync(`images/${chatId}`)) await fs.mkdirSync(`images/${chatId}`)
  try {
    let write = await bot.downloadFile(msg.photo[msg.photo.length - 1].file_id, `images/${chatId}`);
    await bot.deleteMessage(msg.chat.id, msg.message_id);
    let options = {
      caption: `Please select the following option`,
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [{ text: `Extract Text [ OCR ]`, callback_data: `ocr ${write}` }],
          [{ text: `Upload To Url V1 [ Telegraph ]`, callback_data: `tourl1 ${write}` }],
          [{ text: `Upload To Url V2 [ Pomf2 ]`, callback_data: `tourl2 ${write}` }]
        ]
      })
    }
    return bot.sendPhoto(chatId, `${write}`, options)
  } catch (err) {
    return bot.sendMessage(String(process.env.DEV_ID), `Error Image Process: ${err}`);
  }
});

bot.onText(/\/start/, async (msg) => {
  if (typeof getBanned !== 'function') {
    return bot.sendMessage(msg.chat.id, 'Function getBanned is not available.');
  }
  let getban = await getBanned(msg.chat.id);
  if (!getban.status) return bot.sendMessage(msg.chat.id, `You have been banned

Reason : ${getban.reason}`);
  let response = `Hello I am ${botName}

[Indonesia]
Silahkan kirim link video atau postingan yang mau didownload, bot hanya support pada sosial media pada list

[English]
Please send a link to the video or post you want to download, the bot only supports social media on the list

LIST :
• Threads
• Tiktok
• Instagram
• Twitter
• Facebook
• Pinterest
• Spotify
• Github

OTHER FEATURES:
/ai (Question)
/brainly (Questions)
/pin (Pinterest Search)
/google (Google Search)

[Indonesia]
Kirim gambar untuk ocr (extract text), telegraf (upload), или pomf2 (upload).

[English]
Send images for ocr, telegraph, or pomf2.

Bot by @Krxuvv`;

  let db = await readDb('./database.json');
  let chatId = msg.chat.id;
  if (!db[chatId]) {
    await addUserDb(chatId, './database.json');
    await bot.sendMessage(chatId, response);
  } else {
    await bot.sendMessage(chatId, response);
  }
});
