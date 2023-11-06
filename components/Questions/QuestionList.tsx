/* eslint-disable react-hooks/exhaustive-deps */
import {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';

import { STIX_Two_Text } from 'next/font/google';
import Image from 'next/image';

import { replacementQuestion } from '../../utils/app/questionArray';

import HomeContext from '../../pages/api/home/home.context';

import { Question1 } from './Question1';
import { Question2 } from './Question2';
import { Question3 } from './Question3';
import { Question4 } from './Question4';
import { Question5 } from './Question5';
import { Question6 } from './Question6';
import { Question7 } from './Question7';
import { Question8 } from './Question8';
import { Question9 } from './Question9';
// import { QuestionCards } from './QuestionCard/QuestionCards';
import { ReplaceMentQuestion } from './ReplacementQuestion';

type Props = {
  // questionNumber: number;
  handleQuestionActions: (
    action: string,
    answer?: string,
    questionNum?: number,
  ) => 'correct' | 'incorrect' | void;
  correctAnimation: boolean;
  setCorrectAnimation: (val: boolean) => void;
};
export interface QuestionListRef {
  switchQuestionComponent: () => void;
}

export const QuestionList = forwardRef<QuestionListRef, Props>(
  ({ handleQuestionActions, correctAnimation, setCorrectAnimation }, ref) => {
    const Questions = [
      <Question1 key="1" {...{ handleQuestionActions }} />,
      <Question2 key="2" {...{ handleQuestionActions }} />,
      <Question3 key="3" {...{ handleQuestionActions }} />,
      <Question4 key="4" {...{ handleQuestionActions }} />,
      <Question5 key="5" {...{ handleQuestionActions }} />,
      <Question6 key="6" {...{ handleQuestionActions }} />,
      <Question7 key="7" {...{ handleQuestionActions }} />,
      <Question8 key="8" {...{ handleQuestionActions }} />,
      <Question9 key="9" {...{ handleQuestionActions }} />,
    ];
    const [questionComponents, setQuestionComponents] =
      useState<JSX.Element[]>(Questions);

    const {
      state: { questionList, questionNumber },
    } = useContext(HomeContext);

    // const [gifKey, setGifKey] = useState(0);
    useEffect(() => {
      if (correctAnimation) {
        // console.log('animate', gifKey);
        // setGifKey(gifKey + 1);
        setTimeout(() => {
          // console.log('running');
          setCorrectAnimation(false);
        }, 4000);
      }
    }, [correctAnimation]);
    // // console.log('first', questionNumber % Questions.length);
    const switchQuestionComponent = () => {
      const updatedComponents = [...questionComponents];
      const updatedQuestions = [...questionList];
      updatedQuestions[questionNumber] = replacementQuestion;
      updatedComponents[questionNumber] = (
        <ReplaceMentQuestion
          {...{ handleQuestionActions, questionNum: questionNumber }}
        />
      );
      setQuestionComponents(updatedComponents);
      // Questions[questionNumber] = (
      //   <ReplaceMentQuestion {...{ handleQuestionActions }} />
      // );
      // dispatch({ field: 'questionList', value: updatedQuestions });
    };

    useImperativeHandle(ref, () => ({
      switchQuestionComponent,
    }));

    return (
      <div className="relative flex flex-col justify-between h-full w-full text-black bg-white shadow-md shadow-slate-600/50">
        <div className="flex bg-grey h-full">
          <div
            className={`flex-1 py-[4.875rem] px-[3.375rem] overflow-auto z-30 h-full `}
          >
            {questionComponents[questionNumber % Questions.length]}
            {/* {SwitchComponent(questionNumber)} */}
          </div>
          {/* <button className="p-2 bg-blue-300" onClick={switchQuestionComponent}>
            Switch
          </button> */}
          {correctAnimation && (
            <div className="w-1/2 absolute right-0 top-1/4 ">
              <Image
                alt="correct_ocotocat"
                width={400}
                height={400}
                // src={`${process.env.NEXT_PUBLIC_AWS_IMAGE}/octocat-correct-oneloop.gif?key=${gifKey}`}
                src={`${process.env.NEXT_PUBLIC_AWS_IMAGE}/CorrectOctoRainbow.gif`}
                key=""
                unoptimized
                className={`${
                  correctAnimation ? ' w-auto my-auto' : 'w-0 h-auto'
                } transition-all duration-500 absolute top-[50%] -translate-y-1/2`}
              />
            </div>
          )}
        </div>
        {/* <QuestionCards {...{ handleQuestionActions }} /> */}
      </div>
    );
  },
);

QuestionList.displayName = 'QuestionList';
