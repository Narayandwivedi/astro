require('dotenv').config();
const axios = require('axios');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_GROUP_ID;

console.log('Testing Telegram notification...');
console.log('BOT_TOKEN:', BOT_TOKEN ? BOT_TOKEN.substring(0, 15) + '...' : 'NOT SET');
console.log('CHAT_ID:', CHAT_ID || 'NOT SET');

const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

axios.post(url, {
  chat_id: CHAT_ID,
  text: '🧪 Test notification from Astro Satya backend',
  parse_mode: 'HTML'
})
.then(() => {
  console.log('✅ Test message sent successfully!');
  process.exit(0);
})
.catch(err => {
  console.error('❌ Error:', err.response?.data || err.message);
  process.exit(1);
});
