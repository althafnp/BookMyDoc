import { IDoctorRepository } from "../../../domain/repositories/IDoctorRepository";
import { AUTH_ERRORS, DOCTOR_ERRORS, LOG_MESSAGES } from "../../../shared/constants/Messages";
import { NotFoundError, UnauthorizedError } from "../../../shared/errors/HttpError";
import { ResetPasswordRequestDTO } from "../../dtos/auth/auth.dto";
import { ILogger } from "../../interfaces/ILogger";
import { IPasswordService } from "../../interfaces/IPasswordService";
import { IPasswordTokenService } from "../../interfaces/IPasswordTokenService";
import { IResetDoctorPassword } from "../../ports/auth/IResetDoctorPassword";

export class ResetDoctorPasswordUseCase implements IResetDoctorPassword {
    constructor(
        private _doctorRepository: IDoctorRepository,
        private _passwordTokenService: IPasswordTokenService,
        private _passwordService: IPasswordService,
        private _logger: ILogger
    ) {}

    async execute(dto: ResetPasswordRequestDTO): Promise<void> {
        const { token, password } = dto;

        let decoded: { email: string };

        try {
            decoded = this._passwordTokenService.verifyPasswordResetToken(token);
        } catch {
            throw new UnauthorizedError(AUTH_ERRORS.INVALID_OR_EXPIRED_TOKEN);
        }

        const doctor = await this._doctorRepository.findByEmail(decoded.email);
        if(!doctor) {
            throw new UnauthorizedError(AUTH_ERRORS.INVALID_OR_EXPIRED_TOKEN);
        }

        const hashedPassword = await this._passwordService.hash(password);

        doctor.changePassword(hashedPassword);

        await this._doctorRepository.update(doctor);

        this._logger.info(LOG_MESSAGES.PASSWORD_CHANGED, { doctorId: doctor.id, email: doctor.email });
    }
}