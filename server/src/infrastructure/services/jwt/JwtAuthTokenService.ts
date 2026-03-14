import { AuthTokenPayload, IAuthTokenService } from "../../../application/interfaces/IAuthTokenService";
import jwt from "jsonwebtoken"
import { env } from "../../config/env";
import { injectable } from "inversify";


@injectable()
export class JwtAuthTokenService implements IAuthTokenService{
    private _accessSecret = env.JWT_AUTH_ACCESS_SECRET;
    private _refreshSecret = env.JWT_AUTH_REFRESH_SECRET;


    generateAccessToken(payload: AuthTokenPayload): string {
        return jwt.sign(payload, this._accessSecret, { expiresIn: '15m' })
    }

    verifyAccessToken(token: string): AuthTokenPayload {
        return jwt.verify(token, this._accessSecret) as AuthTokenPayload;
    }


    generateRefreshToken(payload: AuthTokenPayload): string {
        return jwt.sign(payload, this._refreshSecret, { expiresIn: '7d' });
    }

    verifyRefreshToken(token: string): AuthTokenPayload {
        return jwt.verify(token, this._refreshSecret) as AuthTokenPayload;
    }
}

