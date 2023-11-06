import { useState } from 'react';

import CheckAnswerButton from '../Buttons/CheckAnswerButton';

export const ReplaceMentQuestion = ({
  handleQuestionActions,
  questionNum,
}: {
  handleQuestionActions: (
    action: string,
    answer: string,
    questionNum: number,
  ) => 'correct' | 'incorrect' | void;
  questionNum: number;
}) => {
  const [answer, setAnswer] = useState('');
  const [correctBorder, setCorrectBorder] = useState('');
  return (
    <div className="flex flex-col gap-4 m-2">
      <p className="text-[1.5rem]">
        Evaluate the expression 3x² + 4y ÷ z + 2w for x = 7, y = 20, z = 5, and
        w = 3.
      </p>
      <div>
        <label
          htmlFor="answer_box"
          className="block mb-2 text-[1.125rem] font-medium text-gray-900 dark:text-white "
        >
          Enter your answer here
        </label>
        <input
          type="text"
          id="answer_box"
          className={`text-center border text-[1.125rem] leading-[1.5rem] border-[#333] text-gray-900 w-[8rem] px-1 h-[2.5rem] rounded-sm focus:ring-blue-500 focus:border-blue-500
          ${
            correctBorder === 'correct'
              ? 'border-2 border-green-500'
              : correctBorder === 'incorrect'
              ? 'border-2 border-red-500'
              : ''
          }
          `}
          required
          value={answer}
          onChange={(e) => {
            const isValidInput = /^[0-9.]*$/.test(e.target.value);
            isValidInput && setAnswer(e.target.value);
          }}
        />
      </div>
      <div>
        <CheckAnswerButton
          handleClick={() => {
            const val = handleQuestionActions('answer', answer, questionNum);
            if (val && val === 'correct') {
              setCorrectBorder('correct');
            } else setCorrectBorder('incorrect');
          }}
        />
      </div>
    </div>
  );
};
