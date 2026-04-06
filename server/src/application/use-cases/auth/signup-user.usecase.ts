import { SignupUserRequestDTO } from "../../dtos/auth/auth.dto";
import { ISignupUserUseCase } from "../../ports/auth/ISignupUserUseCase";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IEmailVerificationTokenService } from "../../interfaces/IEmailVerificationTokenService";
import { IEmailService } from "../../interfaces/IEmailService";
import { ILogger } from "../../interfaces/ILogger";
import { BadRequestError } from "../../../shared/errors/HttpError";
import { IPasswordService } from "../../interfaces/IPasswordService";
import { User } from "../../../domain/entities/User";
import { IAppConfig } from "../../interfaces/IAppConfig";
import { IWalletRepository } from "../../../domain/repositories/IWalletRepository";
import { Wallet } from "../../../domain/entities/Wallet";
import { LOG_MESSAGES, USER_ERRORS, VALIDATION } from "../../../shared/constants/Messages";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../di/types";

@injectable()
export class SignupUserUseCase implements ISignupUserUseCase {
    constructor(
        @inject(TYPES.IUserRepository) private _userRepository: IUserRepository,
        @inject(TYPES.IPasswordService) private _passwordService: IPasswordService,
        @inject(TYPES.IWalletRepository) private _walletRepository: IWalletRepository,
        @inject(TYPES.IEmailVerificationTokenService) private _emailVerificationTokenService: IEmailVerificationTokenService,
        @inject(TYPES.IEmailService) private _emailService: IEmailService,
        @inject(TYPES.IAppConfig) private _appConfig: IAppConfig,
        @inject(TYPES.ILogger) private _logger: ILogger
    ) {}

    async execute(dto: SignupUserRequestDTO): Promise<void> {
        const { name, email, password } = dto;

        const existingUser = await this._userRepository.findByEmail(email);
        if(existingUser) {
            throw new BadRequestError(VALIDATION.VALIDATION_FAILED, [{ field: 'email', message: USER_ERRORS.EMAIL_ALREADY_EXISTS }]);
        }

        const hashedPassword = await this._passwordService.hash(password);

        const user = new User(
            '',
            name,
            email,
            hashedPassword,
            ['LOCAL'],
            "USER",
            "ACTIVE",
            false,
        );

        const savedUser = await this._userRepository.create(user);

        //Wallet creation for user
        const wallet = new Wallet(
            "",
            savedUser.id
        );
        await this._walletRepository.create(wallet);

        const verificationToken = this._emailVerificationTokenService.generateEmailVerificationToken(user.email);

        const verificationLink = `${this._appConfig.frontendUrl}/auth/verify-email/${verificationToken}`;

        await this._emailService.sendVerificationEmail(user.email, verificationLink);

        this._logger.info(LOG_MESSAGES.USER_REGISTERED, { email });
    }
}