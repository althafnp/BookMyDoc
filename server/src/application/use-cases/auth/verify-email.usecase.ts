import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { AUTH_ERRORS, LOG_MESSAGES, USER_ERRORS } from "../../../shared/constants/Messages";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../../../shared/errors/HttpError";
import { VerifyEmailRequestDTO } from "../../dtos/auth/auth.dto";
import { IEmailVerificationTokenService } from "../../interfaces/IEmailVerificationTokenService";
import { ILogger } from "../../interfaces/ILogger";
import { IVerifyEmail } from "../../ports/auth/IVerifyEmail";

export class VerifyEmailUseCase implements IVerifyEmail {
    constructor(
        private _userRepository: IUserRepository,
        private _emailVerificationTokenService: IEmailVerificationTokenService,
        private _logger: ILogger
    ) {}

    async execute(dto: VerifyEmailRequestDTO): Promise<void> {
        const { token } = dto;
        let decoded: { email: string };

        try {
            decoded = this._emailVerificationTokenService.verifyEmailVerificationToken(token);
        } catch {
            throw new UnauthorizedError(AUTH_ERRORS.INVALID_OR_EXPIRED_TOKEN);
        }

        const user = await this._userRepository.findByEmail(decoded.email);

        if (!user) {
            throw new NotFoundError(USER_ERRORS.USER_NOT_FOUND);
        }

        if (user.emailVerified) {
            throw new BadRequestError(AUTH_ERRORS.EMAIL_ALREADY_VERIFIED);
        }

        user.emailVerified = true;

        await this._userRepository.update(user);

        this._logger.info(LOG_MESSAGES.USER_VERIFIED, { userId: user.id, email: user.email });
    }
}