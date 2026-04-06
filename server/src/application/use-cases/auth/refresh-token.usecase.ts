import { inject, injectable } from "inversify";
import { AUTH_ERRORS, USER_ERRORS } from "../../../shared/constants/Messages";
import { UnauthorizedError } from "../../../shared/errors/HttpError";
import { RefreshTokenResponseDTO } from "../../dtos/auth/auth.dto";
import { IAuthTokenService } from "../../interfaces/IAuthTokenService";
import { IUserLookupService } from "../../interfaces/IUserLookupService";
import { IRefreshTokenUseCase } from "../../ports/auth/IRefreshTokenUseCase";
import { TYPES } from "../../../di/types";

@injectable()
export class RefreshTokenUseCase implements IRefreshTokenUseCase {
    constructor(
        @inject(TYPES.IAuthTokenService)private _authTokenService: IAuthTokenService,
        @inject(TYPES.IUserLookupService)private _userLookupService: IUserLookupService,
    ) { }

    async execute(token: string): Promise<RefreshTokenResponseDTO> {
        if (!token) {
            throw new UnauthorizedError(AUTH_ERRORS.REFRESH_TOKEN_MISSING);
        }

        try {
            const payload = this._authTokenService.verifyRefreshToken(token);

            const user = await this._userLookupService.findByIdAndRole(payload.id, payload.role);
            if(!user) {
                throw new UnauthorizedError(USER_ERRORS.USER_NOT_FOUND);
            };

            const accessToken = this._authTokenService.generateAccessToken({ id: payload.id, role: payload.role });

            return { accessToken, user };
        } catch {
            throw new UnauthorizedError(AUTH_ERRORS.INVALID_REFRESH_TOKEN);
        }
    }
}
