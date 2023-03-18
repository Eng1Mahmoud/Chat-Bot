const express = require("express");
const app = express();
require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const PORT = process.env.PORT;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const telegramToken = process.env.telegram_token;
const bot = new TelegramBot(telegramToken, { polling: true });
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

bot.on("message", async (msg) => {
  const message = msg.text;

  bot.sendChatAction(msg.from.id, "typing");
  const completion = openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: message }],
  });

  completion.then((res) => {
    bot.sendMessage(msg.chat.id, res.data.choices[0].message.content, {
      reply_markup: {
        remove_keyboard: true,
      },
    });
    bot.sendMessage(
      process.env.adminId,
      `رسالة من \n${msg.from.first_name} \n username is ${msg.from.username}\n message is ${msg.text}`
    );
  });
});

app.listen(PORT, () => console.log(`app listening on port ${PORT}`));
