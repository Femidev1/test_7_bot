const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();

// Bot Config
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const frontendUrl = "https://test-7-front.vercel.app";

// Start Command
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;

  await bot.sendMessage(
    chatId,
    `Welcome, ${msg.from.first_name}! Tap the button below to open Quackarz in full screen.`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🚀 Open Quackarz",
              web_app: { url: frontendUrl }, // No token needed anymore!
            },
          ],
        ],
      },
    }
  );
});