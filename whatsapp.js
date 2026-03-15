import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
// const { Client, NoAuth } = require('whatsapp-web.js');
// const qrcode = require('qrcode-terminal');

// Create a new client instance
const whatsappClient = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }
});

// When the client is ready, run this code (only once)
whatsappClient.once('ready', () => {
    console.log('Client is ready!');
});

// When the client received QR-Code
whatsappClient.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
});

// Listening to all incoming messages
whatsappClient.on('message_create', message => {
	console.log(message.body); // message.body message.from
});




export {whatsappClient}