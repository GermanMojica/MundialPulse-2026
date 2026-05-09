const axios = require('axios');

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const BASE_URL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

const sendTelegramMessage = async (chatId, text) => {
  if (!TELEGRAM_TOKEN || !chatId) return;

  try {
    await axios.post(`${BASE_URL}/sendMessage`, {
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML'
    });
  } catch (error) {
    console.error('Error enviando mensaje a Telegram:', error.response?.data || error.message);
  }
};

const broadcastToTelegram = async (text) => {
  // Aquí podrías obtener una lista de chatIds desde la DB si guardas los de los usuarios
  // O enviar a un canal principal configurado en .env
  const mainChannelId = process.env.TELEGRAM_MAIN_CHANNEL_ID;
  if (mainChannelId) {
    await sendTelegramMessage(mainChannelId, text);
  }
};

module.exports = {
  sendTelegramMessage,
  broadcastToTelegram
};
