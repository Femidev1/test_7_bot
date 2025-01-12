/*******************************************************
 * TelegramBot-based referral system
 * 
 *  - User A shares: https://t.me/<YourBot>?start=<telegramIdOfA>
 *  - User B clicks link and gets: /start <telegramIdOfA>
 *  - Bot checks if B is new, and if so, awards both A & B 50k points
 *******************************************************/

const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();

// 1. Read your BOT_TOKEN from environment variables (.env) 
// Make sure you have BOT_TOKEN=12345678:ABC... in your .env
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// 2. The URL to your React front end (Telegram web app)
const frontendUrl = "https://test-7-frontdev.vercel.app";

/**
 * When the bot sees a message that starts with /start plus optional text,
 * we capture that text using a regex group.
 * 
 * Example link: https://t.me/<YourBot>?start=12345
 * => Telegram sends "/start 12345" => match[1] === "12345"
 */
bot.onText(/\/start ?(.*)/, async (msg, match) => {
  try {
    const chatId = msg.chat.id;               // ID of the new user
    const referralParam = match[1] || "";      // e.g. "12345"

    // If there's a referral, handle it
    if (referralParam) {
      console.log(`Referral detected! New user: ${chatId}, Referred by: ${referralParam}`);
      await handleReferral(referralParam, chatId);
    }

    // Then, send your normal welcome message 
    // (with inline keyboard that opens your web app)
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
                web_app: { url: frontendUrl },
              },
            ],
          ],
        },
      }
    );
  } catch (err) {
    console.error("Error in /start command:", err);
  }
});

/**
 * handleReferral(referrerId, newUserId):
 * 1. Check if newUserId is new to the bot
 * 2. If new, award 50k points to both referrerId and newUserId
 */
async function handleReferral(referrerId, newUserId) {
  try {
    console.log(`handleReferral -> Referrer: ${referrerId}, New User: ${newUserId}`);

    // 1. Check if the new user is new
    const userIsNew = await isNewUser(newUserId);

    // 2. If new, award points
    if (userIsNew) {
      console.log(`Awarding 50k points to referrer ${referrerId} & new user ${newUserId}.`);
      await awardPoints(referrerId, 50000);
      await awardPoints(newUserId, 50000);
    } else {
      console.log(`User ${newUserId} is NOT new. No points awarded.`);
    }
  } catch (err) {
    console.error("Error in handleReferral:", err);
  }
}

/**
 * isNewUser(telegramId):
 *  - Returns true if user does NOT exist in DB
 *  - Returns false if user already exists
 *
 * In your production code, replace with real DB logic, e.g.:
 *   const user = await db.users.findOne({ telegramId });
 *   return !user;
 */
async function isNewUser(telegramId) {
  // Simulating logic: 
  // We’ll say ID 99999999 is "old", everything else is "new".
  if (telegramId.toString() === "99999999") {
    return false; 
  }
  return true; 
}

/**
 * awardPoints(telegramId, points):
 *  - Increments a user's points by `points` in the DB
 * 
 * For production, you'd do something like:
 *   await db.users.updateOne(
 *     { telegramId },
 *     { $inc: { points } },
 *     { upsert: true } // if user doesn't exist, create them
 *   );
 */
async function awardPoints(telegramId, points) {
  console.log(`Awarded ${points} points to Telegram ID: ${telegramId}.`);
}

// (Optionally export bot if used elsewhere)
module.exports = bot;