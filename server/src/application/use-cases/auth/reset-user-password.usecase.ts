import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { AUTH_ERRORS, LOG_MESSAGES } from "../../../shared/constants/Messages";
import { UnauthorizedError } from "../../../shared/errors/HttpError";
import { ResetPasswordRequestDTO } from "../../dtos/auth";
import { ILogger } from "../../interfaces/ILogger";
import { IPasswordService } from "../../interfaces/IPasswordService";
import { IPasswordTokenService } from "../../interfaces/IPasswordTokenService";
import { IResetUserPassword } from "../../ports/auth/IResetUserPassword";

export class ResetUserPasswordUseCase implements IResetUserPassword {
    constructor(
        private _userRepository: IUserRepository,
        private _passwordTokenService: IPasswordTokenService,
        private _passwordService: IPasswordService,
        private _logger: ILogger
    ) {}

    async execute(dto: ResetPasswordRequestDTO): Promise<void> {
        const { password, token } = dto;

        let decoded: { email: string };

        try {
            decoded = this._passwordTokenService.verifyPasswordResetToken(token);
        } catch {
            throw new UnauthorizedError(AUTH_ERRORS.INVALID_OR_EXPIRED_TOKEN);
        }

        const user = await this._userRepository.findByEmail(decoded.email);
        if(!user) {
            throw new UnauthorizedError(AUTH_ERRORS.INVALID_OR_EXPIRED_TOKEN);
        }

        const hashedPassword = await this._passwordService.hash(password);

        user.changePassword(hashedPassword);

        await this._userRepository.update(user);

        this._logger.info(LOG_MESSAGES.PASSWORD_CHANGED, { userId: user.id, email: user.email });
    }
}