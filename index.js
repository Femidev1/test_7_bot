const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();

// Bot Config
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const frontendUrl = "https://test-7-frontdev.vercel.app";

// Start Command
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;

  await bot.sendMessage(
    chatId,
    `Welcome, ${msg.from.first_name}! 🐥

    How quickly can you conquer the galaxy?

    Tap to fuel your ship, mine tokens, and upgrade your engines.

    Boost your passive income, strategize your growth, and rule the multiverse!

    Your efforts won’t go unnoticed—big things are coming! 🚀

    Don’t forget your crew—invite friends and earn even more together!

    Let the cosmic mining begin! 🌠💎`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🚀 Play Quackarz",
              web_app: { url: frontendUrl }, // No token needed anymore!
            },
          ],
        ],
      },
    }
  );
});