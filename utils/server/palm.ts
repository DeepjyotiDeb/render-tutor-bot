import { Message } from '../../types/chat';
import { PalmModel, PalmModelID } from '../../types/palm';

import { DiscussServiceClient } from '@google-ai/generativelanguage';
import { GoogleAuth } from 'google-auth-library';
import { JSONClient } from 'google-auth-library/build/src/auth/googleauth';

export class PalmError extends Error {
  type: string;
  param: string;
  code: string;

  constructor(message: string, type: string, param: string, code: string) {
    super(message);
    this.name = 'PalmAIError';
    this.type = type;
    this.param = param;
    this.code = code;
  }
}

export const PalmRes = async (
  model: PalmModel,
  systemPrompt: string,
  temperature: number,
  key: string,
  message: Message[],
) => {
  // console.log('message', message);
  const newRes = await fetch(
    'https://zginkt8293.execute-api.ap-south-1.amazonaws.com/dev/generate',
    {
      method: 'POST',
      body: JSON.stringify({
        prompt: {
          context: '',
          messages: [{ content: message[0].content }],
        },
      }),
    },
  );
  // console.log('new res', await newRes.json());
  const client = new DiscussServiceClient({
    authClient: new GoogleAuth().fromAPIKey(
      process.env.PALM_API_KEY as string,
    ) as any,
  });
  // // console.log('model', model);
  try {
    const result = await client.generateMessage({
      model: 'models/chat-bison-001',
      temperature,
      candidateCount: 1,
      prompt: {
        context: '',
        messages: message,
      },
    });
    // // console.log('result', JSON.stringify(result));
    return result[0]?.candidates?.[0]?.content ?? null;
    // return result
  } catch (error) {
    // console.log(error);
    throw new Error('error');
  }
};
