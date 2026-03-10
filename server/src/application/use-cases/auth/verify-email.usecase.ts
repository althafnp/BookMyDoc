import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../../../shared/errors/HttpError";
import { IEmailVerificationTokenService } from "../../interfaces/IEmailVerificationTokenService";
import { ILogger } from "../../interfaces/ILogger";
import { IVerifyEmail } from "../../ports/auth/IVerifyEmail";

export class VerifyEmailUseCase implements IVerifyEmail {
    constructor(
        private userRepository: IUserRepository,
        private emailVerificationTokenService: IEmailVerificationTokenService,
        private logger: ILogger
    ) {}

    async execute(token: string): Promise<void> {
        let decoded: { email: string };

        try {
            decoded = this.emailVerificationTokenService.verifyEmailVerificationToken(token);
        } catch {
            throw new UnauthorizedError("Invalid or expired verification token");
        }

        const user = await this.userRepository.findByEmail(decoded.email);

        if (!user) {
            throw new NotFoundError("User not found");
        }

        if (user.emailVerified) {
            throw new BadRequestError("Email is already verified");
        }

        user.emailVerified = true;

        await this.userRepository.update(user);

        this.logger.info("User verified successfully", { userId: user.id, email: user.email });
    }
}