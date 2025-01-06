const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
require('dotenv').config();

// Bot and Backend Config
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const backendUrl = process.env.BACKEND_URL;

// Start Command
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;

    // Extract user details from the Telegram message
    const user = {
        telegramId: msg.from.id,
        username: msg.from.username || 'No username',
        firstName: msg.from.first_name || 'No first name',
        lastName: msg.from.last_name || 'No last name',
        languageCode: msg.from.language_code || 'No language code',
        points: 0, // Initialize points to 0
        avatarURL: "", // Will be updated after fetching profile picture
    };

    try {
        // Fetch User's Profile Photos
        const photos = await bot.getUserProfilePhotos(msg.from.id);
        if (photos.total_count > 0) {
            // Get the file ID of the first profile picture
            const fileId = photos.photos[0][0].file_id;
            const file = await bot.getFile(fileId);
            user.avatarURL = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;
        }

        // Send user data to the backend
        const response = await axios.post(`${backendUrl}/user`, user);
        if (response.status === 201) {
            bot.sendMessage(
                chatId,
                `Welcome, ${user.firstName}!\nYour data has been successfully saved. Access your mini-app here:\nhttps://test-7-front.vercel.app`
            );
        }
    } catch (error) {
        if (error.response && error.response.status === 400) {
            bot.sendMessage(chatId, 'You are already registered. Access your mini-app here:\nhttps://test-7-front.vercel.app');
        } else {
            bot.sendMessage(chatId, 'Something went wrong. Please try again later.');
        }
    }
});