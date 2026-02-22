import { ErrorRequestHandler } from "express";
import { HttpError } from "../../../../shared/errors/HttpError";
import { HttpStatus } from "../../../../shared/constants/httpStatus";


export const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {

    if(err instanceof HttpError) {
        console.log('from middleware', err)
        const response: any = {
            success: false,
            message: err.message,
        };

        // Field-level validation errors (auth)
        if (err.details && err.details.length > 0) {
            response.errors = err.details;
        }

        res.status(err.statusCode).json(response)
        return
    }

    // Unknown / unexpected errors
    console.error("Unexpected Error:", err);

    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Internal Server Error"})
}