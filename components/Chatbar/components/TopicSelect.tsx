import { IconExternalLink } from '@tabler/icons-react';
import { useContext, useState } from 'react';

import { useTranslation } from 'next-i18next';

import { DEFAULT_SYSTEM_PROMPT, DEFAULT_TEMPERATURE } from '@/utils/app/const';
import { SetCustomPrompt } from '@/utils/app/customPrompt';
import { saveFolders } from '@/utils/app/folders';

import { OpenAIModel, OpenAIModels } from '@/types/openai';
import { Prompt } from '@/types/prompt';

import HomeContext from '@/pages/api/home/home.context';

import { v4 as uuidv4 } from 'uuid';

const ageList = ['9', '10', '11', '12'];
const sportsList = ['pro football', 'basketball', 'baseball', 'esports'];
const topicList = [
  'Decimal notation for fractions',
  'Metric Unit conversions',
  'Multiplication',
];

interface SelectField {
  topic: string;
  age: string;
  sport: string;
}
export const TopicSelect = () => {
  const { t } = useTranslation('chat');

  const {
    state: {
      selectedConversation,
      models,
      defaultModelId,
      prompts,
      promptContent,
      folders,
    },
    handleUpdateConversation,
    dispatch: homeDispatch,
  } = useContext(HomeContext);
  const [selectField, setSelectField] = useState<SelectField>({
    age: '9',
    sport: 'basketball',
    topic: 'addition',
  });

  //based on topic ? prompt should be changed
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // homeDispatch({ field: 'topic', value: e.target.value });
    selectedConversation &&
      handleUpdateConversation(selectedConversation, {
        key: 'model',
        value: models.find(
          (model) => model.id === e.target.value,
        ) as OpenAIModel,
      });
  };

  const handleClearConversations = () => {
    defaultModelId &&
      homeDispatch({
        field: 'selectedConversation',
        value: {
          id: uuidv4(),
          name: t('New Conversation'),
          messages: [],
          model: OpenAIModels[defaultModelId],
          prompt: promptContent ?? DEFAULT_SYSTEM_PROMPT,
          temperature: DEFAULT_TEMPERATURE,
          folderId: null,
        },
      });

    homeDispatch({ field: 'conversations', value: [] });

    localStorage.removeItem('conversationHistory');
    localStorage.removeItem('selectedConversation');

    const updatedFolders = folders.filter((f) => f.type !== 'chat');

    homeDispatch({ field: 'folders', value: updatedFolders });
    saveFolders(updatedFolders);
  };

  const handleTopicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // // console.log('target', selectedConversation?.prompt);
    setSelectField((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    const updatedContent = SetCustomPrompt({
      ...selectField,
      [e.target.name]: e.target.value,
    });
    // // console.log('new prompt', updatedContent);
    homeDispatch({ field: 'promptContent', value: updatedContent });

    if (defaultModelId) {
      const newPrompt: Prompt = {
        id: uuidv4(),
        name: `Prompt ${prompts.length + 1}`,
        description: '',
        content: updatedContent,
        model: OpenAIModels[defaultModelId],
        folderId: null,
      };

      // const updatedPrompts = [...prompts, newPrompt];

      homeDispatch({ field: 'prompts', value: [newPrompt] });

      // savePrompts(updatedPrompts);
      // console.log('prompt saved', { prompts });
      defaultModelId &&
        homeDispatch({
          field: 'selectedConversation',
          value: {
            id: uuidv4(),
            name: t('New Conversation'),
            messages: [],
            model: OpenAIModels[defaultModelId],
            prompt: updatedContent ?? DEFAULT_SYSTEM_PROMPT,
            temperature: DEFAULT_TEMPERATURE,
            folderId: null,
          },
        });

      homeDispatch({ field: 'conversations', value: [] });

      localStorage.removeItem('conversationHistory');
      localStorage.removeItem('selectedConversation');

      const updatedFolders = folders.filter((f) => f.type !== 'chat');

      homeDispatch({ field: 'folders', value: updatedFolders });
      saveFolders(updatedFolders);
    }
    // homeDispatch({
    //   field: 'selectedConversation',
    //   value: {
    //     id: uuidv4(),
    //     name: t('New Conversation'),
    //     messages: [],
    //     model: {
    //       id: OpenAIModels['gpt-3.5-turbo'].id,
    //       name: OpenAIModels['gpt-3.5-turbo'].name,
    //       maxLength: OpenAIModels['gpt-3.5-turbo'].maxLength,
    //       tokenLimit: OpenAIModels['gpt-3.5-turbo'].tokenLimit,
    //     },
    //     prompt: customPrompts[e.target.value as keyof Calculation].prompt,
    //     temperature: DEFAULT_TEMPERATURE,
    //     folderId: null,
    //   },
    // });
  };

  return (
    <>
      <div className="flex flex-col  border-t border-white/20 pb-2 mt-2">
        <label className="my-2 text-left text-neutral-700 text-neutral-400 text-[14px] ">
          {t('Select a topic')}
        </label>
        <div className="w-full  border border-neutral-200 bg-white pr-2 text-neutral-900 border-neutral-600 ">
          <select
            className="w-full bg-transparent p-2"
            placeholder={t('Select a topic') || ''}
            value={selectField.topic}
            onChange={handleTopicChange}
            name="topic"
          >
            {topicList.map((keyname) => (
              <option key={keyname} value={keyname} className="bg-[#fff]">
                {keyname}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex flex-col  border-t border-white/20 pb-2 mt-2">
        <label className="my-2 text-left text-neutral-700 text-neutral-400 text-[14px] ">
          {t('Your Age')}
        </label>
        <div className="w-full  border border-neutral-200 bg-white pr-2 text-neutral-900 border-neutral-600 ">
          <select
            className="w-full bg-transparent p-2"
            placeholder={t('Select age') || ''}
            value={selectField.age}
            onChange={handleTopicChange}
            name="age"
          >
            {ageList.map((keyname) => (
              <option key={keyname} value={keyname} className="bg-[#ffffff]">
                {keyname}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex flex-col  border-t border-white/20 pb-2 mt-2">
        <label className="my-2 text-left text-neutral-700 text-neutral-400 text-[14px] ">
          {t('What Do You Like')}
        </label>
        <div className="w-full  border border-neutral-200 bg-white pr-2 text-neutral-900 border-neutral-600 ">
          <select
            className="w-full bg-transparent p-2"
            placeholder={t('Select a Sport') || ''}
            value={selectField.sport}
            onChange={handleTopicChange}
            name="sport"
          >
            {sportsList.map((keyname) => (
              <option key={keyname} value={keyname} className="bg-[#fff]">
                {keyname}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
};
