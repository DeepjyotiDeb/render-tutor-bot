import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDB } from '../../utils/data/db';

import { LogTable } from '../../models/LogTable';

import {
  CreateDeliveryStreamCommand,
  FirehoseClient,
} from '@aws-sdk/client-firehose';
import * as AWS from 'aws-sdk';

interface RequestBody {
  sessionId: string;
  messageNumber: number;
  message: any;
  actor: string;
  context: string;
  timestampid: Date;
}

const handler = async (
  req: NextApiRequest & { body: RequestBody },
  res: NextApiResponse,
) => {
  try {
    // // console.log('request from frontend', req.body);
    // AWS.config.update({
    //   region: 'ap-south-1', // e.g., 'us-west-2'
    //   // accessKeyId: process.env.AWS_ID_PER,
    //   accessKeyId: process.env.AWS_ID_MITHILESH,
    //   // secretAccessKey: process.env.AWS_KEY_PER,
    //   secretAccessKey: process.env.AWS_KEY_MIT,
    // });
    // const firehose = new AWS.Firehose();
    // const params = {
    //   // DeliveryStreamName: 'PUT-S3-zPY7b',
    //   DeliveryStreamName: 'PUT-S3-Xuxyt',
    //   Record: {
    //     Data: JSON.stringify(req.body),
    //   },
    // };
    // const response = await firehose.putRecord(params).promise();
    // // console.log('data', response);

    // const { actor, context, message, messageNumber, sessionId, timestampid } =
    // req.body as RequestBody;
    try {
      const body = req.body;
      try {
        await connectToDB();
      } catch (error) {
        // console.log('connection error');
      }
      // // console.log('before table create');
      const newSession = await LogTable.create({
        sessionid: body.sessionid,
        messagenumber: body.messagenumber,
        promptid: body.promptid,
        message: body.message,
        actor: body.actor,
        context: body.context,
        timestampid: body.timestampid,
      });
      // // console.log('new session', newSession);
      if (!newSession) {
        return res.status(400).json({
          message: 'unable to create session',
        });
      }
    } catch (error) {
      // // console.log('error inserting', error);
    }
    return res.status(200).json({ sent: 'sent', request: req.body });
  } catch (error) {
    // console.log('error', error);
    return res.status(200).json({ answer: 'api threw an error', error });
  }
};

export default handler;
