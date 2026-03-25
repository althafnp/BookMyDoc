import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { ForgotPasswordRequestDTO } from "../../dtos/auth/auth.dto";
import { IAppConfig } from "../../interfaces/IAppConfig";
import { IEmailService } from "../../interfaces/IEmailService";
import { IPasswordTokenService } from "../../interfaces/IPasswordTokenService";
import { IForgotUserPassword } from "../../ports/auth/IForgotUserPassword";

export class ForgotUserPasswordUseCase implements IForgotUserPassword {
    constructor(
        private _userRepository: IUserRepository,
        private _passwordTokenService: IPasswordTokenService,
        private _appConfig: IAppConfig,
        private _emailService: IEmailService
    ) {}

    async execute(dto: ForgotPasswordRequestDTO): Promise<void> {
        const { email } = dto;

        const user = await this._userRepository.findByEmail(email);
        if(user) {
            const resetToken = this._passwordTokenService.generatePasswordResetToken(email);

            const resetLink = `${this._appConfig.frontendUrl}/auth/reset-password/${resetToken}`;

            await this._emailService.sendPasswordResetVerificationEmail(user.email, resetLink)
        }
    }
}