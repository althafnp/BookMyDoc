export interface PasswordTokenPayload {
    email: string
}

export interface IPasswordTokenService {
    generatePasswordResetToken(email: string): string;
    verifyPasswordResetToken(token: string): PasswordTokenPayload
}