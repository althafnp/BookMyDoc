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
import { IWalletRepository } from "../../../domain/repositories/IWalletRepository";
import { Wallet } from "../../../domain/entities/Wallet";
import { LOG_MESSAGES, USER_ERRORS, VALIDATION } from "../../../shared/constants/Messages";


export class SignupUserUseCase implements ISignupUser {
    constructor(
        private _userRepository: IUserRepository,
        private _passwordService: IPasswordService,
        private _walletRepository: IWalletRepository,
        private _emailVerificationTokenService: IEmailVerificationTokenService,
        private _emailService: IEmailService,
        private _appConfig: IAppConfig,
        private _logger: ILogger
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