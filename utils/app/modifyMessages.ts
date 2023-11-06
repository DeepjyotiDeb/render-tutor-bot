import { Message } from '../../types/chat';

type Props = {
  messages: Message[];
  gptMessage: Message[];
};

export const modifyMessages = ({
  messages,
  gptMessage,
}: Props): Message[] | false => {
  if (!gptMessage.length) return false;
  // // console.log('before loop', JSON.stringify(messages));
  let message = structuredClone(messages);
  let lastIndex = -1;
  for (let i = message.length - 1; i >= 0; i--) {
    const item = message[i];
    if (
      item.role === 'assistant' &&
      item.content.includes('<div className="que">')
    ) {
      lastIndex = i;
      break;
    }
  }

  // Replace all occurrences except the last one
  for (let i = 0; i < message.length; i++) {
    const item = message[i];
    if (
      i !== lastIndex &&
      item.role === 'assistant' &&
      item.content.includes('<div className="que">')
    ) {
      // // console.log('gpt content', i, message);
      // // console.log('gpt content', gptMessage[i].content);
      const modifiedContent = gptMessage[i].content;
      item.content = modifiedContent;
    }
  }
  // // console.log('after loop', JSON.stringify(messages));
  return message;
};
