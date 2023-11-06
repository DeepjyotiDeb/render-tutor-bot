import { IconThumbDownFilled, IconThumbUpFilled } from '@tabler/icons-react';
import { FC, memo, useMemo } from 'react';

import Image from 'next/image';

interface Props {
  children: any;
  className: string | undefined;
  handleOptionSend: (value: any) => void;
  messageIsStreaming: boolean;
}

export const CustomComponent: FC<Props> = memo(
  ({ children, className, handleOptionSend, messageIsStreaming }) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // const randomNum = useMemo(() => {
    //   if (className === 'incorrect') return Math.random() < 0.5 ? 1 : 2;
    // }, [className]);

    if (className === 'answer') return <></>;
    if (className === 'que') {
      return <div className="text-2xl font-semibold flex-wrap">{children}</div>;
    }
    if (className === 'thumbs') {
      return (
        <div className="ml-2 flex gap-1">
          <button
            className="border border-black rounded-md hover:bg-black hover:text-white"
            onClick={() => {
              let sentMsg = ['I liked the content'];
              handleOptionSend(sentMsg);
            }}
          >
            <IconThumbUpFilled size={50} />
          </button>
          <button
            className="border border-black rounded-md hover:bg-black hover:text-white"
            onClick={() => {
              let sentMsg = ['I did not like the content'];
              handleOptionSend(sentMsg);
            }}
          >
            <IconThumbDownFilled size={50} />
          </button>
        </div>
      );
    }
    if (className === 'correct') {
      return (
        <div className="correct">
          <Image
            alt="correct_ocotocat"
            width={400}
            height={400}
            src={`${process.env.NEXT_PUBLIC_AWS_IMAGE}/octocat-correct-oneloop.gif`}
            unoptimized
            className="h-full w-auto"
          />
        </div>
      );
    }
    if (className === 'incorrect') {
      if (messageIsStreaming)
        return (
          <div className="text-white font-light">
            <span className="animate-pulse cursor-default mt-1 text-white">
              ▍
            </span>
            loading image...
          </div>
        );
      const imageName =
        (Math.random() < 0.5 ? 1 : 2) === 1
          ? 'tryAgainOctoOneloop'
          : 'incorrectOctoOneloop';
      return (
        <div className="incorrect">
          <Image
            alt="incorrect_ocotocat"
            width={400}
            height={400}
            src={`${process.env.NEXT_PUBLIC_AWS_IMAGE}/${imageName}.gif`}
            className="h-full w-auto"
            unoptimized
          />
        </div>
      );
    }
    // const imageName =
    //   randomNum === 1 ? 'tryAgainOctoOneloop' : 'incorrectOctoOneloop';
    if (className === 'video-1') {
      if (messageIsStreaming) {
        return (
          <div className="text-white font-light">
            <span className="animate-pulse cursor-default mt-1 text-white">
              ▍
            </span>
            loading video...
          </div>
        );
      }
      return (
        <div className="video">
          <video controls className="w=11/12">
            <source
              src={`${process.env.NEXT_PUBLIC_AWS_IMAGE}/savvas_study_1.mp4`}
              type="video/mp4"
            />
          </video>
        </div>
      );
    }
    if (className === 'video-2') {
      if (messageIsStreaming) {
        return (
          <div className="text-white font-semibold">
            <span className="animate-pulse cursor-default mt-1 text-white">
              ▍
            </span>
            loading video...
          </div>
        );
      }
      return (
        <div className="video">
          <video controls className="w=11/12">
            <source
              src={`${process.env.NEXT_PUBLIC_AWS_IMAGE}/savvas_study_2.mp4`}
              type="video/mp4"
            />
          </video>
          {/* <iframe
            className="w-11/12 aspect-video"
            src="https://www.youtube.com/embed/WJqw-cxvKgo"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            title=""
          /> */}
        </div>
      );
    }
    return children;
  },
);

CustomComponent.displayName = 'CustomComponent';
