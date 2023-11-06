import { CardSvg } from './CardSvg';

export const QuestionCards = ({
  handleQuestionActions,
  expand,
}: {
  handleQuestionActions: (args: string) => void;
  expand: string;
}) => {
  const cards = [
    { cardText: 'Watch a video', cardValue: 'videoCard' },
    { cardText: 'View an example', cardValue: 'exampleCard' },
    { cardText: 'Get a hint', cardValue: 'hintCard' },
    { cardText: 'Make It Real', cardValue: 'realCard' },
  ];
  return (
    // <div className="relative w-full h-full overflow-hidden col-span-2">
    <div
      className={`flex mx-auto mb-0 absolute bottom-[5%] left-1/2 -translate-x-[50%] z-20`}
    >
      {cards.map((item) => (
        <div
          key={item.cardValue}
          className="w-[95px] h-[112px] cursor-pointer group perspective hover:-translate-y-14 duration-700"
        >
          <div className="relative preserve-3d group-hover:my-rotate-y-180 w-full h-full duration-300">
            <div className="absolute backface-hidden w-full h-full">
              <CardSvg className="" />
            </div>
            <div
              className="absolute my-rotate-y-180 backface-hidden border border-gray-300 rounded-md w-full h-full overflow-hidden bg-white"
              onClick={() => {
                handleQuestionActions(item.cardValue);
              }}
            >
              <div className="select-none text-center flex flex-col items-center justify-center w-full h-full px-2">
                <p>{item.cardText}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
      {/* <div className="w-32 h-16 relative"> */}
      {/* <div className="w-1/4 h-full rounded-full bg-blue-500 absolute left-0 top-1/4 clip-half flex">
          <div
            className="w-[95px] h-[112px] cursor-pointer group perspective hover:-translate-y-14
          hover:-translate-x-14 duration-700"
          >
            <div className="relative preserve-3d group-hover:my-rotate-y-180 w-full h-full duration-300 scale-50">
              <div className="absolute backface-hidden w-full h-full">
                <CardSvg className="" />
              </div>
              <div
                className="absolute my-rotate-y-180 backface-hidden border border-gray-300 rounded-md w-full h-full overflow-hidden bg-white"
                onClick={() => {
                  handleQuestionActions('get video');
                }}
              >
                <div className="select-none text-center flex flex-col items-center justify-center h-full px-2">
                  <p>Get a video</p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-[95px] h-[112px] cursor-pointer group perspective hover:-translate-y-14 duration-700">
            <div className="relative preserve-3d group-hover:my-rotate-y-180 w-full h-full duration-300 scale-50">
              <div className="absolute backface-hidden w-full h-full">
                <CardSvg className="" />
              </div>
              <div
                className="absolute my-rotate-y-180 backface-hidden border border-gray-300 rounded-md w-full h-full overflow-hidden bg-white"
                onClick={() => {
                  handleQuestionActions('get video');
                }}
              >
                <div className="select-none text-center flex flex-col items-center justify-center h-full px-2">
                  <p>Get a video</p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-[95px] h-[112px] cursor-pointer group perspective hover:-translate-y-14 duration-700">
            <div className="relative preserve-3d group-hover:my-rotate-y-180 w-full h-full duration-300 scale-50">
              <div className="absolute backface-hidden w-full h-full">
                <CardSvg className="" />
              </div>
              <div
                className="absolute my-rotate-y-180 backface-hidden border border-gray-300 rounded-md w-full h-full overflow-hidden bg-white"
                onClick={() => {
                  handleQuestionActions('get video');
                }}
              >
                <div className="select-none text-center flex flex-col items-center justify-center h-full px-2">
                  <p>Get a video</p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-[95px] h-[112px] cursor-pointer group perspective hover:-translate-y-14 duration-700">
            <div className="relative preserve-3d group-hover:my-rotate-y-180 w-full h-full duration-300 scale-50">
              <div className="absolute backface-hidden w-full h-full">
                <CardSvg className="" />
              </div>
              <div
                className="absolute my-rotate-y-180 backface-hidden border border-gray-300 rounded-md w-full h-full overflow-hidden bg-white"
                onClick={() => {
                  handleQuestionActions('get video');
                }}
              >
                <div className="select-none text-center flex flex-col items-center justify-center h-full px-2">
                  <p>Get a video</p>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      {/* </div> */}
    </div>
    // </div>
  );
};
