import 'dotenv/config';
import 'reflect-metadata';

import express from 'express';

import { configureServer } from './config/express';

(async () => {
  const port = process.env.SERVER_PORT;
  const app = express();

  const server = await configureServer(app);

  server.listen(port, () => console.log(`Server is running on port ${port}`));
})().catch((error) => {
  console.error(error);
});
