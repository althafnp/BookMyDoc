import { IDoctorRepository } from "../../../domain/repositories/IDoctorRepository";
import { NotFoundError, UnauthorizedError } from "../../../shared/errors/HttpError";
import { LoginDoctorRequestDTO, LoginDoctorResponseDTO } from "../../dtos/auth";
import { IAuthTokenService } from "../../interfaces/IAuthTokenService";
import { ILogger } from "../../interfaces/ILogger";
import { IPasswordService } from "../../interfaces/IPasswordService";
import { DoctorResponseMapper } from "../../mappers/DoctorResponseMapper";
import { ILoginDoctor } from "../../ports/auth/ILoginDoctor";

export class LoginDoctorUseCase implements ILoginDoctor {
    constructor(
        private doctorRepository: IDoctorRepository,
        private authTokenService: IAuthTokenService,
        private passwordService: IPasswordService,
        private logger: ILogger
    ) {}

    async execute(dto: LoginDoctorRequestDTO): Promise<LoginDoctorResponseDTO> {
        const { email, password } = dto;

        const doctor = await this.doctorRepository.findByEmail(email);
        if(!doctor) {
            throw new NotFoundError('Validation failed', [{ field: 'email', message: 'Doctor not found' }]);
        }

        const isMatch = await this.passwordService.compare(password, doctor.getPassword());
        if(!isMatch) {
            throw new UnauthorizedError('Validation failed', [{ field: 'password', message: 'Incorrect password' }]);
        }

        const accessToken = this.authTokenService.generateAccessToken({ id: doctor.id, role: doctor.role});
        const refreshToken = this.authTokenService.generateRefreshToken({ id: doctor.id, role: doctor.role});

        this.logger.info('Doctor logged in', { doctorId: doctor.id, email: doctor.email })

        return {
            doctor: DoctorResponseMapper.toDTO(doctor),
            accessToken,
            refreshToken
        }
    }
}