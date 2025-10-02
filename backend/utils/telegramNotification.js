const axios = require('axios');

// Send user login alert (same as winners11)
const sendLoginAlert = async (userName) => {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_GROUP_ID;

  const message = `🔐 NEW LOGIN: ${userName} just logged in!`;
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id: CHAT_ID,
      text: message,
    });
  } catch (err) {
    console.error("Telegram error:", err.message);
  }
};

// Send user signup alert
const sendSignupAlert = async (userName, email) => {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_GROUP_ID;

  const message = `🎉 NEW USER SIGNUP: ${userName} (${email}) just signed up!`;
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id: CHAT_ID,
      text: message,
    });
  } catch (err) {
    console.error("Telegram error:", err.message);
  }
};

// Send Google signup alert
const sendGoogleSignupAlert = async (userName, email) => {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_GROUP_ID;

  const message = `🔐 NEW GOOGLE SIGNUP: ${userName} (${email}) signed up with Google!`;
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id: CHAT_ID,
      text: message,
    });
  } catch (err) {
    console.error("Telegram error:", err.message);
  }
};

// Send new order alert
const sendOrderAlert = async (orderData) => {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_GROUP_ID;

  const { customer, items, pricing, _id } = orderData;

  const itemsList = items.map(item =>
    `• ${item.productName} (Qty: ${item.quantity}) - ₹${item.totalPrice}`
  ).join('\n');

  const message = `🛍️ NEW ORDER RECEIVED!\n\nOrder ID: ${_id}\nCustomer: ${customer.name}\nPhone: ${customer.phone}\nEmail: ${customer.email}\n\nItems:\n${itemsList}\n\nTotal: ₹${pricing.total}`;
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id: CHAT_ID,
      text: message,
    });
  } catch (err) {
    console.error("Telegram error:", err.message);
  }
};

// Send new booking alert
const sendBookingAlert = async (bookingData) => {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_GROUP_ID;

  const { name, mobile, email, serviceName, preferredDate, preferredTime, consultationType, _id } = bookingData;

  const formattedDate = new Date(preferredDate).toLocaleDateString('en-IN');

  const message = `📅 NEW BOOKING RECEIVED!\n\nBooking ID: ${_id}\nService: ${serviceName}\n\nCustomer: ${name}\nPhone: ${mobile}\n${email ? `Email: ${email}\n` : ''}Preferred Date: ${formattedDate}\nPreferred Time: ${preferredTime}\nConsultation: ${consultationType}`;
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id: CHAT_ID,
      text: message,
    });
  } catch (err) {
    console.error("Telegram error:", err.message);
  }
};

// Send order cancellation alert
const sendOrderCancellationAlert = async (orderId, customerName, reason) => {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_GROUP_ID;

  const message = `❌ ORDER CANCELLED\n\nOrder ID: ${orderId}\nCustomer: ${customerName}\nReason: ${reason}`;
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id: CHAT_ID,
      text: message,
    });
  } catch (err) {
    console.error("Telegram error:", err.message);
  }
};

// Send booking cancellation alert
const sendBookingCancellationAlert = async (bookingId, customerName, reason) => {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_GROUP_ID;

  const message = `❌ BOOKING CANCELLED\n\nBooking ID: ${bookingId}\nCustomer: ${customerName}\nReason: ${reason}`;
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id: CHAT_ID,
      text: message,
    });
  } catch (err) {
    console.error("Telegram error:", err.message);
  }
};

module.exports = {
  sendLoginAlert,
  sendSignupAlert,
  sendGoogleSignupAlert,
  sendOrderAlert,
  sendBookingAlert,
  sendOrderCancellationAlert,
  sendBookingCancellationAlert
};
