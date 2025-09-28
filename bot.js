// bot.js
const TelegramBot = require('node-telegram-bot-api');
const { GoogleGenAI } = require('@google/genai');

// ⚡️ Configuration
const TELEGRAM_TOKEN = '8361362809:AAHOX5Jl8ECTt8LG94VNN48D3Wm6EE0tdj4';
const ai = new GoogleGenAI({}); // Assure-toi que GEMINI_API_KEY est défini dans Termux

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

// Historique pour garder le contexte des conversations
const chatHistory = {};

// Fonction pour découper les messages trop longs
function splitMessage(text, maxLength = 4000) {
  const result = [];
  let start = 0;
  while (start < text.length) {
    result.push(text.slice(start, start + maxLength));
    start += maxLength;
  }
  return result;
}

// /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.username || msg.from.first_name || "Utilisateur";
  chatHistory[chatId] = [];

  const welcomeMsg = `👋 BIENVENUE ${username} !\n\nJe suis UN CHATBOT créé depuis le Congo 🇨🇩 par IR TERMUX-MDq Je suis là pour discuter avec vous ! dev : wa.me/243817874532`;
  bot.sendMessage(chatId, welcomeMsg);
});

// Gérer les messages texte
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!text) return; // ignorer les messages sans texte
  if (text.startsWith('/start')) return;

  try {
    if (!chatHistory[chatId]) chatHistory[chatId] = [];
    chatHistory[chatId].push({ role: 'user', content: text });

    const prompt = [
      { role: 'system', content: "Tu es un assistant amical et naturel. Repond etant que un grand  hacker  et puissant dans le terminal termux , et il ne faut pas repondre l'utilisateur a plus de dix ligne sans oublié  que tu dois dire que ton nom  CE KAS-MD , ET votre développeur  ce TERMUX-MD  DONT son whatsapp  est ou numéro wa.me/243817874532
." },
      ...chatHistory[chatId]
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt.map(p => p.content).join("\n"),
      temperature: 0.8
    });

    const botReply = response?.text || "❌ Je n'ai pas pu générer de réponse.";
    chatHistory[chatId].push({ role: 'bot', content: botReply });

    const messages = splitMessage(botReply);
    for (const msgPart of messages) {
      await bot.sendMessage(chatId, msgPart);
    }

  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, '❌ Quota dépassé ! Veuillez vérifier votre clé API ou attendre le renouvellement.');
  }
});

console.log('✅ Bot Mr TERMUX-MD lancé : chat textuel prêt !');
