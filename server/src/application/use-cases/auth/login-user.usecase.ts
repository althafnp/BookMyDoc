import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../../../shared/errors/HttpError";
import { LoginUserRequestDTO, LoginUserResponseDTO } from "../../dtos/auth";
import { IAuthTokenService } from "../../interfaces/IAuthTokenService";
import { ILogger } from "../../interfaces/ILogger";
import { IPasswordService } from "../../interfaces/IPasswordService";
import { UserResponseMapper } from "../../mappers/UserResponseMapper";
import { ILoginUser } from "../../ports/auth/ILoginUser";

export class LoginUserUseCase implements ILoginUser {
    constructor(
        private userRepository: IUserRepository,
        private authTokenService: IAuthTokenService,
        private passwordService: IPasswordService,
        private logger: ILogger
    ) { }

    async execute(dto: LoginUserRequestDTO): Promise<LoginUserResponseDTO> {
        const { email, password } = dto;

        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new NotFoundError('Validation failed', [{ field: 'email', message: 'User not found' }])
        };

        if (!user.isProviderLinked('LOCAL')) {
            throw new BadRequestError('Validation failed', [{ field: 'email', message: 'This account uses Google sign-in, Continue with Google' }])
        }

        if (!user.hasPassword()) {
            throw new BadRequestError('Invalid credentials')
        }

        const isMatch = await this.passwordService.compare(password, user.getPassword()!)
        if (!isMatch) {
            throw new UnauthorizedError('Validation failed', [{ field: 'password', message: 'Incorrect password' }])
        };

        if (!user.emailVerified) {
            throw new BadRequestError('Validation failed', [{ field: 'email', message: 'Verify your email to log in' }])
        }

        if (user.isBlocked) {
            throw new BadRequestError('Validation failed', [{ field: 'email', message: 'User is currently blocked' }])
        }

        const accessToken = this.authTokenService.generateAccessToken({ id: user.id, role: user.role });

        this.logger.info("User logged in", { user })

        return {
            user: UserResponseMapper.toDTO(user),
            accessToken
        }
    }
}