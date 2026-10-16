export abstract class AppError extends Error {
    constructor(
        readonly message: string,
        readonly statusCode: number,
        readonly status: string,
        readonly isOperational: boolean,
    ) {
        super(message);
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
