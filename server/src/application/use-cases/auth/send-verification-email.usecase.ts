import { inject, injectable } from "inversify";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { SendVerificationEmailRequestDTO } from "../../dtos/auth/auth.dto";
import { IAppConfig } from "../../interfaces/IAppConfig";
import { IEmailService } from "../../interfaces/IEmailService";
import { IEmailVerificationTokenService } from "../../interfaces/IEmailVerificationTokenService";
import { ISendVerificationEmailUseCase } from "../../ports/auth/ISendVerificationEmailUseCase";
import { TYPES } from "../../../di/types";

@injectable()
export class SendVerificationEmailUseCase implements ISendVerificationEmailUseCase {
    constructor(
        @inject(TYPES.IUserRepository) private _userRepository: IUserRepository,
        @inject(TYPES.IEmailVerificationTokenService) private _emailVerificationTokenService: IEmailVerificationTokenService,
        @inject(TYPES.IEmailService) private _emailService: IEmailService,
        @inject(TYPES.IAppConfig) private _appConfig: IAppConfig
    ) {}

    async execute(dto: SendVerificationEmailRequestDTO): Promise<void> {
        const { email } = dto;

        const user = await this._userRepository.findByEmail(email);
        if(user) {
            if(user.emailVerified) return;

            const verificationToken = this._emailVerificationTokenService.generateEmailVerificationToken(email);

            const verificationLink = `${this._appConfig.frontendUrl}/auth/verify-email/${verificationToken}`;

            await this._emailService.sendVerificationEmail(user.email, verificationLink);
        }
    }
}