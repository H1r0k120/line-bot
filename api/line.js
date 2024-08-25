import { Client, middleware } from '@line/bot-sdk';
import { NowRequest, NowResponse } from '@vercel/node';

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const client = new Client(config);

export default async function handler(req: NowRequest, res: NowResponse) {
  if (req.method === 'POST') {
    const events = req.body.events;
    try {
      await Promise.all(events.map(handleEvent));
      res.status(200).send('OK');
    } catch (err) {
      console.error(err);
      res.status(500).send('Error');
    }
  } else {
    res.status(405).send('Method Not Allowed');
  }
}

async function handleEvent(event) {
  if (event.type === 'message' && event.message.type === 'text') {
    await client.replyMessage(event.replyToken, {
      type: 'text',
      text: `あなたが送ったメッセージ: ${event.message.text}`,
    });
  }
}
