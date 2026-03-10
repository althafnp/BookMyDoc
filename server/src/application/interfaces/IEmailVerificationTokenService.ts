export interface EmailVerificationTokenPayload {
    email: string
}

export interface IEmailVerificationTokenService {
    generateEmailVerificationToken(email: string): string;
    verifyEmailVerificationToken(token: string): EmailVerificationTokenPayload
}