export type AuthFieldError = {
    field: "email" | "password" | "confirmPassword";
    message: string;
};

export class ApiResponse<T = unknown> {
    constructor(
        public success: boolean,
        public message: string,
        public data?: T,
        public errors?: AuthFieldError[]
    ) { }

    // Success response
    static success<T>(message: string, data?: T) {
        return new ApiResponse<T>(true, message, data);
    }

    // Failure response
    // errors ONLY used for auth validation
    static failure(message: string, errors?: AuthFieldError[]) {
        return new ApiResponse<null>(false, message, undefined, errors);
    }
}
