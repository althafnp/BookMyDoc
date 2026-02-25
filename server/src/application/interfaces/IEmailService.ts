
export interface IEmailService {
    sendVerificationEmail(email: string, link: string): Promise<void>;
}