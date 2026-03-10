
export interface IEmailService {
    sendVerificationEmail(email: string, link: string): Promise<void>;

    sendPasswordResetVerificationEmail(email: string, link: string): Promise<void>
}