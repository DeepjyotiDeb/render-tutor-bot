import {
  IconCheck,
  IconCircle,
  IconCircleCheckFilled,
  IconCircleMinus,
  IconCircleXFilled,
} from '@tabler/icons-react';
import { FC, memo, useContext, useMemo } from 'react';

import Image from 'next/image';

import HomeContext from '../../pages/api/home/home.context';

type Props = {
  // score: string[];
};
export const ScoreCard: FC<Props> = memo(() => {
  const {
    state: { scoreList: score },
  } = useContext(HomeContext);
  const totalScore = useMemo(
    () => score.filter((answer) => answer === 'correct').length,
    [score],
  );
  const percentage = useMemo(() => {
    const correct = score.filter((answer) => answer === 'correct').length;
    return Math.round((correct / score.length) * 100 * 100) / 100;
  }, [score]);

  const result = useMemo(() => {
    return score.map((item, i) => {
      if (item === 'correct') {
        return {
          questionText: `Question ${i + 1}`,
          value: 'Correct',
          score: '1 out of 1 point',
        };
      }
      if (item === 'incorrect') {
        return {
          questionText: `Question ${i + 1}`,
          value: 'Incorrect',
          score: '0 out of 1 point',
        };
      }
      return {
        questionText: `Question ${i + 1}`,
        value: 'Unanswered',
        score: '0 out of 1 point',
      };
    });
  }, [score]);

  return (
    <div className="text-black w-full bg-white z-20 h-full flex flex-col gap-5 p-4 px-10 relative">
      <div className="h-1/4 text-xl font-semibold flex flex-col gap-1 z-10">
        <p>Score Summary</p>
        <div className="text-white bg-black border-2 border-green-400 w-1/2 h-full">
          <div className="mx-auto flex gap-2 justify-center items-center h-full font-bold text-xl">
            <p>Score</p>
            <p>{percentage}%</p>
            <p>
              ({totalScore}/{score.length})
            </p>
          </div>
        </div>
      </div>
      <div className="w-full z-10">
        <p className="text-xl font-semibold">Questions</p>
        <div className="grid grid-rows-5 grid-flow-col gap-4 w-full mt-2">
          {result.map((item, i) => (
            <div
              key={i}
              className="grid grid-cols-3 place-items-center w-full border-2 border-gray-300 py-2 "
            >
              <p className="text-blue-700 underline text-center ">
                {item.questionText}
              </p>
              {item.value === 'Correct' ? (
                <div className="text-green-600 flex items-center justify-center gap-1 ">
                  <IconCircleCheckFilled />
                  <p>{item.value}</p>
                </div>
              ) : item.value === 'Incorrect' ? (
                <div className="text-red-500 flex items-center justify-center gap-1 ">
                  <IconCircleXFilled /> <p>{item.value}</p>
                </div>
              ) : (
                <div className="text-gray-500 flex items-center justify-center gap-1 ">
                  <IconCircleMinus /> <p>{item.value}</p>
                </div>
              )}
              <p className="text-center">{item.score}</p>
            </div>
          ))}
        </div>
      </div>
      {/* {percentage > 50 && ( */}
      <div className="absolute w-auto h-full right-0 top-1/2 -translate-y-1/2">
        <Image
          alt="quiz-complete"
          height={100}
          width={100}
          src={`${process.env.NEXT_PUBLIC_AWS_IMAGE}/quiz-complete.gif`}
          unoptimized
          className="w-auto h-full"
        />
      </div>
      {/* )} */}
    </div>
  );
});

ScoreCard.displayName = 'ScoreCard';
