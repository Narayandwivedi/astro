const axios = require('axios');

/**
 * Send Telegram notification to configured group
 * @param {string} message - The message to send
 * @returns {Promise<void>}
 */
const sendTelegramNotification = async (message) => {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_GROUP_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    console.log('Telegram credentials not configured. Skipping notification.');
    return;
  }

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id: CHAT_ID,
      text: message,
      parse_mode: 'HTML'
    });
  } catch (err) {
    console.error('Telegram notification error:', err.message);
  }
};

/**
 * Send user login alert
 * @param {string} userName - User's full name
 * @param {string} loginMethod - Login method (email/mobile)
 */
const sendLoginAlert = async (userName, loginMethod = 'email') => {
  const message = `🔐 <b>NEW LOGIN</b>\n\nUser: ${userName}\nMethod: ${loginMethod}\nTime: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`;
  await sendTelegramNotification(message);
};

/**
 * Send user signup alert
 * @param {string} userName - User's full name
 * @param {string} email - User's email
 */
const sendSignupAlert = async (userName, email) => {
  const message = `🎉 <b>NEW USER SIGNUP</b>\n\nName: ${userName}\nEmail: ${email}\nTime: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`;
  await sendTelegramNotification(message);
};

/**
 * Send Google signup alert
 * @param {string} userName - User's full name
 * @param {string} email - User's email
 */
const sendGoogleSignupAlert = async (userName, email) => {
  const message = `🔐 <b>NEW GOOGLE SIGNUP</b>\n\nName: ${userName}\nEmail: ${email}\nTime: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`;
  await sendTelegramNotification(message);
};

/**
 * Send new order alert
 * @param {object} orderData - Order details
 */
const sendOrderAlert = async (orderData) => {
  const { customer, items, pricing, _id } = orderData;

  const itemsList = items.map(item =>
    `• ${item.productName} (Qty: ${item.quantity}) - ₹${item.totalPrice}`
  ).join('\n');

  const message = `🛍️ <b>NEW ORDER RECEIVED</b>\n\nOrder ID: ${_id}\nCustomer: ${customer.name}\nPhone: ${customer.phone}\nEmail: ${customer.email}\n\nItems:\n${itemsList}\n\n<b>Total: ₹${pricing.total}</b>\n\nTime: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`;

  await sendTelegramNotification(message);
};

/**
 * Send new booking alert
 * @param {object} bookingData - Booking details
 */
const sendBookingAlert = async (bookingData) => {
  const { name, mobile, email, serviceName, preferredDate, preferredTime, consultationType, _id } = bookingData;

  const formattedDate = new Date(preferredDate).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Kolkata'
  });

  const message = `📅 <b>NEW BOOKING RECEIVED</b>\n\nBooking ID: ${_id}\nService: ${serviceName}\n\nCustomer: ${name}\nPhone: ${mobile}\n${email ? `Email: ${email}\n` : ''}\nPreferred Date: ${formattedDate}\nPreferred Time: ${preferredTime}\nConsultation: ${consultationType}\n\nTime: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`;

  await sendTelegramNotification(message);
};

/**
 * Send order cancellation alert
 * @param {string} orderId - Order ID
 * @param {string} customerName - Customer name
 * @param {string} reason - Cancellation reason
 */
const sendOrderCancellationAlert = async (orderId, customerName, reason) => {
  const message = `❌ <b>ORDER CANCELLED</b>\n\nOrder ID: ${orderId}\nCustomer: ${customerName}\nReason: ${reason}\n\nTime: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`;
  await sendTelegramNotification(message);
};

/**
 * Send booking cancellation alert
 * @param {string} bookingId - Booking ID
 * @param {string} customerName - Customer name
 * @param {string} reason - Cancellation reason
 */
const sendBookingCancellationAlert = async (bookingId, customerName, reason) => {
  const message = `❌ <b>BOOKING CANCELLED</b>\n\nBooking ID: ${bookingId}\nCustomer: ${customerName}\nReason: ${reason}\n\nTime: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`;
  await sendTelegramNotification(message);
};

module.exports = {
  sendTelegramNotification,
  sendLoginAlert,
  sendSignupAlert,
  sendGoogleSignupAlert,
  sendOrderAlert,
  sendBookingAlert,
  sendOrderCancellationAlert,
  sendBookingCancellationAlert
};
