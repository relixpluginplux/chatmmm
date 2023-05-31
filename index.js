/*
Auther: Harshit Sharma
Nick name: harshitethic
Github: https://github.com/harshitethic
Node req: 16+
Website: harshitethic
MIT LICENSED
*/

// index.js

// Import required libraries
const fs = require('fs');
const https = require('https');
const { Configuration, OpenAIApi } = require("openai");
const TelegramBot = require('node-telegram-bot-api');

// Load environment variables
require('dotenv').config();

// Initialize OpenAI API
const configuration = new Configuration({
    apiKey: process.env.API_KEY_GPT,
});
const gpt = new OpenAIApi(configuration);

// Initialize Telegram Bot API
const bot = new TelegramBot(process.env.API_KEY_BOT, { polling: true });

// Counter for incoming requests
let requestCount = 0;

const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Hello, world!');
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});


const handleText = async (msg) => {
    requestCount++;
    console.log(`Request ${requestCount}: ${msg.text}`);

    const chatId = msg.chat.id;
    const userMessage = msg.text;

    if (userMessage === '/start') {
        await bot.sendMessage(chatId, `✨Hola!, ${msg.from.first_name}!✨`);
        await bot.sendMessage(chatId, `Soy Robotina GPT tu asistente personal`);
        console.log(`Request ${requestCount} completed!`);
        return;
    }
    
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;

  if (messageText === '/ayuda') {
    bot.sendMessage(chatId, 'Estos son los comandos disponibles:\n/start - Saluda al bot\n/img <texto> - Genera una imagen basada en el texto\n/ayuda - Muestra esta lista de comandos');
  }
});

    if (userMessage.startsWith('/img')) {
        await handleImageCommand(chatId, userMessage.slice(5));
        return;
    }
    
  

    await handleTextQuery(chatId, userMessage);
};

const handleImageCommand = async (chatId, promptText) => {
    const waitMessage = await bot.sendMessage(chatId, 'Un segundo estoy en ello...💡');

    if (promptText === '') {
        bot.sendMessage(chatId, 'Si desea obtener una imagen, ingrese la descripción después /img 👉🏻Ejemplo /img robot');
        bot.deleteMessage(chatId, waitMessage.message_id);
        return;
    }

    try {
        const completion = await gpt.createImage({
            prompt: promptText,
            n: 1,
            size: "1024x1024",
        });

        await bot.sendPhoto(chatId, completion.data.data[0].url);
        await bot.deleteMessage(chatId, waitMessage.message_id);
        console.log(`Request ${requestCount}: Completed!`);
    } catch (error) {
        await bot.sendMessage(chatId, 'Prueba con otra consulta 😊');
        await bot.deleteMessage(chatId, waitMessage.message_id);
        console.log(`Request ${requestCount}: Not completed!`);
    }
};

const handleTextQuery = async (chatId, userMessage) => {
    const waitMessage = await bot.sendMessage(chatId, 'Escribiendo...');

    try {
        const completion = await gpt.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: userMessage }],
        });

        await bot.sendMessage(chatId, completion.data.choices[0].message.content);
        await bot.deleteMessage(chatId, waitMessage.message_id);
        console.log(`Request ${requestCount}: Completed!`);
    } catch (error) {
        await bot.sendMessage(chatId, 'Prueba con otra palabra 😊');
        await bot.deleteMessage(chatId, waitMessage.message_id);
        console.log(`Request ${requestCount}: Not completed!`);
    }
};

// Event listeners
bot.on('text', handleText);
bot.on('photo', async (image) => {
    requestCount++;

    // Inform the user that the bot doesn't support images
    await bot.sendMessage(image.chat.id, "We don't support images.");
});

bot.on('voice', async (voice) => {
    // Inform the user that the functionality is under development
    await bot.sendMessage(voice.chat.id, 'This feature is under development.');

    /*
    The following commented code is for future implementation:

    const voiceFileId = voice.voice.file_id;
    const voiceFileLink = await bot.getFileLink(voiceFileId);
    const voiceFile = await fs.createWriteStream(`voices/2.ogg`);
    const voiceWriteFile = await https.get(voiceFileLink, response => {
        response.pipe(voiceFile);
    });

    const translate = await gpt.createTranslation(
        fs.createReadStream(`voices/2.mp3`),
        'whisper-1'
    );

    //console.log(translate.data.text);
    console.log(translate);
    */
});

// Handle polling errors
bot.on("polling_error", (err) => console.log(err.data.error.message));
