import { Request, Response, NextFunction } from "express";
import { Role } from "../../../../domain/enums/Auth";
import { IAuthTokenService } from "../../../../application/interfaces/IAuthTokenService";
import { ForbiddenError, UnauthorizedError } from "../../../../shared/errors/HttpError";
import { container } from "../../../../di/inversify.config";
import { TYPES } from "../../../../di/types";

const authTokenService = container.get<IAuthTokenService>(TYPES.IAuthTokenService);

export const authenticate = (allowedRoles: Role[]) => (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedError("Access token is missing");
        }

        const token = authHeader.split(" ")[1];

        const decoded = authTokenService.verifyAccessToken(token);

        if (!allowedRoles.includes(decoded.role)) {
            throw new ForbiddenError("You do not have permission to access this resource");
        }

        req.user = {
            id: decoded.id,
            role: decoded.role
        };

        next();
    } catch (err) {
        next(err);
    }
};
