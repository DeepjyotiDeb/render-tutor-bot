import {
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
  IconPlayerStopFilled,
} from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';

const symbolMap: { [key: string]: string } = {
  '+': 'plus',
  '-': 'minus',
  '*': 'times',
  '/': 'divided by',
  '=': 'equals',
  '^': 'raised to the power of',
  // '(': 'open parenthesis',
  // ')': 'close parenthesis',
};

export const TextToSpeech = ({ text }: { text: string }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(
    null,
  );

  useEffect(() => {
    const synth = window.speechSynthesis;
    const parsedText = textParse(text);
    // console.log('parsed text: ', parsedText);
    const u = new SpeechSynthesisUtterance(parsedText);
    setUtterance(u);
    return () => {
      synth.cancel();
    };
  }, [text]);

  // useEffect(() => console.log({ isPaused }), [isPaused]);
  const handlePlay = () => {
    const synth = window.speechSynthesis;
    if (isPaused) {
      synth.resume();
    }
    if (utterance) {
      const voices = synth.getVoices();
      console.log('first', voices);
      const googleVoiceIndex = voices.findIndex(
        (voice) => voice.name === 'Google US English',
      );
      utterance.voice = voices[googleVoiceIndex];
      synth.speak(utterance);
    }
    setIsPaused(false);
  };

  const handlePause = () => {
    const synth = window.speechSynthesis;
    synth.pause();
    setIsPaused(true);
  };

  const handleStop = () => {
    const synth = window.speechSynthesis;
    synth.cancel();
    setIsPaused(false);
  };

  const textParse = (inputString: string) => {
    const parsedText = inputString.replace(
      /<\/?[^>]*>|[+\-*/=^()]/g,
      (match) => {
        if (symbolMap[match]) return symbolMap[match];
        if (match.charAt(0) === '<') return '';
        return match;
      },
    );
    return parsedText;
  };

  return (
    <div className="flex flex-col w-[2.2rem] gap-2">
      <button
        onClick={handlePlay}
        className="group-hover:visible focus:visible text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
      >
        {/* {isPaused ? 'Resume' : 'Play'} */}
        <IconPlayerPlayFilled />
      </button>
      <button
        onClick={handlePause}
        className="group-hover:visible focus:visible text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
      >
        <IconPlayerPauseFilled />
      </button>
      <button
        onClick={handleStop}
        className="group-hover:visible focus:visible text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
      >
        <IconPlayerStopFilled />
      </button>
    </div>
  );
};
