import { IDoctorRepository } from "../../../domain/repositories/IDoctorRepository";
import { NotFoundError, UnauthorizedError } from "../../../shared/errors/HttpError";
import { ResetPasswordRequestDTO } from "../../dtos/auth";
import { ILogger } from "../../interfaces/ILogger";
import { IPasswordService } from "../../interfaces/IPasswordService";
import { IPasswordTokenService } from "../../interfaces/IPasswordTokenService";
import { IResetDoctorPassword } from "../../ports/auth/IResetDoctorPassword";

export class ResetDoctorPasswordUseCase implements IResetDoctorPassword {
    constructor(
        private doctorRepository: IDoctorRepository,
        private passwordTokenService: IPasswordTokenService,
        private passwordService: IPasswordService,
        private logger: ILogger
    ) {}

    async execute(dto: ResetPasswordRequestDTO): Promise<void> {
        const { token, password } = dto;

        let decoded: { email: string };

        try {
            decoded = this.passwordTokenService.verifyPasswordResetToken(token);
        } catch (error) {
            throw new UnauthorizedError("Invalid or expired verification token");
        }

        const doctor = await this.doctorRepository.findByEmail(decoded.email);
        if(!doctor) {
            throw new NotFoundError("Doctor not found");
        }

        const hashedPassword = await this.passwordService.hash(password);

        doctor.changePassword(hashedPassword);

        await this.doctorRepository.update(doctor);

        this.logger.info("Doctor's password changed", { doctorId: doctor.id, email: doctor.email })
    }
}