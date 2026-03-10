import { IAdminRepository } from "../../../domain/repositories/IAdminRepository";
import { NotFoundError, UnauthorizedError } from "../../../shared/errors/HttpError";
import { LoginAdminRequestDTO, LoginAdminResponseDTO } from "../../dtos/auth";
import { IAuthTokenService } from "../../interfaces/IAuthTokenService";
import { ILogger } from "../../interfaces/ILogger";
import { AdminResponseMapper } from "../../mappers/AdminResponseMapper";
import { ILoginAdmin } from "../../ports/auth/ILoginAdmin";

export class LoginAdminUseCase implements ILoginAdmin {
    constructor(
        private adminRepository: IAdminRepository,
        private authTokenService: IAuthTokenService,
        private logger: ILogger
    ) {}

    async execute(dto: LoginAdminRequestDTO): Promise<LoginAdminResponseDTO> {
        const { email, password } = dto;

        const admin = await this.adminRepository.findByEmail(email);
        if(!admin) {
            throw new NotFoundError('Validation failed', [{ field: 'email', message: 'Admin not found' }]);
        }


        if(password !== admin.getPassword()) {
            throw new UnauthorizedError('Validation failed', [{ field: 'password', message: 'Incorrect password' }])
        };

        const accessToken = this.authTokenService.generateAccessToken({ id: admin.id, role: admin.role });
        const refreshToken = this.authTokenService.generateRefreshToken({ id: admin.id, role: admin.role });

        this.logger.info("Admin logged in", { admin });

        return {
            admin: AdminResponseMapper.toDTO(admin),
            accessToken,
            refreshToken 
        }
    }
}