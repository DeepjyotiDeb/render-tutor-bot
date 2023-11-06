import { FC, memo } from 'react';

type Props = {
  children: any;
  className: string | undefined;
  handleOptionSend: (value: any) => void;
  handleSwitchQuestion: () => void;
};

export const ChatMessageButton: FC<Props> = memo(
  ({ children, className, handleOptionSend, handleSwitchQuestion }) => {
    if (className === 'switch-question') {
      // // console.log('children', children);
      return (
        <button
          className="switch-question rounded border-white border-2 bg-blue-600 px-3 text-white p-0 hover:opacity-80 m-2"
          onClick={handleSwitchQuestion}
        >
          Switch Question
        </button>
      );
    }
    // if (className === 'button-option') {
    const option =
      typeof children[0] === 'string'
        ? [children[0].replace(/,\s*$/, '')]
        : children;
    // // console.log('children', children);
    return (
      <button
        className="button-option rounded border-white border-2 bg-blue-600 px-3 text-white p-0 hover:opacity-80 m-2"
        onClick={() => handleOptionSend(option)}
      >
        {option}
      </button>
    );
    // }

    // return (
    //   <button className="button-option rounded border-white border-2 bg-blue-600 px-3 text-white p-0 hover:opacity-80 m-2">
    //     {children}
    //   </button>
    // );
  },
);

ChatMessageButton.displayName = 'ChatMessageButton';
