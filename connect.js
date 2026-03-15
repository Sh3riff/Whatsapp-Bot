import express from 'express'
import WhatsAppWebJS from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';


//////////////////////////////////// Whatsapp Start ////////////////////////////////////
const { Client, LocalAuth, MessageMedia } = WhatsAppWebJS

// '234---@c.us'
// Test -> '120363406631777031@g.us'
// Andela -> '120363423469754064@g.us'
// Dames -> '120363384212947395@g.us'
//

const whatsappClient = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
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
  // console.log(message); // message.body message.from
});


//////////////////////////////////// Whatsapp End ////////////////////////////////////


const app = express()
const port = 8088

// Middleware to parse JSON request bodies
app.use(express.json())

app.get('/', (req, res) => {
  res.send('WhatsApp Bot API is running.')
})

app.post('/messages', async (req, res) => {
  const {recipient, message} = req.body || {}

  const resp = await whatsappClient.sendMessage(recipient, message)

 res.json({messageId: resp?.id?.id})
})


app.post('/picture', async (req, res) => {
  const {recipient, caption = "", base64Image} = req.body || {}
  const formattedImage = base64Image.replace(/^data:image\/[a-z]+;base64,/, "")
  
  const media = new MessageMedia('image/png', formattedImage);
  const message = await whatsappClient.sendMessage(recipient, media, { caption  });

  res.json({messageId: message?.id?.id})

  // const media = MessageMedia.fromFilePath('./path/to/image.png');
  // const media = await MessageMedia.fromUrl('');
})

app.get('/groups', async (req, res) => {
  const response = await whatsappClient.getCommonGroups('264733311684801@lid');

  res.json(response)
  
})


app.listen(port, async () => {
  console.log(`Express app listening on port ${port}`)
  console.log('Starting Whatsapp Bot...')
  try {
    whatsappClient.initialize();
  } catch (err) {
    console.error('Failed to start Whatsapp bot:', err)
  }
})