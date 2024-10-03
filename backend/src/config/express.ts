import { Application } from 'express';

import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';

import auth from './auth';

import cfbRoutes from '../app/cfb/routes';
import discordRoutes from '../app/discord/routes';
import { ExpressUser } from './types/express';

declare global {
  namespace Express {
    interface Request {
      isAuthenticated?: boolean;
      user?: ExpressUser;
    }
  }
}

export const configureServer = async (
  app: Application,
): Promise<Application> => {
  app.enable('trust proxy');

  app.use(helmet());
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  if (process.env.NODE_ENV === 'development') {
    app.use(cors());
  } else {
    app.use(
      cors({
        origin: process.env.FRONTEND_URL,
      }),
    );
  }

  app.use(auth);

  cfbRoutes(app);
  await discordRoutes(app);

  return app;
};
