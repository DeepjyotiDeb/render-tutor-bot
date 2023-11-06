import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // // console.log('req', req.body);
    const response = await fetch(
      'https://xf4vg5gice.execute-api.ap-south-1.amazonaws.com/dev/search/video',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      },
    );
    // // console.log('json response', response);
    let newVal = await response.json();
    // // console.log('awaited response', newVal);
    return res.status(200).json({ ...newVal });
  } catch (error) {
    // console.log('error', error);
    return res.status(400).json({ answer: 'api threw an error' });
  }
};

export default handler;
