import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../../../shared/errors/HttpError";
import { VerifyEmailRequestDTO } from "../../dtos/auth";
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
            throw new UnauthorizedError("Invalid or expired verification token");
        }

        const user = await this._userRepository.findByEmail(decoded.email);

        if (!user) {
            throw new NotFoundError("User not found");
        }

        if (user.emailVerified) {
            throw new BadRequestError("Email is already verified");
        }

        user.emailVerified = true;

        await this._userRepository.update(user);

        this._logger.info("User verified successfully", { userId: user.id, email: user.email });
    }
}