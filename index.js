const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// Bot and Backend Config
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const backendUrl = process.env.BACKEND_URL;

// Start Command
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;

    const user = {
        telegramId: msg.from.id,
        username: msg.from.username || 'No username',
        firstName: msg.from.first_name || 'No first name',
        lastName: msg.from.last_name || 'No last name',
        languageCode: msg.from.language_code || 'No language code',
        points: 0,
    };

    // Generate token
    const token = uuidv4();

    // Store token with telegramId in backend
    try {
        await axios.post(`${backendUrl}/auth/generate-token`, {
            token,
            telegramId: user.telegramId,
        });

        // Create frontend URL with token
        const frontendUrl = `https://test-7-front.vercel.app/auth?token=${token}`;

        // Send an Inline Keyboard Button with the WebApp link
        await bot.sendMessage(chatId, `Welcome, ${user.firstName}! Tap the button below to open Quackarz in full screen.`, {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "🚀 Open Quackarz",
                            web_app: { url: frontendUrl }, // Opens in full-screen
                        },
                    ],
                ],
            },
        });
    } catch (error) {
        console.error("Error generating token or communicating with backend:", error);
        bot.sendMessage(chatId, 'Something went wrong. Please try again later.');
    }
});