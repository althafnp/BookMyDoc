export type FieldError = {
    field: string;
    message: string;
};

export class ApiResponse<T = unknown> {
    constructor(
        public success: boolean,
        public message: string,
        public data?: T,
        public errors?: FieldError[]
    ) { }

    // Success response
    static success<T>(message: string, data?: T) {
        return new ApiResponse<T>(true, message, data);
    }

    // Failure response
    // errors ONLY used for auth validation
    static failure(message: string, errors?: FieldError[]) {
        return new ApiResponse<never>(false, message, undefined, errors);
    }
}
