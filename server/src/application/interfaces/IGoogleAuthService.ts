export interface GoogleAuthPayload {
    googleId: string;
    email: string;
    name: string;
    picture?: string;
    emailVerified: boolean;
}

export interface IGoogleAuthService {
    verifyIdToken(token: string): Promise<GoogleAuthPayload>
}