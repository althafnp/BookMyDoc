import { Role } from "../../domain/enums/Auth";

export interface AuthTokenPayload {
    id: string;
    role: Role
}

export interface IAuthTokenService {
    generateAccessToken(payload: AuthTokenPayload): string;
    verifyAccessToken(token: string): AuthTokenPayload;

    generateRefreshToken(payload: AuthTokenPayload): string
    verifyRefreshToken(token: string): AuthTokenPayload;
}