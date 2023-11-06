import { MutableRefObject } from 'react';

import { Message } from '../../types/chat';

type Props = Message | string;

export const logResponse = async (
  message: Props,
  sender = 'bot',
  messageCount: MutableRefObject<number>,
  context = '',
) => {
  const sendLog = async (message: any, sender: string) => {
    const sessionid = sessionStorage.getItem('session_id');
    const promptId = sessionStorage.getItem('promptId');
    // // console.log('logs sent', { sender, count: messageCount.current });
    // if (sender === 'bot' && message?.role === 'user') return false;
    const currentDate = new Date();
    const sentObj = {
      sessionid: sessionid ?? 'id-not-created',
      messagenumber: messageCount.current,
      promptid: promptId ?? 'not-found',
      message,
      actor: sender,
      context,
      timestampid: currentDate.toISOString(),
    };
    const res = await fetch('api/log-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...sentObj }),
    });
    return res;
    // return null;
  };

  try {
    // // console.log('message', message);
    if (typeof message === 'object') {
      // // console.log('user message', message);
      const res = await sendLog(message.content, 'user');
      // // console.log('res from user msg log', await res.json());
    }
    if (sender.includes('bot')) {
      // // console.log('bot', message);
      const res = await sendLog(message, sender);
      // // console.log('res from bot msg log', await res.json());
    }
    if (sender.includes('api')) {
      // // console.log('api', message);
      const res = await sendLog(message, sender);
      // // console.log('res from api msg log', await res.json());
    }
  } catch (error) {
    // console.log('error sending log', error);
  }
};

// const sleep = (ms: number) => {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// };
