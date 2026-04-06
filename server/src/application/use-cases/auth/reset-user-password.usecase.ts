import { inject, injectable } from "inversify";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { AUTH_ERRORS, LOG_MESSAGES } from "../../../shared/constants/Messages";
import { UnauthorizedError } from "../../../shared/errors/HttpError";
import { ResetPasswordRequestDTO } from "../../dtos/auth/auth.dto";
import { ILogger } from "../../interfaces/ILogger";
import { IPasswordService } from "../../interfaces/IPasswordService";
import { IPasswordTokenService } from "../../interfaces/IPasswordTokenService";
import { IResetUserPasswordUseCase } from "../../ports/auth/IResetUserPasswordUseCase";
import { TYPES } from "../../../di/types";

@injectable()
export class ResetUserPasswordUseCase implements IResetUserPasswordUseCase {
    constructor(
        @inject(TYPES.IUserRepository) private _userRepository: IUserRepository,
        @inject(TYPES.IPasswordTokenService) private _passwordTokenService: IPasswordTokenService,
        @inject(TYPES.IPasswordService) private _passwordService: IPasswordService,
        @inject(TYPES.ILogger) private _logger: ILogger
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