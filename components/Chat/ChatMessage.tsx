import {
  FC,
  ReactNode,
  memo,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { useTranslation } from 'next-i18next';

import { updateConversation } from '@/utils/app/conversation';

import { Message } from '@/types/chat';

import HomeContext from '@/pages/api/home/home.context';

import { CodeBlock } from '../Markdown/CodeBlock';
import { MemoizedReactMarkdown } from '../Markdown/MemoizedReactMarkdown';
import { ChatMessageButton } from './ChatMessageButton';
import { CustomButton } from './CustomButton';
import { CustomComponent } from './CustomComponent';
import { FeedbackModal } from './FeedbackModal';
import { HiddenQuestion } from './HiddenQuestion';
import { TextToSpeech } from './TextToSpeech';

import rehypeMathjax from 'rehype-mathjax';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

export interface ChatMessageProps {
  message: Message;
  messageIndex: number;
  onEdit?: (editedMessage: Message) => void;
  handleSend?: (message: Message) => void;
  handleSwitchQuestion: () => void;
}

export const ChatMessage: FC<ChatMessageProps> = memo(
  ({ message, messageIndex, onEdit, handleSend, handleSwitchQuestion }) => {
    const { t } = useTranslation('chat');
    // useEffect(() => {
    //   const speakText = () => {
    //     const utterance = new SpeechSynthesisUtterance(message.content);

    //     utterance.onstart = () => {};
    //     utterance.onend = () => {};

    //     window.speechSynthesis.speak(utterance);
    //   };

    //   if (message.content.trim() !== '') {
    //     speakText();
    //   }
    // }, [message.content]);

    const {
      state: {
        selectedConversation,
        conversations,
        currentMessage,
        messageIsStreaming,
      },
      dispatch: homeDispatch,
    } = useContext(HomeContext);

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const [messageContent, setMessageContent] = useState(message.content);
    const [messagedCopied, setMessageCopied] = useState(false);
    const [feedback, setFeedback] = useState<boolean>(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const toggleEditing = () => {
      setIsEditing(!isEditing);
    };

    const handleInputChange = (
      event: React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
      setMessageContent(event.target.value);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'inherit';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    };

    const handleEditMessage = () => {
      if (message.content != messageContent) {
        if (selectedConversation && onEdit) {
          onEdit({ ...message, content: messageContent });
        }
      }
      setIsEditing(false);
    };

    const handleOptionSend = (value: ReactNode) => {
      // // console.log('first', value?.toString(), message);
      //* create a function that only sends the message and is not left in the chat history
      // // console.log('validate', value);
      // const newValue = { ...message, value };
      if (message?.content !== undefined && handleSend)
        handleSend({
          ...message,
          content: (value as string)?.toString(),
          role: 'user',
        });
      // if (selectedConversation && message.content) handleSend({...message, value})
      // handleSend()
    };

    const handleDeleteMessage = () => {
      if (!selectedConversation) return;

      const { messages } = selectedConversation;
      const findIndex = messages.findIndex((elm) => elm === message);

      if (findIndex < 0) return;

      if (
        findIndex < messages.length - 1 &&
        messages[findIndex + 1].role === 'assistant'
      ) {
        messages.splice(findIndex, 2);
      } else {
        messages.splice(findIndex, 1);
      }
      const updatedConversation = {
        ...selectedConversation,
        messages,
      };

      const { single, all } = updateConversation(
        updatedConversation,
        conversations,
      );
      homeDispatch({ field: 'selectedConversation', value: single });
      homeDispatch({ field: 'conversations', value: all });
    };

    const handlePressEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !isTyping && !e.shiftKey) {
        e.preventDefault();
        handleEditMessage();
      }
    };

    const copyOnClick = () => {
      if (!navigator.clipboard) return;

      navigator.clipboard.writeText(message.content).then(() => {
        setMessageCopied(true);
        setTimeout(() => {
          setMessageCopied(false);
        }, 2000);
      });
    };

    useEffect(() => {
      setMessageContent(message.content);
    }, [message.content]);

    useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'inherit';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    }, [isEditing]);

    return (
      <div
        className={`group md:px-4 ${
          message.role === 'assistant'
            ? 'border-b border-black/10 bg-black text-gray-800 dark:border-gray-900/50 dark:bg-[#444654] dark:text-gray-100'
            : 'border-b border-black/10 bg-black text-gray-800 dark:border-gray-900/50 dark:bg-[#343541] dark:text-gray-100'
        }`}
        style={{ overflowWrap: 'anywhere' }}
      >
        <div className="relative leading-relaxed flex p-2 justify-between">
          {/* {message.role === 'user' && (
            <div className="min-w-[40px] text-right font-bold">
              {
                <>
                  <Image src={UserImage} alt="user" width={40} />
                <IconUser size={30} />
                </>
              }
            </div>
          )} */}

          <div className=" mt-[-2px] w-full dark:prose-invert ">
            {message.role === 'user' ? (
              <div className="flex w-full">
                {isEditing ? (
                  <div className="flex w-full flex-col">
                    <textarea
                      ref={textareaRef}
                      className="w-full resize-none whitespace-pre-wrap dark:bg-[#343541]"
                      value={messageContent}
                      onChange={handleInputChange}
                      onKeyDown={handlePressEnter}
                      onCompositionStart={() => setIsTyping(true)}
                      onCompositionEnd={() => setIsTyping(false)}
                      style={{
                        fontFamily: 'inherit',
                        fontSize: 'inherit',
                        lineHeight: 'inherit',
                        padding: '0',
                        margin: '0',
                        overflow: 'hidden',
                      }}
                    />

                    <div className="mt-10 flex justify-center space-x-4">
                      <button
                        className="h-[40px] rounded-md bg-blue-500 px-4 py-1 text-sm font-medium text-white enabled:hover:bg-blue-600 disabled:opacity-50"
                        onClick={handleEditMessage}
                        disabled={messageContent.trim().length <= 0}
                      >
                        {t('Save & Submit')}
                      </button>
                      <button
                        className="h-[40px] rounded-md border border-neutral-300 px-4 py-1 text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                        onClick={() => {
                          setMessageContent(message.content);
                          setIsEditing(false);
                        }}
                      >
                        {t('Cancel')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex w-full flex-col">
                    {/* <p className="text-white text-right"> value</p> */}
                    <div className="prose max-w-none whitespace-pre-wrap text-white text-right text-[1.3rem]">
                      {message.content}
                    </div>
                    <hr className="h-0.5 border-t-0 bg-neutral-400 opacity-100 w-full mt-3" />
                  </div>
                )}
                {/* <hr className="my-4 h-0.5 border-t-0 bg-neutral-400 opacity-100 w-full" /> */}
              </div>
            ) : (
              <div className="relative flex w-full">
                {/* <div className="absolute w-3 h-3 bg-[#E5F0F9] transform rotate-45 top-2 -left-1" /> */}
                <div className=" flex flex-col  bg-black text-white p-2 md:mb-0 rounded-t-lg rounded-br-lg w-full">
                  {/* <div className="text-xs mb-2">Savvy Max</div> */}
                  <MemoizedReactMarkdown
                    className="prose flex-1 text-white text-[1.3rem] max-w-none"
                    remarkPlugins={[]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        if (children.length) {
                          if (children[0] == '▍') {
                            return (
                              <span className="animate-pulse cursor-default mt-1">
                                ▍
                              </span>
                            );
                          }

                          children[0] = (children[0] as string).replace(
                            '`▍`',
                            '▍',
                          );
                        }

                        const match = /language-(\w+)/.exec(className || '');
                        // // console.log('call', value, className, match);
                        return !inline ? (
                          <CodeBlock
                            key={Math.random()}
                            language={(match && match[1]) || ''}
                            value={String(children).replace(/\n$/, '')}
                            {...props}
                          />
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      },
                      table({ children }) {
                        return (
                          <table className="border-collapse border border-black px-3 py-1 dark:border-white">
                            {children}
                          </table>
                        );
                      },
                      th({ children }) {
                        return (
                          <th className="break-words border border-black bg-gray-500 px-3 py-1 text-white dark:border-white">
                            {children}
                          </th>
                        );
                      },

                      td({ children }) {
                        return (
                          <td className="break-words border border-black px-3 py-1 dark:border-white">
                            {children}
                          </td>
                        );
                      },
                      samp() {
                        return <HiddenQuestion />;
                      },
                      iframe({ src, title }) {
                        return (
                          <iframe
                            className="w-11/12 aspect-video m-2 md:w-50vw "
                            src={src}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            title={title}
                          />
                        );
                      },
                      div({ children, className }) {
                        return (
                          <CustomComponent
                            {...{
                              children,
                              className,
                              messageIsStreaming,
                              handleOptionSend,
                            }}
                          />
                        );
                      },
                      button({ children, className }) {
                        return (
                          <ChatMessageButton
                            {...{
                              children,
                              handleOptionSend,
                              className,
                              handleSwitchQuestion,
                            }}
                          />
                        );
                      },
                      h1({ children }) {
                        return (
                          <CustomButton {...{ children, handleOptionSend }} />
                        );
                      },
                    }}
                  >
                    {`${message.content}${
                      messageIsStreaming &&
                      messageIndex ==
                        (selectedConversation?.messages.length ?? 0) - 1
                        ? '`▍`'
                        : ''
                    }`}
                  </MemoizedReactMarkdown>
                  <hr className="mt-4 h-0.5 border-t-0 bg-neutral-400 opacity-100 w-full" />
                </div>

                {message.role === 'assistant' && !messageIsStreaming && (
                  <div className="md:-mr-8 md:ml-0 flex flex-col md:flex-row gap-4 md:gap-1 items-center md:items-start justify-end md:justify-start ">
                    <TextToSpeech text={message.content} />
                    {/* {messagedCopied ? (
                      <IconCheck
                        size={20}
                        className="text-green-500 dark:text-green-400"
                      />
                    ) : (
                      <button
                        className="invisible group-hover:visible focus:visible text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        onClick={copyOnClick}
                      >
                        <IconCopy size={20} />
                      </button>
                    )}
                    <button
                      className="invisible group-hover:visible focus:visible text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      onClick={() => setFeedback(!feedback)}
                    >
                      <IconThumbUp size={20} />
                    </button>
                    <button
                      className="invisible group-hover:visible focus:visible text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      onClick={() => setFeedback(!feedback)}
                    >
                      <IconThumbDown size={20} />
                    </button> */}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {feedback && <FeedbackModal {...{ feedback, setFeedback }} />}
      </div>
    );
  },
);
ChatMessage.displayName = 'ChatMessage';
