import { IDoctorRepository } from "../../../domain/repositories/IDoctorRepository";
import { NotFoundError } from "../../../shared/errors/HttpError";
import { ForgotPasswordRequestDTO } from "../../dtos/auth";
import { IAppConfig } from "../../interfaces/IAppConfig";
import { IEmailService } from "../../interfaces/IEmailService";
import { IPasswordTokenService } from "../../interfaces/IPasswordTokenService";
import { IForgotDoctorPassword } from "../../ports/auth/IForgotDoctorPassword";

export class ForgotDoctorPasswordUseCase implements IForgotDoctorPassword {
    constructor(
        private _doctorRepository: IDoctorRepository,
        private _passwordTokenService: IPasswordTokenService,
        private _appConfig: IAppConfig,
        private _emailService: IEmailService
    ) {}

    async execute(dto: ForgotPasswordRequestDTO): Promise<void> {
        const { email } = dto;
        
        const doctor = await this._doctorRepository.findByEmail(email);
        if(!doctor) {
            throw new NotFoundError('Email not found');
        }

        const resetToken = this._passwordTokenService.generatePasswordResetToken(doctor.email);

        const resetLink = `${this._appConfig.frontendUrl}/doctor/auth/reset-password/${resetToken}`;

        await this._emailService.sendPasswordResetVerificationEmail(doctor.email, resetLink);
    }
}