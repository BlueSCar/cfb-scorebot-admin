import { NextFunction, Request, Response } from 'express';
import { decode } from 'next-auth/jwt';

const authSecret = process.env.AUTH_SECRET;
const BEARER_PATTERN = /^Bearer (.+)/;

export default async (
  request: Request,
  // @ts-ignore
  response: Response,
  next: NextFunction,
) => {
  try {
    const authorization = request.headers.authorization;
    if (!authorization) {
      throw new Error('Authorization header is missing');
    }

    const match = BEARER_PATTERN.exec(authorization);
    if (!match) {
      throw new Error('Authorization header is not a Bearer token');
    }

    const token = match[1];
    const decoded = await decode({
      secret: authSecret || '',
      token,
    });

    if (!decoded) {
      throw new Error('Invalid token');
    }

    // @ts-ignore
    request.user = decoded;
    request.isAuthenticated = true;
  } catch (error) {
    request.isAuthenticated = false;
  }

  next();
};
