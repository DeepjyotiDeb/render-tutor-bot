import {
  IconArrowLeft,
  IconArrowRight,
  IconChevronLeft,
  IconX,
} from '@tabler/icons-react';
import {
  MutableRefObject,
  memo,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import toast from 'react-hot-toast';

import { useTranslation } from 'next-i18next';
import { STIX_Two_Text } from 'next/font/google';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { generateQuestionPrompt } from '../../utils/app/generateQuestionPrompt';
import { logResponse } from '../../utils/app/logResponse';
import { modifyMessages } from '../../utils/app/modifyMessages';
import { parseText } from '../../utils/app/parseText';
import { questionArray } from '../../utils/app/questionArray';
import { useFormattedDate } from '../../utils/app/useFormattedDate';
import { getEndpoint } from '@/utils/app/api';
// import { PromptList } from '@/utils/app/const';
import {
  // saveConversation,
  // saveConversations,
  updateConversation,
} from '@/utils/app/conversation';
import { throttle } from '@/utils/data/throttle';

import { ChatBody, Conversation, Message } from '@/types/chat';
import { Plugin } from '@/types/plugin';

import HomeContext from '@/pages/api/home/home.context';

// import cloudImage from '../../public/images/Graphics.png';
// import RobotImage from '../../public/images/SavvyMax.png';
import { QuestionCards } from '../Questions/QuestionCard/QuestionCards';
import { QuestionList, QuestionListRef } from '../Questions/QuestionList';
import { ScoreCard } from '../Score/ScoreCard';
import Spinner from '../Spinner';
import { ChatInput } from './ChatInput';
import { ChatLoader } from './ChatLoader';
import { ErrorMessageDiv } from './ErrorMessageDiv';
import { MemoizedChatMessage } from './MemoizedChatMessage';
import { ModelSelect } from './ModelSelect';

import { v4 as uuid } from 'uuid';

interface Props {
  stopConversationRef: MutableRefObject<boolean>;
}

const inter = STIX_Two_Text({ subsets: ['latin'] });

export const Chat = memo(({ stopConversationRef }: Props) => {
  const { t } = useTranslation('chat');

  const {
    state: {
      selectedConversation,
      conversations,
      models,
      apiKey,
      pluginKeys,
      serverSideApiKeyIsSet,
      gptMessages,
      messageIsStreaming,
      modelError,
      loading,
      prompts,
      promptContent,
      startConvo,
      defaultModelId,
      questionList,
      inputCorrect,
      questionNumber,
      scoreList,
    },
    handleUpdateConversation,
    dispatch: homeDispatch,
  } = useContext(HomeContext);
  const { query, isReady } = useRouter();

  const [currentMessage, setCurrentMessage] = useState<Message>();
  const [newChunk, setNewChunk] = useState<string>('');
  // const [questionNumber, setQuestionNumber] = useState<number>(0);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState<boolean>(true);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showScrollDownButton, setShowScrollDownButton] =
    useState<boolean>(false);
  const [expand, setExpand] = useState<string>('');
  // const initialScore: string[] = Array(9).fill('unanswered');
  // const [score, setScore] = useState(initialScore);
  const [correctAnimation, setCorrectAnimation] = useState<boolean>(false);
  const [cardType, setCardType] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messageCount = useRef<number>(0);

  const questionListRef = useRef<QuestionListRef | null>(null);

  const formattedDate = useFormattedDate();
  // const [sessionId, setSessionId] = useState('');
  // const [queryPrompt, setQueryPrompt] = useState<string>('');

  useEffect(() => {
    createSessionId();
    // const timer = setTimeout(startChat, 1000);
    // return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isReady) {
      saveQueryPrompt(query?.promptId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  function createSessionId() {
    const existingSessionId = sessionStorage.getItem('session_id');
    if (!existingSessionId) {
      const newSessionId = uuid();
      // Store the new session ID in sessionStorage
      sessionStorage.setItem('session_id', newSessionId);
    }
  }

  function saveQueryPrompt(promptId: string | string[] | undefined) {
    if (typeof promptId === 'string') {
      const existingPromptId = sessionStorage.getItem('promptId');
      if (!existingPromptId) {
        sessionStorage.setItem('promptId', promptId);
      }
    }
  }

  // async function startChat() {
  //   let message: Message = { role: 'user', content: 'hi' };
  //   let plugin = null,
  //     deleteCount = 0;
  //   if (!startConvo) {
  //     if (selectedConversation) {
  //       let updatedConversation: Conversation;
  //       if (deleteCount) {
  //         const updatedMessages = [...selectedConversation.messages];
  //         for (let i = 0; i < deleteCount; i++) {
  //           updatedMessages.pop();
  //         }
  //         updatedConversation = {
  //           ...selectedConversation,
  //           messages: [...updatedMessages, message],
  //         };
  //       } else {
  //         updatedConversation = {
  //           ...selectedConversation,
  //           messages: [...selectedConversation.messages],
  //         };
  //       }
  //       // // console.log('selectedConversaton', selectedConversation.prompt);
  //       homeDispatch({ field: 'loading', value: true });
  //       homeDispatch({ field: 'messageIsStreaming', value: true });
  //       const chatBody: ChatBody = {
  //         model: selectedConversation.model,
  //         messages: [{ role: 'user', content: '' }],
  //         key: apiKey,
  //         prompt: selectedConversation.prompt,
  //         temperature: 0.25,
  //       };
  //       // // console.log('chat body: ', chatBody);
  //       const endpoint = getEndpoint(plugin);
  //       let body;
  //       if (!plugin) {
  //         body = JSON.stringify(chatBody);
  //       } else {
  //         body = JSON.stringify({
  //           ...chatBody,
  //           googleAPIKey: pluginKeys
  //             .find((key) => key.pluginId === 'google-search')
  //             ?.requiredKeys.find((key) => key.key === 'GOOGLE_API_KEY')?.value,
  //           googleCSEId: pluginKeys
  //             .find((key) => key.pluginId === 'google-search')
  //             ?.requiredKeys.find((key) => key.key === 'GOOGLE_CSE_ID')?.value,
  //         });
  //       }
  //       messageCount.current += 1;
  //       logResponse({ role: 'user', content: '' }, 'user', messageCount);
  //       const controller = new AbortController();
  //       const response = await fetch(endpoint, {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         signal: controller.signal,
  //         body,
  //       });
  //       if (!response.ok) {
  //         homeDispatch({ field: 'loading', value: false });
  //         homeDispatch({ field: 'messageIsStreaming', value: false });
  //         toast.error(response.statusText);
  //         return;
  //       }
  //       const data = response.body;
  //       if (!data) {
  //         homeDispatch({ field: 'loading', value: false });
  //         homeDispatch({ field: 'messageIsStreaming', value: false });
  //         return;
  //       }
  //       if (!plugin) {
  //         if (updatedConversation.messages.length === 1) {
  //           const { content } = message;
  //           const customName =
  //             content.length > 30 ? content.substring(0, 30) + '...' : content;
  //           updatedConversation = {
  //             ...updatedConversation,
  //             name: customName,
  //           };
  //         }
  //         homeDispatch({ field: 'loading', value: false });
  //         const reader = data.getReader();
  //         const decoder = new TextDecoder();
  //         let done = false;
  //         let isFirst = true;
  //         let text = '';
  //         while (!done) {
  //           if (stopConversationRef.current === true) {
  //             controller.abort();
  //             done = true;
  //             break;
  //           }
  //           const { value, done: doneReading } = await reader.read();
  //           done = doneReading;
  //           const chunkValue = decoder.decode(value);
  // // console.log('chunk value', chunkValue);
  //           text += chunkValue;
  //           if (isFirst) {
  //             isFirst = false;
  //             const updatedMessages: Message[] = [
  //               ...selectedConversation.messages,
  //               { role: 'assistant', content: chunkValue },
  //             ];
  //             updatedConversation = {
  //               ...updatedConversation,
  //               messages: updatedMessages,
  //             };
  //             homeDispatch({
  //               field: 'selectedConversation',
  //               value: updatedConversation,
  //             });
  //           } else {
  //             const updatedMessages: Message[] =
  //               updatedConversation.messages.map((message, index) => {
  //                 if (index === updatedConversation.messages.length - 1) {
  //                   return {
  //                     ...message,
  //                     content: text,
  //                   };
  //                 }
  //                 return message;
  //               });
  //             updatedConversation = {
  //               ...updatedConversation,
  //               messages: updatedMessages,
  //             };
  //             homeDispatch({
  //               field: 'selectedConversation',
  //               value: updatedConversation,
  //             });
  //           }
  //           if (done) {
  //             messageCount.current += 1;
  //             logResponse(text, 'bot', messageCount);
  //             const newText = await parseText(text, messageCount);
  //             const originalMessage = [
  //               ...gptMessages,
  //               { role: 'assistant', message: text },
  //             ];
  //             homeDispatch({ field: 'gptMessages', value: originalMessage });
  //             if (typeof newText === 'string') {
  //               // // console.log('new text: ', newText);
  //               const updatedMessages: Message[] =
  //                 updatedConversation.messages.map((message, index) => {
  //                   if (index === updatedConversation.messages.length - 1) {
  //                     return {
  //                       ...message,
  //                       content: newText,
  //                     };
  //                   }
  //                   return message;
  //                 });
  //               updatedConversation = {
  //                 ...updatedConversation,
  //                 messages: updatedMessages,
  //               };
  //               homeDispatch({
  //                 field: 'selectedConversation',
  //                 value: updatedConversation,
  //               });
  //             }
  //           }
  //         }
  //         // saveConversation(updatedConversation);
  //         const updatedConversations: Conversation[] = conversations.map(
  //           (conversation) => {
  //             if (conversation.id === selectedConversation.id) {
  //               return updatedConversation;
  //             }
  //             return conversation;
  //           },
  //         );
  //         if (updatedConversations.length === 0) {
  //           updatedConversations.push(updatedConversation);
  //         }
  //         homeDispatch({
  //           field: 'conversations',
  //           value: updatedConversations,
  //         });
  //         // saveConversations(updatedConversations);
  //         homeDispatch({ field: 'messageIsStreaming', value: false });
  //       } else {
  //         const { answer } = await response.json();
  //         const updatedMessages: Message[] = [
  //           ...updatedConversation.messages,
  //           { role: 'assistant', content: answer },
  //         ];
  //         updatedConversation = {
  //           ...updatedConversation,
  //           messages: updatedMessages,
  //         };
  //         homeDispatch({
  //           field: 'selectedConversation',
  //           value: updateConversation,
  //         });
  //         // saveConversation(updatedConversation);
  //         const updatedConversations: Conversation[] = conversations.map(
  //           (conversation) => {
  //             if (conversation.id === selectedConversation.id) {
  //               return updatedConversation;
  //             }
  //             return conversation;
  //           },
  //         );
  //         if (updatedConversations.length === 0) {
  //           updatedConversations.push(updatedConversation);
  //         }
  //         homeDispatch({
  //           field: 'conversations',
  //           value: updatedConversations,
  //         });
  //         // saveConversations(updatedConversations);
  //         homeDispatch({ field: 'loading', value: false });
  //         homeDispatch({ field: 'messageIsStreaming', value: false });
  //       }
  //     }
  //   }
  //   // homeDispatch({ field: 'startConvo', value: false });
  // }

  const handleSend = useCallback(
    async (message: Message, deleteCount = 0, plugin: Plugin | null = null) => {
      // // console.log('msg', { message, deleteCount, plugin });
      const video = document.getElementById(
        'tutorial-video',
      ) as HTMLVideoElement;
      video && video.pause();
      if (selectedConversation) {
        let updatedConversation: Conversation;
        let originalMessage: Message[];
        if (deleteCount) {
          const updatedMessages = [...selectedConversation.messages];
          for (let i = 0; i < deleteCount; i++) {
            updatedMessages.pop();
            gptMessages.pop();
          }
          updatedConversation = {
            ...selectedConversation,
            messages: [...updatedMessages, message],
          };
        } else {
          messageCount.current += 1;
          logResponse(message, 'user', messageCount);
          updatedConversation = {
            ...selectedConversation,
            messages: [...selectedConversation.messages, message],
          };
          // // console.log("Here is the updated message: ",updatedConversation.messages);
        }
        originalMessage = [
          ...gptMessages,
          { role: 'user', content: message.content },
        ];
        // // console.log('user msg: ', gptMessages);
        homeDispatch({
          field: 'selectedConversation',
          value: updatedConversation,
        });
        homeDispatch({ field: 'loading', value: true });
        homeDispatch({ field: 'messageIsStreaming', value: true });
        // // console.log('', updatedConversation);
        const modifiedMessages = modifyMessages({
          messages: updatedConversation.messages,
          gptMessage: gptMessages,
        });
        // // console.log(
        //   'modifiedMessages',
        //   modifiedMessages,
        //   updatedConversation.messages,
        // );
        // // console.log('updatedConversation', updatedConversation.prompt);
        const chatBody: ChatBody = {
          model: updatedConversation.model,
          // messages:
          //   updatedConversation.messages.length >= 4
          //     ? updatedConversation.messages.slice(-4)
          //     : updatedConversation.messages,
          messages:
            modifiedMessages === false
              ? updatedConversation.messages
              : modifiedMessages,
          // messages: modifiedMessages,
          key: apiKey,
          prompt: updatedConversation.prompt,
          // temperature: updatedConversation.temperature,
          temperature: 0.25,
        };
        const endpoint = getEndpoint(plugin);
        let body;
        if (!plugin) {
          body = JSON.stringify(chatBody);
        } else {
          body = JSON.stringify({
            ...chatBody,
            googleAPIKey: pluginKeys
              .find((key) => key.pluginId === 'google-search')
              ?.requiredKeys.find((key) => key.key === 'GOOGLE_API_KEY')?.value,
            googleCSEId: pluginKeys
              .find((key) => key.pluginId === 'google-search')
              ?.requiredKeys.find((key) => key.key === 'GOOGLE_CSE_ID')?.value,
          });
        }
        const controller = new AbortController();
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
          body,
        });
        // // console.log('response', response);
        if (!response.ok) {
          homeDispatch({ field: 'loading', value: false });
          homeDispatch({ field: 'messageIsStreaming', value: false });
          toast.error(response.statusText);
          return;
        }
        const data = response.body;
        if (!data) {
          homeDispatch({ field: 'loading', value: false });
          homeDispatch({ field: 'messageIsStreaming', value: false });
          return;
        }
        if (!plugin) {
          if (updatedConversation.messages.length === 1) {
            const { content } = message;
            const customName =
              content.length > 30 ? content.substring(0, 30) + '...' : content;
            updatedConversation = {
              ...updatedConversation,
              name: customName,
            };
          }
          homeDispatch({ field: 'loading', value: false });
          const reader = data.getReader();
          const decoder = new TextDecoder();
          let done = false;
          let isFirst = true;
          let text = '';
          while (!done) {
            if (stopConversationRef.current === true) {
              controller.abort();
              done = true;
              break;
            }
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            const chunkValue = decoder.decode(value);
            text += chunkValue;
            // // console.log('text', text);
            if (isFirst) {
              isFirst = false;
              const updatedMessages: Message[] = [
                ...updatedConversation.messages,
                { role: 'assistant', content: chunkValue },
              ];
              updatedConversation = {
                ...updatedConversation,
                messages: updatedMessages,
              };
              homeDispatch({
                field: 'selectedConversation',
                value: updatedConversation,
              });
            } else {
              const updatedMessages: Message[] =
                updatedConversation.messages.map((message, index) => {
                  if (index === updatedConversation.messages.length - 1) {
                    return {
                      ...message,
                      content: text,
                    };
                  }
                  return message;
                });
              updatedConversation = {
                ...updatedConversation,
                messages: updatedMessages,
              };
              homeDispatch({
                field: 'selectedConversation',
                value: updatedConversation,
              });
            }
            if (done) {
              messageCount.current += 1;
              logResponse(text, 'bot', messageCount);
              const newText = await parseText(text, messageCount);
              originalMessage = [
                ...originalMessage,
                { role: 'assistant', content: text },
              ];
              // // console.log(
              //   'original message',
              //   originalMessage,
              //   updatedConversation.messages,
              // );
              homeDispatch({ field: 'gptMessages', value: originalMessage });

              if (typeof newText === 'string') {
                // logResponse(newText, 'api');
                // // console.log('new text: ', newText);
                const updatedMessages: Message[] =
                  updatedConversation.messages.map((message, index) => {
                    if (index === updatedConversation.messages.length - 1) {
                      return {
                        ...message,
                        content: newText,
                      };
                    }
                    return message;
                  });
                updatedConversation = {
                  ...updatedConversation,
                  messages: updatedMessages,
                };
                homeDispatch({
                  field: 'selectedConversation',
                  value: updatedConversation,
                });
                // // console.log('original', originalConversation);
              }
            }
          }
          // saveConversation(updatedConversation);
          const updatedConversations: Conversation[] = conversations.map(
            (conversation) => {
              if (conversation.id === selectedConversation.id) {
                return updatedConversation;
              }
              return conversation;
            },
          );
          if (updatedConversations.length === 0) {
            updatedConversations.push(updatedConversation);
          }
          homeDispatch({ field: 'conversations', value: updatedConversations });
          // saveConversations(updatedConversations);
          homeDispatch({ field: 'messageIsStreaming', value: false });
        } else {
          // // console.log('response', typeof response.body, response);
          const { answer } = await response.json();
          const updatedMessages: Message[] = [
            ...updatedConversation.messages,
            { role: 'assistant', content: answer },
          ];
          updatedConversation = {
            ...updatedConversation,
            messages: updatedMessages,
          };
          // // console.log('updatedConversation', updatedConversation);
          homeDispatch({
            field: 'selectedConversation',
            value: updatedConversation,
          });
          // saveConversation(updatedConversation);
          const updatedConversations: Conversation[] = conversations.map(
            (conversation) => {
              if (conversation.id === selectedConversation.id) {
                return updatedConversation;
              }
              return conversation;
            },
          );
          if (updatedConversations.length === 0) {
            updatedConversations.push(updatedConversation);
          }
          homeDispatch({ field: 'conversations', value: updatedConversations });
          // saveConversations(updatedConversations);
          homeDispatch({ field: 'loading', value: false });
          homeDispatch({ field: 'messageIsStreaming', value: false });
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      apiKey,
      conversations,
      pluginKeys,
      selectedConversation,
      stopConversationRef,
    ],
  );

  const handleSendCustom = useCallback(
    async (
      message: Message,
      deleteCount = 0,
      plugin: Plugin | null = null,
      prompt = '',
    ) => {
      // // console.log('msg', { message, deleteCount, plugin });
      const video = document.getElementById(
        'tutorial-video',
      ) as HTMLVideoElement;
      video && video.pause();
      if (selectedConversation) {
        let updatedConversation: Conversation;
        let originalMessage: Message[];
        if (deleteCount) {
          const updatedMessages = [...selectedConversation.messages];
          for (let i = 0; i < deleteCount; i++) {
            updatedMessages.pop();
            gptMessages.pop();
          }
          updatedConversation = {
            ...selectedConversation,
            messages: [...updatedMessages, message],
          };
        } else {
          messageCount.current += 1;
          // logResponse(message, 'user', messageCount);
          updatedConversation = {
            ...selectedConversation,
            messages: [message],
            prompt,
          };
          // // console.log("Here is the updated message: ",updatedConversation.messages);
        }
        originalMessage = [
          ...gptMessages,
          { role: 'user', content: message.content },
        ];
        // // console.log('user msg: ', selectedConversation, prompt);
        // updatedConversation = { ...updatedConversation, prompt };
        homeDispatch({
          field: 'selectedConversation',
          value: updatedConversation,
        });
        homeDispatch({ field: 'loading', value: true });
        homeDispatch({ field: 'messageIsStreaming', value: true });
        // // console.log('', updatedConversation);
        const modifiedMessages = modifyMessages({
          messages: updatedConversation.messages,
          gptMessage: gptMessages,
        });
        // // console.log(
        //   'modifiedMessages',
        //   modifiedMessages,
        //   updatedConversation.messages,
        // );
        const chatBody: ChatBody = {
          model: updatedConversation.model,
          // messages:
          //   updatedConversation.messages.length >= 4
          //     ? updatedConversation.messages.slice(-4)
          //     : updatedConversation.messages,
          messages: [{ role: 'user', content: message.content }],
          // modifiedMessages === false
          //   ? updatedConversation.messages
          //   : modifiedMessages,
          // messages: modifiedMessages,
          key: apiKey,
          prompt,
          // temperature: updatedConversation.temperature,
          temperature: 0.25,
        };
        const endpoint = getEndpoint(plugin);
        let body;
        if (!plugin) {
          body = JSON.stringify(chatBody);
        } else {
          body = JSON.stringify({
            ...chatBody,
            googleAPIKey: pluginKeys
              .find((key) => key.pluginId === 'google-search')
              ?.requiredKeys.find((key) => key.key === 'GOOGLE_API_KEY')?.value,
            googleCSEId: pluginKeys
              .find((key) => key.pluginId === 'google-search')
              ?.requiredKeys.find((key) => key.key === 'GOOGLE_CSE_ID')?.value,
          });
        }
        const controller = new AbortController();
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
          body,
        });
        // // console.log('response', response);
        if (!response.ok) {
          homeDispatch({ field: 'loading', value: false });
          homeDispatch({ field: 'messageIsStreaming', value: false });
          toast.error(response.statusText);
          return;
        }
        const data = response.body;
        if (!data) {
          homeDispatch({ field: 'loading', value: false });
          homeDispatch({ field: 'messageIsStreaming', value: false });
          return;
        }
        if (!plugin) {
          if (updatedConversation.messages.length === 1) {
            const { content } = message;
            const customName =
              content.length > 30 ? content.substring(0, 30) + '...' : content;
            updatedConversation = {
              ...updatedConversation,
              name: customName,
            };
          }
          homeDispatch({ field: 'loading', value: false });
          const reader = data.getReader();
          const decoder = new TextDecoder();
          let done = false;
          let isFirst = true;
          let text = '';
          while (!done) {
            if (stopConversationRef.current === true) {
              controller.abort();
              done = true;
              break;
            }
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            const chunkValue = decoder.decode(value);
            text += chunkValue;
            setNewChunk(chunkValue);
            // // console.log('text', text);
            if (isFirst) {
              isFirst = false;
              const updatedMessages: Message[] = [
                ...updatedConversation.messages,
                { role: 'assistant', content: chunkValue },
              ];
              updatedConversation = {
                ...updatedConversation,
                messages: updatedMessages,
              };
              homeDispatch({
                field: 'selectedConversation',
                value: updatedConversation,
              });
            } else {
              const updatedMessages: Message[] =
                updatedConversation.messages.map((message, index) => {
                  if (index === updatedConversation.messages.length - 1) {
                    return {
                      ...message,
                      content: text,
                    };
                  }
                  return message;
                });
              updatedConversation = {
                ...updatedConversation,
                messages: updatedMessages,
              };
              homeDispatch({
                field: 'selectedConversation',
                value: updatedConversation,
              });
            }
            if (done) {
              messageCount.current += 1;
              logResponse(text, 'bot', messageCount);
              const newText = await parseText(text, messageCount);
              originalMessage = [
                ...originalMessage,
                { role: 'assistant', content: text },
              ];
              // // console.log(
              //   'original message',
              //   originalMessage,
              //   updatedConversation.messages,
              // );
              homeDispatch({ field: 'gptMessages', value: originalMessage });

              if (typeof newText === 'string') {
                // logResponse(newText, 'api');
                // // console.log('new text: ', newText);
                const updatedMessages: Message[] =
                  updatedConversation.messages.map((message, index) => {
                    if (index === updatedConversation.messages.length - 1) {
                      return {
                        ...message,
                        content: newText,
                      };
                    }
                    return message;
                  });
                updatedConversation = {
                  ...updatedConversation,
                  messages: updatedMessages,
                };
                homeDispatch({
                  field: 'selectedConversation',
                  value: updatedConversation,
                });
                // // console.log('original', originalConversation);
              }
            }
          }
          // saveConversation(updatedConversation);
          const updatedConversations: Conversation[] = conversations.map(
            (conversation) => {
              if (conversation.id === selectedConversation.id) {
                return updatedConversation;
              }
              return conversation;
            },
          );
          if (updatedConversations.length === 0) {
            updatedConversations.push(updatedConversation);
          }
          homeDispatch({ field: 'conversations', value: updatedConversations });
          // saveConversations(updatedConversations);
          homeDispatch({ field: 'messageIsStreaming', value: false });
        } else {
          // // console.log('response', typeof response.body, response);
          const { answer } = await response.json();
          const updatedMessages: Message[] = [
            ...updatedConversation.messages,
            { role: 'assistant', content: answer },
          ];
          updatedConversation = {
            ...updatedConversation,
            messages: updatedMessages,
          };
          // // console.log('updatedConversation', updatedConversation);
          homeDispatch({
            field: 'selectedConversation',
            value: updatedConversation,
          });
          // saveConversation(updatedConversation);
          const updatedConversations: Conversation[] = conversations.map(
            (conversation) => {
              if (conversation.id === selectedConversation.id) {
                return updatedConversation;
              }
              return conversation;
            },
          );
          if (updatedConversations.length === 0) {
            updatedConversations.push(updatedConversation);
          }
          homeDispatch({ field: 'conversations', value: updatedConversations });
          // saveConversations(updatedConversations);
          homeDispatch({ field: 'loading', value: false });
          homeDispatch({ field: 'messageIsStreaming', value: false });
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      apiKey,
      conversations,
      pluginKeys,
      selectedConversation,
      stopConversationRef,
    ],
  );

  const scrollToBottom = useCallback(() => {
    if (autoScrollEnabled) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      textareaRef.current?.focus();
    }
  }, [autoScrollEnabled]);

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        chatContainerRef.current;
      const bottomTolerance = 30;

      if (scrollTop + clientHeight < scrollHeight - bottomTolerance) {
        setAutoScrollEnabled(false);
        setShowScrollDownButton(true);
      } else {
        setAutoScrollEnabled(true);
        setShowScrollDownButton(false);
      }
    }
  };

  const handleScrollDown = () => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth',
    });
  };

  const handleSettings = () => {
    setShowSettings(!showSettings);
  };

  const onClearAll = () => {
    if (
      confirm(t<string>('Are you sure you want to clear all messages?')) &&
      selectedConversation
    ) {
      handleUpdateConversation(selectedConversation, {
        key: 'messages',
        value: [],
      });
    }
  };

  const handleNextQuestion = () => {
    // setQuestionNumber(questionNumber + 1);
    homeDispatch({ field: 'questionNumber', value: questionNumber + 1 });
    setExpand('');
    setCorrectAnimation(false);
  };
  const handleFinish = () => {
    // setQuestionNumber(questionNumber + 1);
    homeDispatch({ field: 'questionNumber', value: 9 });
    setExpand('');
    setCorrectAnimation(false);
  };
  const handlePrevQuestion = () => {
    homeDispatch({ field: 'questionNumber', value: questionNumber - 1 });
    setExpand('');
    setCorrectAnimation(false);
  };
  // const handleFinish = () => {
  //   // console.log('finished');
  //   setQuestionNumber(questionNumber + 1);
  //   setExpand(false);
  //   setCorrectAnimation(false);
  // };

  const scrollDown = () => {
    if (autoScrollEnabled) {
      messagesEndRef.current?.scrollIntoView(true);
    }
  };
  const throttledScrollDown = throttle(scrollDown, 250);

  // useEffect(() => {
  //   // console.log('currentMessage', currentMessage);
  //   if (currentMessage) {
  //     handleSend(currentMessage);
  //     homeDispatch({ field: 'currentMessage', value: undefined });
  //   }
  // }, [currentMessage]);

  useEffect(() => {
    throttledScrollDown();
    selectedConversation &&
      selectedConversation?.messages &&
      setCurrentMessage(
        selectedConversation.messages[selectedConversation.messages.length - 2],
      );
  }, [selectedConversation, throttledScrollDown]);

  useEffect(() => {
    if (!messageIsStreaming) {
      if (messagesEndRef.current) {
        console.log('scrolling into view');
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [messageIsStreaming]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setAutoScrollEnabled(entry.isIntersecting);
        if (entry.isIntersecting) {
          textareaRef.current?.focus();
        }
      },
      {
        root: null,
        threshold: 0.5,
      },
    );
    const messagesEndElement = messagesEndRef.current;
    // console.log('messagesEndElement', messagesEndElement);
    if (messagesEndElement) {
      observer.observe(messagesEndElement);
    }
    return () => {
      if (messagesEndElement) {
        observer.unobserve(messagesEndElement);
      }
    };
  }, [messagesEndRef]);

  // const handleCheckAnswer = (answer: string) => {
  //   if (messageIsStreaming) {
  //     stopConversationRef.current = true;
  //     setTimeout(() => {
  //       stopConversationRef.current = false;
  //     }, 1000);
  //   }
  //   !expand && setExpand(true);
  //   const nPrompt = generateQuestionPrompt('answer', questionNumber);
  //   // // console.log('default answer', defaultModelId);
  //   // // console.log('checkAnswer', selectedConversation);
  //   handleSendCustom(
  //     {
  //       // ...currentMessage,
  //       content: answer,
  //       role: 'user',
  //     },
  //     0,
  //     null,
  //     nPrompt.prompt,
  //   );
  // };

  // const updateScore = (questionIndex: number, value: string) => {
  //   const updatedScore = [...score];
  //   updatedScore[questionIndex] = value;
  //   // console.log('score update', score, updatedScore);
  //   setScore(updatedScore);
  // };

  const handleCardText = (action: string) => {
    switch (true) {
      case action === 'answer':
        setCardType('Checking Answer');
        break;
      case action === 'hintCard':
        setCardType('Get a hint');
        break;
      case action === 'exampleCard':
        setCardType('View an example');
        break;
      case action === 'realCard':
        setCardType('Make It Real');
        break;
      case action === 'videoCard':
        setCardType('Watch a video');
        break;
      default:
        break;
    }
  };

  const handleQuestionActions = (
    action: string,
    answer = '',
    qNumber = 0,
  ): 'correct' | 'incorrect' | void => {
    // console.log('first', questionList[qNumber], {
    //   qNumber,
    // });

    if (messageIsStreaming) {
      stopConversationRef.current = true;
      setTimeout(() => {
        stopConversationRef.current = false;
      }, 1000);
    }

    if (action === 'answer' && answer.length <= 0) return;
    handleCardText(action);
    // if (action === 'storyCard') {
    //   setExpand('storySection');
    //   return;
    // }

    let value = '';
    if (action === 'answer') {
      value =
        questionArray[qNumber].answerText === answer ? 'correct' : 'incorrect';
      // updateScore(qNumber, value);
      // console.log('score val', value);
      // const updatedScore = [...scoreList];
      scoreList[qNumber] = value;
      // // console.log('score update', scoreList);
      homeDispatch({ field: 'scoreList', value: scoreList });
      // setScore(updatedScore);
    }

    if (value === 'correct') {
      setCorrectAnimation(true);
      setExpand('');
      homeDispatch({ field: 'inputCorrect', value: 'correct' });
      return 'correct';
    } else {
      value === 'incorrect' &&
        homeDispatch({ field: 'inputCorrect', value: 'incorrect' });
      setCorrectAnimation(false);
      setExpand('chatSection');
      const questionSelect = action === 'answer' ? qNumber : questionNumber;

      const newPromptProps = generateQuestionPrompt({
        type: action,
        question: questionList[questionSelect].questionText,
        answer: questionList[questionSelect].answerText,
        studentAnswer: answer,
      });
      // // console.log('first', newPromptProps);
      // defaultModelId &&
      //   homeDispatch({
      //     field: 'selectedConversation',
      //     value: {
      //       // id: uuidv4(),
      //       // name: t('New Conversation'),
      //       messages: [],
      //       // model: OpenAIModels[defaultModelId],
      //       prompt: newPromptProps.prompt,
      //       // temperature: DEFAULT_TEMPERATURE,
      //       // folderId: null,
      //       ...selectedConversation,
      //     },
      //   });
      handleSendCustom(
        {
          content: action === 'answer' ? answer : newPromptProps.content,
          role: 'user',
        },
        0,
        null,
        newPromptProps.prompt,
      );
      return 'incorrect';
    }
  };

  const handleSwitchQuestion = () => {
    // Call the switchQuestionComponent function through the ref
    if (questionListRef.current) {
      questionListRef.current.switchQuestionComponent();
    }
  };

  return (
    <div
      className={`relative flex flex-col h-screen overflow-hidden bg-white dark:bg-[#343541] `}
    >
      {/* <div className="absolute z-10 flex justify-center gap-10">
        <Image
          alt="background1"
          src={`${process.env.NEXT_PUBLIC_AWS_IMAGE}/background+1.png`}
          unoptimized
          // style={{ objectFit: 'cover' }}
          width={100}
          height={100}
          className="min-h-[25vh] w-[50vw]"
        />
        <Image
          alt="background2"
          src={`${process.env.NEXT_PUBLIC_AWS_IMAGE}/background+2.png`}
          unoptimized
          // style={{ objectFit: 'cover' }}
          width={100}
          height={100}
          className="min-h-[25vh] w-[50vw]"
        />
      </div> */}
      <div
        className="absolute z-10 flex h-full w-screen bg-repeat bg-contain"
        style={{
          backgroundImage: `url(${process.env.NEXT_PUBLIC_AWS_IMAGE}/Group+117.png)`,
        }}
      >
        {/* <Image
          alt="background1"
          src={`${process.env.NEXT_PUBLIC_AWS_IMAGE}/background+1.png`}
          unoptimized
          width={100}
          height={100}
          className="h-full w-auto"
        />
        <Image
          alt="background2"
          src={`${process.env.NEXT_PUBLIC_AWS_IMAGE}/background+2.png`}
          unoptimized
          width={100}
          height={100}
          // style={{ transform: 'scaleX(-1)' }}
          className="h-full w-auto"
        /> */}
      </div>

      <div className="h-[8vh] top-0 z-10  flex justify-between border border-b-slate-400 p-2 dark:border-none bg-white dark:bg-[#444654] ">
        {/* <div className="flex items-center gap-2 ml-3">
          <Image alt="robot" src={RobotImage} className="h-10 w-10" />
          <div className="text-lg font-medium text-black">Savvy Max</div>
        </div> */}
        <div className="flex items-center gap-0">
          <IconChevronLeft
            className="row-span-2 place-self-center 2xl:scale-150 mx-3"
            // size={40}
          />
          <div className="flex flex-col leading-[1.15rem] ">
            <p className="font-light text-[0.91rem]">MRS. SMITH&apos;S CLASS</p>
            <p className="font-normal">
              1-1: Practice Buddy: Independent Practice; Problem Solving
            </p>
          </div>
          {/* <div className="flex flex-col row-span-2">
            <p className="font-light text-neutral-500">
              MRS. SMITH&apos;S ELEMENTARY CLASS
            </p>
            <p className="">
              1-1: Practice Buddy: Independent Practice; Problem Solving
            </p>
          </div> */}
        </div>

        {/* {t('Model')}: {selectedConversation?.model.name} | {t('Temp')}
                  : {selectedConversation?.temperature} | */}
        {/* <button
          className="ml-2 cursor-pointer hover:opacity-50 hidden md:block"
          onClick={handleSettings}
        >
          <IconSettings size={18} />
        </button> */}

        {/* <button
          className="text-[#006BE0] bg-white border border-[#006BE0] focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-md text-sm px-2.5 py-1.5 mr-2 "
          onClick={onClearAll}
        >
          Clear
        </button> */}
        <div className="flex gap-2 items-center mr-4 text-black 2xl:gap-4">
          <div className="w-0.5 bg-slate-400 opacity-100 min-h-[2em]" />
          <div className="flex flex-col leading-5 ">
            <p className="font-light ">DUE</p>
            <p className="font-normal">{formattedDate}</p>
          </div>
          <div className="w-0.5 bg-slate-400 opacity-100 min-h-[2em]" />
          <Image
            alt="message bubble"
            width={100}
            height={100}
            // src="https://elasticbeanstalk-ap-south-1-860768680752.s3.ap-south-1.amazonaws.com/paperclip+icon.svg"
            src={`${process.env.NEXT_PUBLIC_AWS_IMAGE}/information.svg`}
            className="max-h-full w-auto "
          />
          <div className="w-0.5 bg-slate-400 opacity-100 min-h-[2em]" />
          {/* <IconPaperclip /> */}
          <Image
            alt="paper clip"
            width={100}
            height={100}
            // src="https://elasticbeanstalk-ap-south-1-860768680752.s3.ap-south-1.amazonaws.com/paperclip+icon.svg"
            src={`${process.env.NEXT_PUBLIC_AWS_IMAGE}/paperclip+icon.svg`}
            className="max-h-full w-auto "
          />
          <div className="w-0.5 bg-slate-400 opacity-100 min-h-[2em]" />
          <Image
            alt="message bubble"
            width={100}
            height={100}
            // src="https://elasticbeanstalk-ap-south-1-860768680752.s3.ap-south-1.amazonaws.com/paperclip+icon.svg"
            src={`${process.env.NEXT_PUBLIC_AWS_IMAGE}/messageBubble.svg`}
            className="max-h-full w-auto "
          />
        </div>
      </div>
      {!(apiKey || serverSideApiKeyIsSet) ? (
        // <div className="mx-auto flex h-full w-[300px] flex-col justify-center space-y-6 sm:w-[600px]">
        //   <div className="text-center text-4xl font-bold text-black dark:text-white">
        //     Welcome to Chatbot UI
        //   </div>
        //   <div className="text-center text-lg text-black dark:text-white">
        //     <div className="mb-8">{`Chatbot UI is an open source clone of OpenAI's ChatGPT UI.`}</div>
        //     <div className="mb-2 font-bold">
        //       Important: Chatbot UI is 100% unaffiliated with OpenAI.
        //     </div>
        //   </div>
        //   <div className="text-center text-gray-500 dark:text-gray-400">
        //     <div className="mb-2">
        //       Chatbot UI allows you to plug in your API key to use this UI with
        //       their API.
        //     </div>
        //     <div className="mb-2">
        //       It is <span className="italic">only</span> used to communicate
        //       with their API.
        //     </div>
        //     <div className="mb-2">
        //       {t(
        //         'Please set your OpenAI API key in the bottom left of the sidebar.',
        //       )}
        //     </div>
        //     <div>
        //       {t("If you don't have an OpenAI API key, you can get one here: ")}
        //       <a
        //         href="https://platform.openai.com/account/api-keys"
        //         target="_blank"
        //         rel="noreferrer"
        //         className="text-blue-500 hover:underline"
        //       >
        //         openai.com
        //       </a>
        //     </div>
        //   </div>
        // </div>
        <></>
      ) : modelError ? (
        <ErrorMessageDiv error={modelError} />
      ) : (
        <>
          {/* {// console.log('selected', selectedConversation)} */}
          <div
            className="flex flex-col overflow-x-hidden flex-1"
            ref={chatContainerRef}
            onScroll={handleScroll}
          >
            {selectedConversation?.messages &&
            selectedConversation?.messages.length === -1 ? (
              <>
                <div className="mx-auto flex flex-col space-y-5 md:space-y-10 px-3 pt-5 md:pt-12 sm:max-w-[600px]">
                  <div className="text-center text-3xl font-semibold text-gray-800 dark:text-gray-100">
                    {models.length === 0 ? (
                      <div>
                        <Spinner size="16px" className="mx-auto" />
                      </div>
                    ) : (
                      <div>
                        <div className="grid grid-rows-3 grid-flow-col items-center">
                          {/* <Image
                            alt="robot"
                            src={RobotImage}
                            className="row-span-3"
                          /> */}
                          {/* <div className="col-span-2 row-span-2">
                            Welcome! I&apos;m Savvy, I&apos;ll help you learn
                            math in a fun way!
                          </div> */}
                          <div className="text-lg font-normal col-span-2 mt-0 row-span-3 md:-mt-12">
                            Hi! I&apos;m Savvy Max, here to help you with math!
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* {models.length > 0 && (
                    <div className="flex h-full flex-col space-y-4 rounded-lg border border-neutral-200 p-4 dark:border-neutral-600">
                      <ModelSelect />

                      <SystemPrompt
                        conversation={selectedConversation}
                        prompts={prompts}
                        onChangePrompt={(prompt) =>
                          handleUpdateConversation(selectedConversation, {
                            key: 'prompt',
                            value: prompt,
                          })
                        }
                      />

                      <TemperatureSlider
                        label={t('Temperature')}
                        onChangeTemperature={(temperature) =>
                          handleUpdateConversation(selectedConversation, {
                            key: 'temperature',
                            value: temperature,
                          })
                        }
                      />
                    </div>
                  )} */}
                </div>
              </>
            ) : (
              <>
                {showSettings && (
                  <div className="flex flex-col space-y-10 md:mx-auto md:max-w-xl md:gap-6 md:py-3 md:pt-6 lg:max-w-2xl lg:px-0 xl:max-w-3xl">
                    <div className="flex h-full flex-col space-y-4 border-b border-neutral-200 p-4 dark:border-neutral-600 md:rounded-lg md:border">
                      <ModelSelect />
                    </div>
                  </div>
                )}
                {questionNumber >= questionArray.length ? (
                  <ScoreCard />
                ) : (
                  <div
                    className={`flex justify-between h-[calc(100vh-16vh)] z-20 ${inter.className}`}
                  >
                    <div
                      className={`${
                        expand ? 'w-1/2 pr-4 md:pr-8' : 'w-full px-2 md:px-20'
                      }  transition-all duration-500`}
                    >
                      <div className="h-full">
                        <QuestionList
                          correctAnimation={correctAnimation}
                          setCorrectAnimation={setCorrectAnimation}
                          handleQuestionActions={(
                            action: string,
                            answer?: string,
                            qNumber?: number,
                          ) => handleQuestionActions(action, answer, qNumber)}
                          // questionNumber={questionNumber}
                          ref={questionListRef}
                        />
                      </div>
                    </div>
                    {/* {expand && ( */}
                    <div
                      className={`${
                        !expand ? 'w-0' : 'w-1/2 p-4'
                      } overflow-y-auto duration-500 min-h-[calc(100vh-140px) bg-[#B5EAD1]`}
                    >
                      <div className="bg-black shadow-md shadow-slate-600/50 h-full overflow-scroll">
                        <div className="text-white sticky top-0 flex z-50 bg-black w-full justify-between p-2 pl-8 border-b-2">
                          <p className="font-bold">{cardType}</p>
                          <button
                            onClick={() => setExpand('')}
                            className="hover:bg-neutral-500"
                          >
                            <IconX />
                          </button>
                        </div>
                        {expand === 'chatSection' &&
                          selectedConversation?.messages &&
                          selectedConversation?.messages.map(
                            (message, index) => (
                              <MemoizedChatMessage
                                key={index}
                                message={message}
                                messageIndex={index}
                                handleSend={handleSend}
                                handleSwitchQuestion={handleSwitchQuestion}
                                onEdit={(editedMessage) => {
                                  setCurrentMessage(editedMessage);
                                  // discard edited message and the ones that come after then resend
                                  handleSend(
                                    editedMessage,
                                    selectedConversation?.messages.length -
                                      index,
                                  );
                                }}
                              />
                            ),
                          )}
                        {/* {expand === 'storySection' && (
                          <div className="flex flex-col gap-3 justify-start items-start p-4 px-6 text-white">
                            <p className="mb-2 text-base">
                              Choose any one of the following adventures!
                            </p>
                            <button
                              className="rounded border-white border-2 bg-blue-600 px-3 text-white py-1 hover:opacity-80"
                              // onClick={handleSwitchQuestion}
                            >
                              Mario
                            </button>
                            <button
                              className="rounded border-white border-2 bg-blue-600 px-3 text-white py-1 hover:opacity-80"
                              // onClick={handleSwitchQuestion}
                            >
                              Robots
                            </button>
                            <button
                              className="rounded border-white border-2 bg-blue-600 px-3 text-white py-1 hover:opacity-80"
                              // onClick={handleSwitchQuestion}
                            >
                              Barbie
                            </button>
                          </div>
                        )} */}

                        {loading && <ChatLoader />}

                        <div
                          className="h-[11rem] bg-black"
                          ref={messagesEndRef}
                        />
                      </div>
                    </div>
                    {/* )} */}
                  </div>
                )}
              </>
            )}
          </div>

          <ChatInput
            stopConversationRef={stopConversationRef}
            textareaRef={textareaRef}
            onSend={(message, plugin) => {
              setCurrentMessage(message);
              handleSend(message, 0, plugin);
            }}
            onScrollDownClick={handleScrollDown}
            onRegenerate={() => {
              if (currentMessage) {
                handleSend(currentMessage, 2, null);
              }
            }}
            showScrollDownButton={showScrollDownButton}
          />
        </>
      )}
      {/* <Image
        alt="tiger"
        src={cloudImage}
        unoptimized
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100vw',
        }}
      /> */}

      {!(questionNumber >= questionArray.length) && (
        <QuestionCards {...{ handleQuestionActions, expand }} />
      )}
      {/* bottom bar */}
      <div className="w-full h-[8vh] z-20 flex  justify-between border border-b-slate-400  py-2 text-neutral-500 dark:border-none bg-white dark:bg-[#444654] dark:text-neutral-200">
        <div className="flex items-center gap-2 ml-3">
          {/* <button
            className="text-white bg-[#006BE0] border border-[#006BE0] focus:outline-none hover:bg-gray-100 hover:text-[#006BE0] disabled:bg-neutral-300 disabled:text-slate-500 disabled:border-gray-200 focus:ring-4 focus:ring-gray-200 font-medium rounded-md text-sm pl-1 pr-2 py-1.5 flex items-center mr-2"
            // onClick={onClearAll}
            onClick={handleSwitchQuestion}
          >
            Switch Question
          </button> */}
          {/* <div className="text-lg font-medium text-black">Bottom Bar</div> */}
        </div>
        {/* {t('Model')}: {selectedConversation?.model.name} | {t('Temp')}
                  : {selectedConversation?.temperature} | */}
        {/* <button
          className="ml-2 cursor-pointer hover:opacity-50 hidden md:block"
          onClick={handleSettings}
        >
          <IconSettings size={18} />
        </button> */}
        <div className="flex items-center gap-2 mr-4">
          {questionNumber <= 8 && <p>Question {questionNumber + 1} of 9</p>}
          {
            <>
              <button
                className="text-white bg-[#006BE0] border border-[#006BE0] focus:outline-none hover:bg-gray-100 hover:text-[#006BE0] disabled:bg-neutral-300 disabled:text-slate-500 disabled:border-gray-200 focus:ring-4 focus:ring-gray-200 font-medium rounded-md flex items-center gap-1 pr-2.5 p-1"
                onClick={handlePrevQuestion}
                disabled={questionNumber <= 0}
              >
                <IconArrowLeft />
                Back
              </button>
            </>
          }
          {questionNumber < 8 && (
            <button
              className="text-white bg-[#006BE0] border border-[#006BE0] focus:outline-none hover:bg-gray-100 hover:text-[#006BE0] disabled:bg-neutral-300 disabled:text-slate-500 disabled:border-gray-200 focus:ring-4 focus:ring-gray-200 font-medium rounded-md flex items-center gap-1 pl-2.5 p-1"
              onClick={handleNextQuestion}
            >
              <p className="flex items-center">
                Next <IconArrowRight />
              </p>
            </button>
          )}
          {questionNumber >= 4 && questionNumber < 9 && (
            <button
              className="text-white bg-[#006BE0] border border-[#006BE0] focus:outline-none hover:bg-gray-100 hover:text-[#006BE0] disabled:bg-neutral-300 disabled:text-slate-500 disabled:border-gray-200 focus:ring-4 focus:ring-gray-200 font-medium rounded-md flex items-center gap-1 pl-2.5 p-1"
              onClick={handleFinish}
            >
              <p className="p-0.5 pr-1">Finish Quiz</p>
            </button>
          )}
        </div>
      </div>
      {/* Bottom bar */}
    </div>
  );
});
Chat.displayName = 'Chat';
