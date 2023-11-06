namespace NodeJS {
  interface ProcessEnv extends NodeJS.ProcessEnv {
    MONGO_DB_URI: string;
    NEXT_PUBLIC_AWS_IMAGE: string;
  }
}
