import { useState } from 'react';

import CheckAnswerButton from '../Buttons/CheckAnswerButton';

export const Question3 = ({
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
      {/* <p className="text-[1.125rem] leading-[1.5rem] mb-2">
        Find the value of the expression 4d ÷ c + 3 when c = 3 and d = 6.
      </p> */}
      <div className="flex flex-wrap align-center gap-[1rem] items-center">
        <span>
          {' '}
          <p className="text-[1.5rem] leading-[2rem]">
            The expression 4d ÷ c + 3 =
          </p>
        </span>

        <input
          type="text"
          id="answer_box"
          className={`text-center text-[1.5rem] leading-[2rem] border border-[#333] text-gray-900 w-[3.75rem] px-1 h-[2.5rem] rounded-sm focus:ring-blue-500 focus:border-blue-500
          ${
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
        <span className="text-[1.5rem] leading-[2rem]">
          when c = 3 and d = 6
        </span>
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
            const val = handleQuestionActions('answer', answer, 2);
            if (val && val === 'correct') {
              setCorrectBorder('correct');
            } else setCorrectBorder('incorrect');
          }}
        />
      </div>
    </div>
  );
};
