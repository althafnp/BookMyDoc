import { OAuth2Client } from "google-auth-library";
import { env } from "../../config/env";
import { GoogleAuthPayload, IGoogleAuthService } from "../../../application/interfaces/IGoogleAuthService";
import { injectable } from "inversify";


@injectable()
export class GoogleOAuthService implements IGoogleAuthService {
    private client = new OAuth2Client(env.GOOGLE_CLIENT_ID);


    async verifyIdToken(token: string): Promise<GoogleAuthPayload> {
        const ticket = await this.client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        })

        const payload = ticket.getPayload();
        if (!payload) throw new Error('Invalid Google token');

        return {
            googleId: payload.sub,
            email: payload.email!,
            name: payload.name!,
            picture: payload.picture,
            emailVerified: payload.email_verified ?? false
        }
    }
}