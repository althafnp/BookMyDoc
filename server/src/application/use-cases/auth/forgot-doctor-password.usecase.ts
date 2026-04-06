import { inject, injectable } from "inversify";
import { IDoctorRepository } from "../../../domain/repositories/IDoctorRepository";
import { ForgotPasswordRequestDTO } from "../../dtos/auth/auth.dto";
import { IAppConfig } from "../../interfaces/IAppConfig";
import { IEmailService } from "../../interfaces/IEmailService";
import { IPasswordTokenService } from "../../interfaces/IPasswordTokenService";
import { IForgotDoctorPasswordUseCase } from "../../ports/auth/IForgotDoctorPasswordUseCase";
import { TYPES } from "../../../di/types";

@injectable()
export class ForgotDoctorPasswordUseCase implements IForgotDoctorPasswordUseCase {
    constructor(
        @inject(TYPES.IDoctorRepository) private _doctorRepository: IDoctorRepository,
        @inject(TYPES.IPasswordTokenService) private _passwordTokenService: IPasswordTokenService,
        @inject(TYPES.IAppConfig) private _appConfig: IAppConfig,
        @inject(TYPES.IEmailService) private _emailService: IEmailService
    ) {}

    async execute(dto: ForgotPasswordRequestDTO): Promise<void> {
        const { email } = dto;
        
        const doctor = await this._doctorRepository.findByEmail(email);
        if(doctor) {
            const resetToken = this._passwordTokenService.generatePasswordResetToken(doctor.email);
            
            const resetLink = `${this._appConfig.frontendUrl}/doctor/auth/reset-password/${resetToken}`;
            
            await this._emailService.sendPasswordResetVerificationEmail(doctor.email, resetLink);
        }
    }
}