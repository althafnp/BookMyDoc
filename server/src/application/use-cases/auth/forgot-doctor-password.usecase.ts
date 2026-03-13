import { IDoctorRepository } from "../../../domain/repositories/IDoctorRepository";
import { NotFoundError } from "../../../shared/errors/HttpError";
import { ForgotPasswordRequestDTO } from "../../dtos/auth";
import { IAppConfig } from "../../interfaces/IAppConfig";
import { IEmailService } from "../../interfaces/IEmailService";
import { IPasswordTokenService } from "../../interfaces/IPasswordTokenService";
import { IForgotDoctorPassword } from "../../ports/auth/IForgotDoctorPassword";

export class ForgotDoctorPasswordUseCase implements IForgotDoctorPassword {
    constructor(
        private doctorRepository: IDoctorRepository,
        private passwordTokenService: IPasswordTokenService,
        private appConfig: IAppConfig,
        private emailService: IEmailService
    ) {}

    async execute(dto: ForgotPasswordRequestDTO): Promise<void> {
        const { email } = dto;
        
        const doctor = await this.doctorRepository.findByEmail(email);
        if(!doctor) {
            throw new NotFoundError('Email not found');
        }

        const resetToken = this.passwordTokenService.generatePasswordResetToken(doctor.email);

        const resetLink = `${this.appConfig.frontendUrl}/doctor/auth/reset-password/${resetToken}`;

        await this.emailService.sendPasswordResetVerificationEmail(doctor.email, resetLink);
    }
}