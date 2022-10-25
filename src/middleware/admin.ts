import { NextFunction, Request, Response } from 'express';

import { UnauthorizedError } from '../errors';

export default async (req: Request, res: Response, next: NextFunction) => {
  if (res.locals.user.is_admin) {
    next();
  } else {
    throw new UnauthorizedError('Not an admin');
  }
};
