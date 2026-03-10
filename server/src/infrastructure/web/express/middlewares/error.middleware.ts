import { ErrorRequestHandler } from "express";
import { HttpError } from "../../../../shared/errors/HttpError";
import { HttpStatus } from "../../../../shared/constants/httpStatus";
import { ILogger } from "../../../../application/interfaces/ILogger";


export const createErrorMiddleware = (logger: ILogger): ErrorRequestHandler => {

    return (err, req, res, next) => {

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

            logger.warn(err.message, {
                statusCode: err.statusCode,
                method: req.method,
                path: req.originalUrl,
                errors: err.details
            })
    
            res.status(err.statusCode).json(response)
            return
        }
    

        // console.error("Unexpected Error:", err);
        // Unknown / unexpected errors
        logger.error("Unexpected server error", {
            message: err.message,
            stack: err.stack,
            method: req.method,
            path: req.originalUrl,
        });
    
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Internal Server Error"})
    }

}