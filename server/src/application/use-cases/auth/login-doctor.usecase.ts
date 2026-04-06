import { inject, injectable } from "inversify";
import { IDoctorRepository } from "../../../domain/repositories/IDoctorRepository";
import { AUTH_ERRORS, DOCTOR_ERRORS, LOG_MESSAGES, VALIDATION } from "../../../shared/constants/Messages";
import { NotFoundError, UnauthorizedError } from "../../../shared/errors/HttpError";
import { LoginDoctorRequestDTO, LoginDoctorResponseDTO } from "../../dtos/auth/auth.dto";
import { IAuthTokenService } from "../../interfaces/IAuthTokenService";
import { ILogger } from "../../interfaces/ILogger";
import { IPasswordService } from "../../interfaces/IPasswordService";
import { DoctorResponseMapper } from "../../mappers/doctor/DoctorResponseMapper";
import { ILoginDoctorUseCase } from "../../ports/auth/ILoginDoctorUseCase";
import { TYPES } from "../../../di/types";

@injectable()
export class LoginDoctorUseCase implements ILoginDoctorUseCase {
    constructor(
        @inject(TYPES.IDoctorRepository) private _doctorRepository: IDoctorRepository,
        @inject(TYPES.IAuthTokenService) private _authTokenService: IAuthTokenService,
        @inject(TYPES.IPasswordService) private _passwordService: IPasswordService,
        @inject(TYPES.ILogger) private _logger: ILogger
    ) {}

    async execute(dto: LoginDoctorRequestDTO): Promise<LoginDoctorResponseDTO> {
        const { email, password } = dto;

        const doctor = await this._doctorRepository.findByEmail(email);
        if(!doctor) {
            throw new NotFoundError(VALIDATION.VALIDATION_FAILED, [{ field: 'email', message: DOCTOR_ERRORS.DOCTOR_NOT_FOUND }]);
        }

        const isMatch = await this._passwordService.compare(password, doctor.getPassword());
        if(!isMatch) {
            throw new UnauthorizedError(VALIDATION.VALIDATION_FAILED, [{ field: 'password', message: AUTH_ERRORS.INCORRECT_PASSWORD }]);
        }

        const accessToken = this._authTokenService.generateAccessToken({ id: doctor.id, role: doctor.role});
        const refreshToken = this._authTokenService.generateRefreshToken({ id: doctor.id, role: doctor.role});

        this._logger.info(LOG_MESSAGES.DOCTOR_LOGGED_IN, { doctorId: doctor.id, email: doctor.email });

        return {
            doctor: DoctorResponseMapper.toDTO(doctor),
            accessToken,
            refreshToken
        };
    }
}