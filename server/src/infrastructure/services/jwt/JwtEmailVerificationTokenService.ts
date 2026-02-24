import { EmailVerificationTokenPayload, IEmailVerificationTokenService } from "../../../application/interfaces/IEmailVerificationTokenService";
import { env } from "../../config/env";
import jwt from "jsonwebtoken";

export class JwtEmailVerificationTokenService implements IEmailVerificationTokenService {
    private secret = env.JWT_ACCESS_SECRET;

    generateEmailVerificationToken(email: string): string {
        return jwt.sign({ email }, this.secret, { expiresIn: '30m' })
    }

    verifyEmailVerificationToken(token: string): EmailVerificationTokenPayload {
        return jwt.verify(token, this.secret) as EmailVerificationTokenPayload
    }
}