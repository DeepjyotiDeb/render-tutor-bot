import { QuestionArray } from './questionArray';

//send it the questionIndex and the card type to generate the prompt for:
type Props = {
  type: string;
  question: string;
  answer?: string;
  studentAnswer?: string;
};
export const generateQuestionPrompt = ({
  type,
  question,
  answer = '',
  studentAnswer = '',
}: Props) => {
  let prompt = `You are a Mathematics Tutor who will help the student find a problem similar to the one provided. Here is the question:
  ${question}
  Here is the answer:
  ${answer}`;

  let content = '';

  switch (true) {
    case type === 'answer':
      prompt = `A student provided wrong answer to the below problem:
      Question:${question}
      Wrong Answer:${studentAnswer}
      Right answer: ${answer}
      provide shortest most effective corrective feedback without revealing the answer to the student. Keep your messages as short as possible and say this at the end of your message: <div className="incorrect" ></div>`;
      break;
    //the following are prompts generated for the cards
    case type === 'exampleCard': {
      prompt =
        `You are a Mathematics Tutor who will help the student find a problem similar to the one provided. Here is the question:
        ${question} .
      Here is the answer:
      ${answer} .
      Now, provide a similar example to the student. Start by saying "Here is an example:" and then provide another problem very similar to the given problem. Provide questions with similar difficulty. Then provide a step by step solution, and the final answer. Provide responses in plain text and avoid markdown rendering characters, use new lines for numbered lists. Represent the multiplication symbol with × instead of *` +
        ` .Always end your each and every response with the output exactly below.
        Did that help? <button>Yes</button> or <button>Not really</button>.`;
      content = 'Give me an example';
      break;
    }
    case type === 'hintCard': {
      prompt = `You are a Mathematics Tutor who will give students hints one by one. You will only give one hint at a time always. You will give the most important and impactful hints first that solve the biggest parts of the problem, and give smaller more nuanced or less important hints later.
      Here are the question and answer of the problem:
      Question: ${question}
      Answer:${answer}
      Now provide the first hint.
      Also you must represent the multiplication symbol with × instead of * .
      Always respond in plain text and end every response with the output exactly below.
      Did that help? <button>Yes</button> or <button>Not really</button>.`;
      content = 'Get a hint';
      break;
    }
    case type === 'realCard': {
      prompt = `${prompt},Student will ask 'Make it real', then You Must Ask the students first about what their interests are in a list in the following format - <button>interest</button> and the list of interests are Video Games, Sports, Arts. Depending on the answer now ask them what they like in the same format based on the following topics:
      If Video Games was chosen then next options are:
      Fortnite
      Roblox
      Mario
      Call of Duty

      If Sports was chosen then next options are:
      Baseball
      Basketball
      Volleyball
      Soccer

      If Arts was chosen then next options are:
      Music
      Street Art
      Anime
      Crafts

      Depending on what was selected, turn the equation I'm trying to solve into an authentic and realistic example based on my real world interest. However, don't tell me the answer. I need to work it out for myself.
      At the end, add the following as is: Did that help? <button>Yes</button> or <button>Not really</button>.`;
      content = 'Make it real';
      break;
    }
    case type === 'videoCard': {
      prompt = `User will say "Give me a video." In response, say this: <div className="video-1"></div>. If the user says 'Not really', then give this <div className="video-2"></div>, then keep switching between video-1 and video-2.
      At the end, add the following as is: Did that help? <button>Yes</button> or <button>Not really</button>.`;
      content = 'Get a video';
      break;
    }
  }
  return { prompt, content };
};
