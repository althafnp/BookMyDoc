import { HttpStatus } from "../constants/httpStatus";
import { FieldError } from "../utils/ApiResponse";


export class HttpError extends Error {
    constructor(
        public statusCode: number,
        message: string,
        public details?: FieldError[] // Only used for auth
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
    constructor(message = "Bad Request", details?: FieldError[]) {
        super(HttpStatus.BAD_REQUEST, message, details);
    }
}

// 401
export class UnauthorizedError extends HttpError {
    constructor(message = "Unauthorized", details?: FieldError[]) {
        super(HttpStatus.UNAUTHORIZED, message, details);
    }
}

// 403
export class ForbiddenError extends HttpError {
    constructor(message = "Forbidden", details?: FieldError[]) {
        super(HttpStatus.FORBIDDEN, message, details);
    }
}

// 404
export class NotFoundError extends HttpError {
    constructor(message = "Resource not found", details?: FieldError[]) {
        super(HttpStatus.NOT_FOUND, message, details);
    }
}

// 409
export class ConflictError extends HttpError {
    constructor(message = "Conflict") {
        super(HttpStatus.CONFLICT, message);
    }
}