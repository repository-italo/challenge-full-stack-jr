import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';
import { ValidationError } from '../errors/validation-error.js';

type ValidateSource = 'body' | 'params' | 'query';

function removeUndefinedValues(obj: Record<string, unknown>): Record<string, unknown> {
    return Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined));
}

export function createValidator(schema: ZodSchema, source: ValidateSource = 'body') {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req[source];
            const validatedData = schema.parse(data);
            const cleanedData = removeUndefinedValues(validatedData as Record<string, unknown>);

            if (!res.locals) {
                res.locals = {};
            }

            res.locals[source] = cleanedData;
            next();
        } catch (error) {
            if (error instanceof Error && 'errors' in error) {
                next(ValidationError.fromZodError(error as any));
            } else {
                next(error);
            }
        }
    };
}
