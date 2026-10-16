import type { NextFunction, Request, Response } from 'express';
import { AppError, ValidationError } from '../errors/index.js';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
    if (err instanceof ValidationError) {
        return res.status(err.statusCode).json({
            error: err.status,
            statusCode: err.statusCode,
            message: err.message,
            errorFields: err.errorFields,
        });
    }

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            error: err.status,
            statusCode: err.statusCode,
            message: err.message,
        });
    }

    res.status(500).json({
        error: 'INTERNAL_SERVER_ERROR',
        statusCode: 500,
        message: 'Internal server error',
    });
}
