import { inject, injectable } from "inversify";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { ForgotPasswordRequestDTO } from "../../dtos/auth/auth.dto";
import { IAppConfig } from "../../interfaces/IAppConfig";
import { IEmailService } from "../../interfaces/IEmailService";
import { IPasswordTokenService } from "../../interfaces/IPasswordTokenService";
import { IForgotUserPasswordUseCase } from "../../ports/auth/IForgotUserPasswordUseCase";
import { TYPES } from "../../../di/types";

@injectable()
export class ForgotUserPasswordUseCase implements IForgotUserPasswordUseCase {
    constructor(
        @inject(TYPES.IUserRepository) private _userRepository: IUserRepository,
        @inject(TYPES.IPasswordTokenService) private _passwordTokenService: IPasswordTokenService,
        @inject(TYPES.IAppConfig) private _appConfig: IAppConfig,
        @inject(TYPES.IEmailService) private _emailService: IEmailService
    ) {}

    async execute(dto: ForgotPasswordRequestDTO): Promise<void> {
        const { email } = dto;

        const user = await this._userRepository.findByEmail(email);
        if(user) {
            const resetToken = this._passwordTokenService.generatePasswordResetToken(email);

            const resetLink = `${this._appConfig.frontendUrl}/auth/reset-password/${resetToken}`;

            await this._emailService.sendPasswordResetVerificationEmail(user.email, resetLink);
        }
    }
}