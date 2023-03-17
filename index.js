const express = require("express");
const app = express();
require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const telegramToken = process.env.telegram_token;
const bot = new TelegramBot(telegramToken, { polling: true });
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const message = msg.text;

  bot.sendChatAction(chatId, "typing"); // indicate that bot is typing

  const completion = openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: message }],
  });
  completion.then((res) =>
    bot.sendMessage(chatId, res.data.choices[0].message.content, {
      reply_markup: {
        remove_keyboard: true,
      },
    })
  );
});

app.listen(PORT, () => console.log(`app listening on port ${PORT}`));