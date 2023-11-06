import { Types, connect, connection, set } from 'mongoose';

let isConnected: number;

export const connectToDB = async (): Promise<number> => {
  if (isConnected) return isConnected;
  set('strictQuery', true);
  const { connection } = await connect(process.env.MONGO_DB_URI);
  isConnected = connection.readyState;
  // console.log('connection', isConnected);

  return isConnected;
};

export const objectId = async (
  id: string | Types.ObjectId,
): Promise<Types.ObjectId> => {
  return new Types.ObjectId(id);
};

export const disconnectFromDB = async (): Promise<void> => {
  try {
    await connection.close();
    // console.log('Disconnected from the database');
  } catch (error) {
    console.error(error);
  }
};
