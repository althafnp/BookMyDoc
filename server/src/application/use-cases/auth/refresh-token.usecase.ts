import { UnauthorizedError } from "../../../shared/errors/HttpError";
import { RefreshTokenResponseDTO } from "../../dtos/auth";
import { IAuthTokenService } from "../../interfaces/IAuthTokenService";
import { IUserLookupService } from "../../interfaces/IUserLookupService";
import { IRefreshToken } from "../../ports/auth/IRefreshToken";

export class RefreshTokenUseCase implements IRefreshToken {
    constructor(
        private _authTokenService: IAuthTokenService,
        private _userLookupService: IUserLookupService,
    ) { }

    async execute(token: string): Promise<RefreshTokenResponseDTO> {
        if (!token) {
            throw new UnauthorizedError("Refresh token is missing, Login again");
        }

        try {
            const payload = this._authTokenService.verifyRefreshToken(token);

            const user = await this._userLookupService.findByIdAndRole(payload.id, payload.role);
            if(!user) {
                throw new UnauthorizedError('User not found');
            };

            const accessToken = this._authTokenService.generateAccessToken({ id: payload.id, role: payload.role });

            return { accessToken, user };
        } catch {
            throw new UnauthorizedError("Invalid refresh token");
        }
    }
}
