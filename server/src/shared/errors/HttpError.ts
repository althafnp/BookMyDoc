import { HttpStatus } from "../constants/httpStatus";
import { AuthFieldError } from "../utils/ApiResponse";


export class HttpError extends Error {
    constructor(
        public statusCode: number,
        message: string,
        public details?: AuthFieldError[] // Only used for auth
    ) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}

/* ===============================
   Specific HTTP Errors
================================ */

// 400
export class BadRequestError extends HttpError {
    constructor(message = "Bad Request", details?: AuthFieldError[]) {
        super(HttpStatus.BAD_REQUEST, message, details);
    }
}

// 401
export class UnauthorizedError extends HttpError {
    constructor(message = "Unauthorized") {
        super(HttpStatus.UNAUTHORIZED, message);
    }
}

// 404
export class NotFoundError extends HttpError {
    constructor(message = "Resource not found") {
        super(HttpStatus.NOT_FOUND, message);
    }
}

// 409
export class ConflictError extends HttpError {
    constructor(message = "Conflict") {
        super(HttpStatus.CONFLICT, message);
    }
}