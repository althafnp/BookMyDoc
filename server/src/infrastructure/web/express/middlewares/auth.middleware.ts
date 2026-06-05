import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Role } from "../../../../domain/enums/Auth";
import { IAuthTokenService } from "../../../../application/interfaces/IAuthTokenService";
import { ForbiddenError, UnauthorizedError } from "../../../../shared/errors/HttpError";
import { container } from "../../../../di/inversify.config";
import { TYPES } from "../../../../di/types";
import { AUTH_ERRORS } from "../../../../shared/constants/Messages";

const authTokenService = container.get<IAuthTokenService>(TYPES.IAuthTokenService);

export const authenticate = (allowedRoles: Role[]) => (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedError(AUTH_ERRORS.ACCESS_TOKEN_MISSING);
        }

        const token = authHeader.split(" ")[1];

        const decoded = authTokenService.verifyAccessToken(token);

        if (!allowedRoles.includes(decoded.role)) {
            throw new ForbiddenError(AUTH_ERRORS.PERMISSION_NOT_ACCESSIBLE);
        }

        req.user = {
            id: decoded.id,
            role: decoded.role
        };

        next();
    } catch (err) {
        if (err instanceof jwt.JsonWebTokenError) {
            return next(new UnauthorizedError(AUTH_ERRORS.INVALID_ACCESS_TOKEN));
        }

        if (err instanceof jwt.TokenExpiredError) {
            return next(new UnauthorizedError(AUTH_ERRORS.TOKEN_EXPIRED));
        }
        next(err);
    }
};
