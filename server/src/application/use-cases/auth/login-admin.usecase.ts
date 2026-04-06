import { inject, injectable } from "inversify";
import { IAdminRepository } from "../../../domain/repositories/IAdminRepository";
import { ADMIN_ERRORS, AUTH_ERRORS, LOG_MESSAGES, VALIDATION } from "../../../shared/constants/Messages";
import { NotFoundError, UnauthorizedError } from "../../../shared/errors/HttpError";
import { LoginAdminRequestDTO, LoginAdminResponseDTO } from "../../dtos/auth/auth.dto";
import { IAuthTokenService } from "../../interfaces/IAuthTokenService";
import { ILogger } from "../../interfaces/ILogger";
import { AdminResponseMapper } from "../../mappers/admin/AdminResponseMapper";
import { ILoginAdminUseCase } from "../../ports/auth/ILoginAdminUseCase";
import { TYPES } from "../../../di/types";

@injectable()
export class LoginAdminUseCase implements ILoginAdminUseCase {
    constructor(
        @inject(TYPES.IAdminRepository) private _adminRepository: IAdminRepository,
        @inject(TYPES.IAuthTokenService) private _authTokenService: IAuthTokenService,
        @inject(TYPES.ILogger) private _logger: ILogger
    ) {}

    async execute(dto: LoginAdminRequestDTO): Promise<LoginAdminResponseDTO> {
        const { email, password } = dto;

        const admin = await this._adminRepository.findByEmail(email);
        if(!admin) {
            throw new NotFoundError(VALIDATION.VALIDATION_FAILED, [{ field: 'email', message: ADMIN_ERRORS.ADMIN_NOT_FOUND }]);
        }


        if(password !== admin.getPassword()) {
            throw new UnauthorizedError(VALIDATION.VALIDATION_FAILED, [{ field: 'password', message: AUTH_ERRORS.INCORRECT_PASSWORD }]);
        };

        const accessToken = this._authTokenService.generateAccessToken({ id: admin.id, role: admin.role });
        const refreshToken = this._authTokenService.generateRefreshToken({ id: admin.id, role: admin.role });

        this._logger.info(LOG_MESSAGES.ADMIN_LOGGED_IN, { admin });

        return {
            admin: AdminResponseMapper.toDTO(admin),
            accessToken,
            refreshToken 
        };
    }
}