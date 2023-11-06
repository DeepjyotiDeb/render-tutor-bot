import { useContext, useState } from 'react';

import HomeContext from '../../pages/api/home/home.context';

import CheckAnswerButton from '../Buttons/CheckAnswerButton';

export const Question1 = ({
  handleQuestionActions,
}: {
  handleQuestionActions: (
    action: string,
    answer: string,
    questionNum: number,
  ) => 'correct' | 'incorrect' | void;
}) => {
  const [answer, setAnswer] = useState('');
  const [correctBorder, setCorrectBorder] = useState('');
  return (
    <div className="flex flex-col">
      <p className="text-[1.3rem] leading-[1.5rem] mb-2">
        Evaluate the expression:
      </p>
      <div className="flex align-center gap-[1rem] items-center mb-11">
        <span>
          {' '}
          <p className="text-[1.5rem] leading-[2rem]">5x = </p>
        </span>

        <input
          type="text"
          id="answer_box"
          className={`text-[1.5rem] leading-[2rem] text-center border border-[#333] text-gray-900 w-[3.75rem] px-1 h-[2.5rem] rounded-sm focus:ring-blue-500 focus:border-blue-500 ${
            correctBorder === 'correct'
              ? 'border-2 border-green-500'
              : correctBorder === 'incorrect'
              ? 'border-2 border-red-500'
              : ''
          }`}
          required
          value={answer}
          onChange={(e) => {
            const isValidInput = /^[0-9.]*$/.test(e.target.value);
            isValidInput && setAnswer(e.target.value);
          }}
        />
        <span className="text-[1.5rem] leading-[2rem]">when x = 6</span>
      </div>
      <p className="text-[1.125rem] leading-[1.5rem]">
        Enter your answer in the box.
      </p>
      <div className="mt-9">
        <CheckAnswerButton
          handleClick={() => {
            const val = handleQuestionActions('answer', answer, 0);
            if (val && val === 'correct') {
              setCorrectBorder('correct');
            } else setCorrectBorder('incorrect');
          }}
        />
      </div>
    </div>
  );
};
