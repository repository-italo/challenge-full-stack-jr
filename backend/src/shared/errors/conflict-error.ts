import { AppError } from './app-error.js';

export class ConflictError extends AppError {
    constructor(message: string = 'Conflict') {
        super(message, 409, 'CONFLICT', true);
        Object.setPrototypeOf(this, ConflictError.prototype);
    }
}
