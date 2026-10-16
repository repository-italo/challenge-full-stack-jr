import type { ZodError } from 'zod';
import { AppError } from './app-error.js';

interface ErrorField {
    field: string;
    message: string;
}

export class ValidationError extends AppError {
    readonly errorFields: ErrorField[];

    constructor(message: string, errorFields: ErrorField[] = []) {
        super(message, 400, 'BAD_REQUEST', true);
        this.errorFields = errorFields;
        Object.setPrototypeOf(this, ValidationError.prototype);
    }

    static fromZodError(zodError: ZodError) {
        const errorFields = zodError.issues.map((error) => ({
            field: error.path.join('.'),
            message: error.message,
        }));

        return new ValidationError('Validation error', errorFields);
    }
}
