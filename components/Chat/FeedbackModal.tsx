import { Dispatch, FC, SetStateAction, useState } from 'react';

interface Props {
  feedback: boolean;
  setFeedback: (value: boolean) => void;
}

export const FeedbackModal: FC<Props> = ({ feedback, setFeedback }) => {
  const [text, setText] = useState('');
  const [checkboxes, setCheckboxes] = useState({
    option1: false,
    option2: false,
    option3: false,
  });

  const onClose = () => {
    setFeedback(!feedback);
  };

  const handleTextareaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setText(event.target.value);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checkboxName = event.target.name;
    setCheckboxes({
      ...checkboxes,
      [checkboxName]: event.target.checked,
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // console.log('Feedback:', feedback);
    // console.log('Checkboxes:', checkboxes);
    // You can perform further actions with the feedback and checkboxes here
    onClose();
  };

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    if (target.classList.contains('modal-overlay')) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 modal-overlay"
      onClick={handleOverlayClick}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-1/2">
        <h2 className="text-xl font-semibold mb-4">Feedback Form</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="feedbackTextarea" className="block font-medium mb-2">
            Your Feedback
          </label>
          <textarea
            id="feedbackTextarea"
            className="w-full border border-gray-300 p-2 rounded-md"
            rows={5}
            value={text}
            onChange={handleTextareaChange}
          />
          <div className="mt-4 space-y-2">
            <label className="flex items-center space-x-2 gap-1">
              <input
                type="checkbox"
                name="option1"
                className="h-5 w-5"
                checked={checkboxes.option1}
                onChange={handleCheckboxChange}
              />
              Option 1
            </label>
            <label className="flex items-center space-x-2 gap-1">
              <input
                type="checkbox"
                name="option2"
                className="h-5 w-5"
                checked={checkboxes.option2}
                onChange={handleCheckboxChange}
              />
              Option 2
            </label>
            <label className="flex items-center space-x-2 gap-1">
              <input
                type="checkbox"
                name="option3"
                className="h-5 w-5"
                checked={checkboxes.option3}
                onChange={handleCheckboxChange}
              />
              Option 3
            </label>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};
