import { useState } from 'react';

import CheckAnswerButton from '../Buttons/CheckAnswerButton';

export const Question4 = ({
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
      <p className="text-[1.5rem] leading-[2.3rem] mb-[1.5rem]">
        Mr. Parker wants to rent a cargo van for a day. It will cost the daily
        fee of $50 plus $0.35 per mile driven.
      </p>
      {/* <p className="text-[1.125rem] leading-[1.5rem] mb-[1.5rem]">
        Part A <br /> Let m = the number of miles Mr. Parker drives for the day.
        Choose the expression that shows the amount he will pay for the van.
      </p>
      <div className="grid grid-cols-2 mb-[1.5rem] gap-y-[1.5rem] gap-x-[2.25rem] w-fit">
        <div className="text-[1.125rem] leading-[1.5rem]">
          A. 50<i>m</i> + 0.35
        </div>{' '}
        <div className="text-[1.125rem] leading-[1.5rem]">
          B. 0.35 + <i>m</i> + 50
        </div>{' '}
        <div className="text-[1.125rem] leading-[1.5rem]">
          C. <i>m</i>(0.35 + 50)
        </div>{' '}
        <div className="text-[1.125rem] leading-[1.5rem]">
          D. 50 + 0.35<i>m</i>
        </div>
      </div>{' '} */}
      <p className="text-[1.5rem] leading-[2.3rem] mb-[1.5rem]">
        {' '}
        {/* Part B <br />
        Evaluate the expression you wrote to find the amount Mr. Parker will pay
        if he drives 80 miles. Enter your answer in the box. */}
        Find the amount Mr. Parker will pay if he drives 80 miles. Enter your
        answer in the box.
      </p>
      <p className="text-[1.125rem]">Enter your answer inside the box</p>
      <div className="flex align-center gap-[0.25rem] items-center">
        <span>
          {' '}
          <p className="text-[1.125rem] leading-[1.5rem]">$</p>
        </span>

        <input
          type="text"
          id="answer_box"
          className={`text-center text-[1.35rem] border border-[#333] text-gray-900 w-[7.5rem] px-1 h-[2.5rem] rounded-sm focus:ring-blue-500 focus:border-blue-500
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
            const val = handleQuestionActions('answer', answer, 3);
            if (val && val === 'correct') {
              setCorrectBorder('correct');
            } else setCorrectBorder('incorrect');
          }}
        />
      </div>
    </div>
  );
};
