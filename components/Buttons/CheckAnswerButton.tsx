import React from 'react';

interface CheckAnswerButtonProps {
  handleClick: () => void;
}

const CheckAnswerButton: React.FC<CheckAnswerButtonProps> = ({
  handleClick,
}) => {
  return (
    <button
      type="button"
      onClick={() => handleClick()}
      className="font-sans text-white text-center bg-[#006BE0] border border-[#006BE0] focus:outline-none hover:bg-gray-100 hover:text-[#006BE0] disabled:bg-neutral-300 disabled:text-slate-500 disabled:border-gray-200 focus:ring-4 focus:ring-gray-200 rounded w-[8.125rem] text-[1rem] leading-[1.5rem] h-9 flex items-center justify-center "
    >
      Check Answer
    </button>
  );
};

export default CheckAnswerButton;
