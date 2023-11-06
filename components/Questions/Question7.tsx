import { useState } from 'react';

import CheckAnswerButton from '../Buttons/CheckAnswerButton';

export const Question7 = ({
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
      <p className="text-[1.5rem] leading-[1.5rem] mb-[1.875rem]">
        Evaluate the expression x² + 3x for x = 1.7
      </p>
      <p className="text-[1.125rem]">Enter your answer in the box. </p>
      <div className="flex align-center gap-[1rem] items-center">
        <input
          type="text"
          id="answer_box"
          className={`border border-[#333] text-gray-900 text-xl text-center h-11 px-1 w-[8rem] rounded-sm focus:ring-blue-500 focus:border-blue-500  ${
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
      </div>
      <div className="mt-9">
        {/* <button
          type="button"
          onClick={() => handleQuestionActions('answer', answer)}
          className="text-white text-center bg-[#006BE0] border border-[#006BE0] focus:outline-none hover:bg-gray-100 hover:text-[#006BE0] disabled:bg-neutral-300 disabled:text-slate-500 disabled:border-gray-200 focus:ring-4 focus:ring-gray-200 font-medium rounded w-[8.125rem] text-[1rem] leading-[1.5rem] h-9 flex items-center justify-center "
        >
          Check Answer
        </button> */}
        <CheckAnswerButton
          handleClick={() => {
            const val = handleQuestionActions('answer', answer, 6);
            if (val && val === 'correct') {
              setCorrectBorder('correct');
            } else setCorrectBorder('incorrect');
          }}
        />
      </div>
    </div>
  );
};
