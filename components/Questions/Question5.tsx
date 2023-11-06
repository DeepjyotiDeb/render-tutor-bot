import { useState } from 'react';

import CheckAnswerButton from '../Buttons/CheckAnswerButton';

export const Question5 = ({
  handleQuestionActions,
}: {
  handleQuestionActions: (
    action: string,
    answer: string,
    questionNum: number,
  ) => 'correct' | 'incorrect' | void;
}) => {
  const [selectedOption, setSelectedOption] = useState('');
  const [correctBorder, setCorrectBorder] = useState('');

  const options = [
    { label: '87b − 180 + 957 ÷ 87', value: '87b - 180 + 957 ÷ 87' },
    { label: '33b', value: '33b' },
    { label: 'b² + 120', value: 'b² + 120' },
    { label: '51b − 24', value: '51b - 24' },
    { label: '11b + 187 − 2,756 ÷ 13', value: '11b + 187 - 2,756 ÷ 13' },
  ];

  return (
    <div className="flex flex-col">
      <p className="text-[1.5rem] mb-[1.75rem]">
        Select the expression that have a value of 180 when b = 4
      </p>
      <div className="flex flex-col gap-[1.625rem]">
        {options.map((option) => (
          <div
            key={option.value}
            className="flex items-center space-x-2 font-md"
            // onClick={() => setSelectedOption(option.value)}
          >
            <input
              type="radio"
              id={`option_${option.value}`}
              name="options"
              value={option.value}
              checked={selectedOption === option.value}
              className={`text-[1.125rem] h-[20px] w-[20px] hover:cursor-pointer`}
              // className={`text-base h-[20px] w-[20px] ${
              //   selectedOption === option.value && correctBorder === 'correct'
              //     ? 'accent-green-500 border-2 border-green-500 bg-green-500'
              //     : selectedOption === option.value &&
              //       correctBorder === 'incorrect'
              //     ? 'accent-red-500'
              //     : ''
              // }`}
              // onChange={() => {}}
              onChange={() => setSelectedOption(option.value)}
              // className="hidden"
            />
            <label
              htmlFor={`option_${option.value}`}
              className="ml-2 text-[1.25rem] leading-[1.5rem] text-gray-900 dark:text-white"
            >
              {option.label}
            </label>
            {/* <label
              htmlFor={`option_${option.value}`}
              className={`${
                selectedOption === option.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-900 dark:bg-gray-700 dark:text-white'
              } hover:bg-blue-400 hover:text-white transition-colors duration-300 rounded-md px-4 py-2 cursor-pointer`}
            >
              {option.label}
            </label> */}
          </div>
        ))}
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
            const val = handleQuestionActions('answer', selectedOption, 4);
            if (val && val === 'correct') {
              setCorrectBorder('correct');
            } else setCorrectBorder('incorrect');
          }}
        />
      </div>
    </div>
  );
};
