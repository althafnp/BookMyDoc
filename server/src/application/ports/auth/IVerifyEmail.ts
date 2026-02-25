export interface IVerifyEmail {
    execute(token: string): Promise<void>;
}