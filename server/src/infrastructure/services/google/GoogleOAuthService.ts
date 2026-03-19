import { OAuth2Client } from "google-auth-library";
import { env } from "../../config/env";
import { GoogleAuthPayload, IGoogleAuthService } from "../../../application/interfaces/IGoogleAuthService";
import { injectable } from "inversify";
import { AUTH_ERRORS } from "../../../shared/constants/Messages";


@injectable()
export class GoogleOAuthService implements IGoogleAuthService {
    private _client = new OAuth2Client(env.GOOGLE_CLIENT_ID);


    async verifyIdToken(token: string): Promise<GoogleAuthPayload> {
        const ticket = await this._client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        if (!payload) throw new Error(AUTH_ERRORS.INVALID_GOOGLE_TOKEN);

        return {
            googleId: payload.sub,
            email: payload.email!,
            name: payload.name!,
            picture: payload.picture,
            emailVerified: payload.email_verified ?? false
        };
    }
}