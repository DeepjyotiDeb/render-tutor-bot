import { MutableRefObject } from 'react';

import { logResponse } from './logResponse';

interface CustomRequest {
  contentType: string;
  query: string;
}

// interface CustomResponse {}

export const parseText = async (
  text: string,
  msgCount: MutableRefObject<number>,
): Promise<string | boolean> => {
  //   const pattern = /<samp>.*?<\/samp>/;

  const cleanUp = (match: RegExpMatchArray) => {
    const cleanedJSONString: CustomRequest[] = JSON.parse(match[1]);
    if (cleanedJSONString) {
      try {
        return cleanedJSONString[0];
      } catch (error) {
        console.error('Error parsing JSON:', error);
        return null;
      }
    } else {
      return null;
    }
  };

  // const sleep = (ms: number) => {
  //   return new Promise((resolve) => setTimeout(resolve, ms));
  // };

  const getApiVideo = async (val: CustomRequest) => {
    try {
      const controller = new AbortController();
      const response = await fetch('api/video-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify(val),
      });
      return await response.json();
    } catch (error) {
      // console.log(error);
      return 'error';
    }
  };

  const getApiQuestion = async (val: CustomRequest) => {
    try {
      const controller = new AbortController();
      const response = await fetch('api/question-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify(val),
      });
      return await response.json();
    } catch (error) {
      // console.log(error);
      return 'error';
    }
  };

  const embedQuestion = (obj: any) => {
    //   const question = 'What is a string?';
    // // console.log('obj', obj);
    msgCount.current += 1;
    logResponse(obj.question, 'api/question', msgCount);
    if (obj?.queType === 'multiple choice questions') {
      // const arrlist = ['one', 'two', 'three'];
      const optionsList = obj.options.map(
        (option: string) => `<button className="button-option">${option}</div>`,
      );
      return (
        `<div className="que">${obj.question}</div> ` +
        optionsList +
        `<div className="answer">${obj.answer}</div>`
      );
    }
    return `<div className="que">${obj.question}</div> <div className="answer">${obj.answer}</div>`;
  };

  const embedVideo = (obj: any) => {
    msgCount.current += 1;
    logResponse(obj.url, 'api/video', msgCount);
    if (obj.url.includes('youtube')) {
      return `<iframe
        src="${obj.url}?&autoplay=1"
        title="${obj.title}"
      ></iframe>`;
    }
    return `<video controls id="tutorial-video" className="w-11/12 aspect-video p-4" autoplay>
  <source src="${obj.url}#t=${obj.startingTime}" title="${obj.title}" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  type="video/mp4"
  allowFullScreen/>
  Sorry, your browser doesn't support embedded videos
  </video>`;
  };

  const regex = /<samp>(.*?)<\/samp>/s;
  const match = text.match(regex);
  try {
    if (match && match.length >= 2) {
      const val = cleanUp(match);
      // // console.log('extracted content: ', val);
      if (val && val.contentType === 'video') {
        try {
          const response = await getApiVideo(val);
          //   // console.log('response from search', response);
          if (response?.contentType === 'video') {
            const htmlVideo = embedVideo(response);
            const newEmbedVideo = text.replace(regex, htmlVideo);
            return newEmbedVideo;
          }
          if (response === 'error') {
            return text.replace(regex, 'Failed to retrieve video 😔');
          }
        } catch (error) {
          // console.log(error);
        }
      }
      if (val && val.contentType === 'question') {
        try {
          const response = await getApiQuestion(val);
          //   // console.log('response from search', response);
          if (response?.contentType === 'question') {
            const htmlQuestion = embedQuestion(response);
            // // console.log('question embeded', htmlQuestion);
            return text.replace(regex, htmlQuestion);
            // const newEmbedVideo = text.replace(regex, htmlQuestion);
            // return newEmbedVideo;
          }
          if (response === 'error') {
            return text.replace(regex, 'Failed to retrieve question 😔');
          }
        } catch (error) {
          // console.log(error);
        }
      }
    }
  } catch (error) {
    // console.log(error);
    throw new Error('Error while embedding');
  }

  return false;
};

//req structure => { query: string } //{ query: "find me addition video/question ?" }
//res=> { type: video, url: "http://youtube", title: "a VERY brief summary of the video" }
//res=> { type: question, question: "a question" }
