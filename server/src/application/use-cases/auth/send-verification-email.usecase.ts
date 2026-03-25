import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { SendVerificationEmailRequestDTO } from "../../dtos/auth/auth.dto";
import { IAppConfig } from "../../interfaces/IAppConfig";
import { IEmailService } from "../../interfaces/IEmailService";
import { IEmailVerificationTokenService } from "../../interfaces/IEmailVerificationTokenService";
import { ISendVerificationEmail } from "../../ports/auth/ISendVerificationEmail";

export class SendVerificationEmailUseCase implements ISendVerificationEmail {
    constructor(
        private _userRepository: IUserRepository,
        private _emailVerificationTokenService: IEmailVerificationTokenService,
        private _emailService: IEmailService,
        private _appConfig: IAppConfig
    ) {}

    async execute(dto: SendVerificationEmailRequestDTO): Promise<void> {
        const { email } = dto;

        const user = await this._userRepository.findByEmail(email);
        if(user) {
            if(user.emailVerified) return;

            const verificationToken = this._emailVerificationTokenService.generateEmailVerificationToken(email);

            const verificationLink = `${this._appConfig.frontendUrl}/auth/verify-email/${verificationToken}`;

            await this._emailService.sendVerificationEmail(user.email, verificationLink)
        }
    }
}