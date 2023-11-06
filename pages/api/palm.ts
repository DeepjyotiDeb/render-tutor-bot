import { NextApiRequest, NextApiResponse } from 'next';

import {
  DEFAULT_SYSTEM_PROMPT,
  DEFAULT_TEMPERATURE,
} from '../../utils/app/const';
import { PalmError, PalmRes } from '../../utils/server/palm';

import { ChatBody, Message } from '../../types/chat';
import { Plugins } from '../../types/plugin';

// export const config = {
//   runtime: 'edge',
// };

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // // console.log('req', typeof req, req.body);
  try {
    const { messages, key, prompt, temperature } = req.body as any;
    let model = {
      id: Plugins['models/chat-bison-001'].id,
      name: Plugins['models/chat-bison-001'].name,
      maxLength: 1024,
      candidateCount: 1,
      tokenLimit: 3000,
    };
    let promptToSend = prompt;
    if (!promptToSend) {
      promptToSend = DEFAULT_SYSTEM_PROMPT;
    }
    let temperatureToUse = temperature;
    if (temperatureToUse == null) {
      temperatureToUse = DEFAULT_TEMPERATURE;
    }
    let tokenCount = 1024;
    let messagesToSend: Message[] = [];
    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i];
      const tokens = message.content;

      if (tokenCount + tokens.length + 1000 > model.tokenLimit) {
        break;
      }
      tokenCount += tokens.length;
      messagesToSend = [message, ...messagesToSend];
    }

    const response = await PalmRes(
      model,
      promptToSend,
      temperature,
      key,
      messagesToSend,
    );
    // // console.log('response from service', response);
    return res.status(200).json({ answer: response });
    // return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    // console.log(error);
    return res.status(500).json(error);
    // if (error instanceof PalmError) {
    //   return new Response('Error', {
    //     statusText: error.message,
    //     status: 500,
    //   });
    // } else {
    // }
  }
};

export default handler;
