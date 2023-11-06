import { FC, useContext } from 'react';

import HomeContext from '@/pages/api/home/home.context';

const StartConversation: FC = () => {
  const {
    // state: { topicChanged },
    dispatch,
  } = useContext(HomeContext);
  const startConversation = () => {
    dispatch({ field: 'startConvo', value: true });
    // // console.log('log', topicChanged);
  };
  return (
    <button
      className="text-sidebar flex flex-shrink-0 cursor-pointer select-none items-center justify-center gap-3 bg-[#023ce9] rounded-3xl border border-white/20 p-3  transition-colors duration-200 hover:bg-[#0845fd] mt-5 w-[40%] m-auto font-semibold"
      onClick={startConversation}
    >
      Start
    </button>
  );
};

export default StartConversation;
