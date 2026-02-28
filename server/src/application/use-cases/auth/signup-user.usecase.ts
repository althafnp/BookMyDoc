import { SignupUserRequestDTO } from "../../dtos/auth";
import { ISignupUser } from "../../ports/auth/ISignupUser";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IEmailVerificationTokenService } from "../../interfaces/IEmailVerificationTokenService";
import { IEmailService } from "../../interfaces/IEmailService";
import { ILogger } from "../../interfaces/ILogger";
import { BadRequestError } from "../../../shared/errors/HttpError";
import { IPasswordService } from "../../interfaces/IPasswordService";
import { User } from "../../../domain/entities/User";
import { IAppConfig } from "../../interfaces/IAppConfig";


export class SignupUserUseCase implements ISignupUser {
    constructor(
        private userRepository: IUserRepository,
        private passwordService: IPasswordService,
        private emailVerificationTokenService: IEmailVerificationTokenService,
        private emailService: IEmailService,
        private appConfig: IAppConfig,
        private logger: ILogger
    ) {}

    async execute(dto: SignupUserRequestDTO): Promise<void> {
        const { name, email, password } = dto;

        const existingUser = await this.userRepository.findByEmail(email);
        if(existingUser) {
            throw new BadRequestError('Validation failed', [{ field: 'email', message: 'User with this email already exists' }]);
        }

        const hashedPassword = await this.passwordService.hash(password);

        const user = new User(
            '',
            name,
            email,
            hashedPassword,
            ['LOCAL'],
            "USER",
            false,
            false,
        );

        await this.userRepository.create(user);

        const emailVerificationToken = this.emailVerificationTokenService.generateEmailVerificationToken(user.email);

        const emailVerificationLink = `${this.appConfig.frontendUrl}/auth/verify-email/${emailVerificationToken}`;

        await this.emailService.sendVerificationEmail(user.email, emailVerificationLink);

        this.logger.info("User registered successfully", { email })
    }
}