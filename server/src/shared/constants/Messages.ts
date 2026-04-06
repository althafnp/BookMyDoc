// ================================
// Error Messages
// ================================

export const VALIDATION = {
    VALIDATION_FAILED: "Validation failed",
} as const;


export const AUTH_ERRORS = {
    INVALID_CREDENTIALS: "Invalid credentials",
    INCORRECT_PASSWORD: "Incorrect password",
    INVALID_GOOGLE_TOKEN: "Invalid Google token",
    INVALID_OR_EXPIRED_TOKEN: "Invalid or expired verification token",
    ACCESS_TOKEN_MISSING: "Access token is missing",
    REFRESH_TOKEN_MISSING: "Refresh token is missing, Login again",
    INVALID_REFRESH_TOKEN: "Invalid refresh token",
    PERMISSION_NOT_ACCESSIBLE: "You do not have permission to access this resource",
    GOOGLE_SIGN_IN_REQUIRED: "This account uses Google sign-in, Continue with Google",
    VERIFY_EMAIL_TO_LOGIN: "Verify your email to log in",
    EMAIL_ALREADY_VERIFIED: "Email is already verified",
} as const;


export const USER_ERRORS = {
    USER_NOT_FOUND: "User not found",
    EMAIL_ALREADY_EXISTS: "User with this email already exists",
    USER_BLOCKED: "User is currently blocked",
} as const;


export const ADMIN_ERRORS = {
    ADMIN_NOT_FOUND: "Admin not found",
} as const;


export const DOCTOR_ERRORS = {
    DOCTOR_NOT_FOUND: "Doctor not found",
    EMAIL_NOT_FOUND: "Email not found",
    DOCTOR_ALREADY_EXISTS: "A doctor with this email already exists",
    AVAILABILITY_NOT_FOUND: "Doctor availability not found",
} as const;


export const WALLET_ERRORS = {
    CREDIT_AMOUNT_INVALID: "Credit amount must be greater than zero",
    DEBIT_AMOUNT_INVALID: "Debit amount must be greater than zero",
    INSUFFICIENT_BALANCE: "Insufficient wallet balance",
} as const;


export const CATEGORY_ERRORS = {
    CATEGORY_NOT_FOUND: "Category not found",
    CATEGORY_ALREADY_EXISTS: "A category with this name already exists",
} as const;



// ================================
// Success Messages (Controller Responses)
// ================================

export const AUTH_SUCCESS = {
    REGISTRATION_SUCCESSFUL: "Registration successful",
    EMAIL_VERIFIED: "Email verified successfully, login to access account",
    USER_LOGGED_IN: "User logged in successfully",
    GOOGLE_LOGIN: "User logged in with Google",
    LOGGED_OUT: "Logged out successfully",
    TOKEN_REFRESHED: "Token refreshed",
    ADMIN_LOGGED_IN: "Admin logged in",
    DOCTOR_LOGGED_IN: "Doctor logged in",
    PASSWORD_RESET_EMAIL_SENT: "If the email is registered, a password reset link has been sent to your email",
    PASSWORD_RESET_SUCCESSFUL: "Password reset successful",
    VERIFICATION_EMAIL_SENT: "If an account exists, a verification email has been sent"
} as const;


export const CATEGORY_SUCCESS = {
    CATEGORY_CREATED: "Category created successfully",
    CATEGORIES_FETCHED: "Categories fetched successfully",
    CATEGORY_UPDATED: "Category updated successfully",
    CATEGORY_STATUS_TOGGLED: "Category status toggled successfully",
} as const;


export const DOCTOR_SUCCESS = {
    DOCTOR_CREATED: "Doctor created successfully",
    DOCTORS_FETCHED: "Doctors fetched successfully",
    DOCTOR_UPDATED: "Doctor updated successfully",
    DOCTOR_STATUS_TOGGLED: "Doctor status toggled successfully",
} as const;


// ================================
// Logger Messages
// ================================

export const LOG_MESSAGES = {
    USER_REGISTERED: "User registered successfully",
    USER_LOGGED_IN: "User logged in",
    USER_LOGGED_IN_GOOGLE: "User logged in using Google auth",
    USER_VERIFIED: "User verified successfully",
    ADMIN_LOGGED_IN: "Admin logged in",
    DOCTOR_LOGGED_IN: "Doctor logged in",
    PASSWORD_CHANGED: "Password changed successfully",
    CATEGORY_CREATED: "New category created",
    CATEGORY_UPDATED: "Category updated",
    CATEGORY_STATUS_TOGGLED: "Category status toggled",
    DOCTOR_CREATED: "New doctor created",
    DOCTOR_UPDATED: "Doctor updated",
    DOCTOR_STATUS_TOGGLED: "Doctor status toggled",
} as const;



// ================================
// Server/Unexpected Messages
// ================================

export const SERVER_ERRORS = {
    UNEXPECTED_ERROR: "Unexpected server error",
    SERVER_ERROR: "Internal Server Error"
};