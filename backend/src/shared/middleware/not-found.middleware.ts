import type { NextFunction, Request, Response } from 'express';
import { NotFoundError } from '../errors/index.js';

export function notFoundHandler(req: Request, _res: Response, next: NextFunction) {
    const message = `Route ${req.method} ${req.path} not found`;
    next(new NotFoundError(message));
}
