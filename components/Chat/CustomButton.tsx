import {
  IconArrowAutofitUp,
  IconArrowDown,
  IconArrowUp,
} from '@tabler/icons-react';
import { FC, memo, useState } from 'react';

interface Props {
  children: any;
  handleOptionSend: (children: any) => void;
}

export const CustomButton: FC<Props> = memo(
  ({ handleOptionSend, children }) => {
    const [show, setShow] = useState<Boolean>(false);
    if (children.includes('Show me a video')) {
      // console.log('children', JSON.stringify(children[0]));
      return (
        <div className="flex flex-col my-2 gap-2 w-full">
          <div>
            <button
              className="rounded border-blue-600 border-2 bg-white px-4 text-blue-600 p-0 hover:opacity-80 dark:border-neutral-600 m-2"
              onClick={() => setShow(!show)}
            >
              {show ? (
                <div className="flex items-center">
                  Hide
                  <IconArrowUp />
                </div>
              ) : (
                <div className="flex items-center">
                  Show me a video
                  <IconArrowDown />
                </div>
              )}
            </button>
          </div>
          {show && (
            <iframe
              className="w-11/12 aspect-video"
              src="https://www.youtube.com/embed/dNSrfoYLQZU"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              title="3-Digit by 2-Digit Multiplication | Math with Mr. J"
            />
          )}
        </div>
      );
    }
    return (
      <button
        className="rounded border-blue-600 border-2 bg-white px-3 text-blue-600 p-0 hover:opacity-80 m-2"
        onClick={() => handleOptionSend(children)}
      >
        {children}
      </button>
    );
  },
);
CustomButton.displayName = 'CustomButton';
