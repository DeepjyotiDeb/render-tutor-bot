// export { default, getServerSideProps } from './api/home';
import {
  IconArrowRight,
  IconChevronLeft,
  IconInfoCircleFilled,
  IconMessage,
  IconPaperclip,
} from '@tabler/icons-react';

import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import { useFormattedDate } from '../utils/app/useFormattedDate';

// import StudentDashboard from './../public/images/StudentDashboard.png';

export default function BeginPage() {
  const formattedDate = useFormattedDate();
  return (
    <div
      className={`relative flex flex-col h-screen overflow-hidden bg-white dark:bg-[#343541] w-full`}
    >
      <Head>
        <title>Savvas AI Tutor</title>
      </Head>
      <div
        className="absolute z-10 flex h-full w-screen bg-repeat bg-contain"
        style={{
          backgroundImage: `url(${process.env.NEXT_PUBLIC_AWS_IMAGE}/Group+117.png)`,
        }}
      />
      <div className="h-[8vh] top-0 z-10  flex justify-between border border-b-slate-400 p-2 dark:border-none bg-white ">
        <div className="flex items-center gap-0">
          <IconChevronLeft
            className="row-span-2 place-self-center 2xl:scale-150 mx-3"
            // size={40}
          />
          <div className="flex flex-col leading-[1.15rem] ">
            <p className="font-light text-[0.91rem]">MRS. SMITH&apos;S CLASS</p>
            <p className="font-normal">
              1-1: Practice Buddy: Independent Practice; Problem Solving
            </p>
          </div>
        </div>
        <div className="flex gap-2 items-center mr-4 text-black 2xl:gap-4">
          <div className="w-0.5 bg-slate-400 opacity-100 min-h-[2em]" />
          <div className="flex flex-col leading-5 ">
            <p className="font-light ">DUE</p>
            <p className="font-normal">{formattedDate}</p>
          </div>
          <div className="w-0.5 bg-slate-400 opacity-100 min-h-[2em]" />
          <Image
            alt="message bubble"
            width={100}
            height={100}
            // src="https://elasticbeanstalk-ap-south-1-860768680752.s3.ap-south-1.amazonaws.com/paperclip+icon.svg"
            src={`${process.env.NEXT_PUBLIC_AWS_IMAGE}/information.svg`}
            className="max-h-full w-auto 2xl:scale-150"
          />
          <div className="w-0.5 bg-slate-400 opacity-100 min-h-[2em]" />
          {/* <IconPaperclip /> */}
          <Image
            alt="paper clip"
            width={100}
            height={100}
            // src="https://elasticbeanstalk-ap-south-1-860768680752.s3.ap-south-1.amazonaws.com/paperclip+icon.svg"
            src={`${process.env.NEXT_PUBLIC_AWS_IMAGE}/paperclip+icon.svg`}
            className="max-h-full w-auto 2xl:scale-150"
          />
          <div className="w-0.5 bg-slate-400 opacity-100 min-h-[2em]" />
          <Image
            alt="message bubble"
            width={100}
            height={100}
            // src="https://elasticbeanstalk-ap-south-1-860768680752.s3.ap-south-1.amazonaws.com/paperclip+icon.svg"
            src={`${process.env.NEXT_PUBLIC_AWS_IMAGE}/messageBubble.svg`}
            className="max-h-full w-auto 2xl:scale-150"
          />
        </div>
      </div>
      <div className="m-auto w-1/2 h-1/3 border-[5.5px] border-green-300 text-white bg-black z-10 flex px-8">
        <div className="m-auto px-3">
          <p className="text-base 2xl:text-[1.5rem]">
            Complete each question (using paper and pencil) and click on the
            helper cards if you get stuck. Ready to start?
          </p>
          <button className="text-white bg-[#006BE0] border border-[#006BE0] focus:outline-none hover:bg-gray-100 hover:text-[#006BE0] disabled:bg-neutral-300 disabled:text-slate-500 disabled:border-gray-200 focus:ring-4 focus:ring-gray-200 font-medium rounded-md pl-2 pr-1 py-1.5 items-center mr-2 mt-3 2xl:mt-8 mx-auto">
            <Link href="/savvy" className="flex">
              <p>Start</p>
              <IconArrowRight />
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
}
