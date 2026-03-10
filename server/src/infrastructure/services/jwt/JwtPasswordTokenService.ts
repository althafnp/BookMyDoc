import jwt from "jsonwebtoken";
import { IPasswordTokenService, PasswordTokenPayload } from "../../../application/interfaces/IPasswordTokenService";
import { env } from "../../config/env";
import { injectable } from "inversify";


@injectable()
export class JwtPasswordTokenService implements IPasswordTokenService {
    private secret = env.JWT_ACCESS_SECRET;

    generatePasswordResetToken(email: string): string {
        return jwt.sign({ email }, this.secret, { expiresIn: '30m' })
    };

    verifyPasswordResetToken(token: string): PasswordTokenPayload {
        return jwt.verify(token, this.secret) as PasswordTokenPayload
    }
}