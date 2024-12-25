const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
require('dotenv').config();
const express = require('express');

const app = express();
app.use(express.json()); // Middleware to parse incoming JSON requests

// Bot Configuration
const bot = new TelegramBot(process.env.BOT_TOKEN, { webHook: true });
const backendUrl = process.env.BACKEND_URL;

// Set Webhook
const webhookUrl = `${process.env.VERCEL_URL}/webhook/${process.env.BOT_TOKEN}`;
bot.setWebHook(webhookUrl);

// Handle Incoming Updates from Telegram
app.post(`/webhook/${process.env.BOT_TOKEN}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

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
    };

    // Send user data to the backend
    try {
        const response = await axios.post(`${backendUrl}/user`, user);
        if (response.status === 201) {
            bot.sendMessage(
                chatId,
                `Welcome, ${user.firstName}!\nYour data has been successfully saved. Access your mini-app here:\nhttps://your-mini-app-url`
            );
        }
    } catch (error) {
        if (error.response && error.response.status === 400) {
            bot.sendMessage(chatId, 'You are already registered. Access your mini-app here:\nhttps://your-mini-app-url');
        } else {
            bot.sendMessage(chatId, 'Something went wrong. Please try again later.');
        }
    }
});

// Vercel serverless function export
module.exports = app;