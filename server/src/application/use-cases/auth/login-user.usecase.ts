import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { AUTH_ERRORS, LOG_MESSAGES, USER_ERRORS, VALIDATION } from "../../../shared/constants/Messages";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../../../shared/errors/HttpError";
import { LoginUserRequestDTO, LoginUserResponseDTO } from "../../dtos/auth";
import { IAuthTokenService } from "../../interfaces/IAuthTokenService";
import { ILogger } from "../../interfaces/ILogger";
import { IPasswordService } from "../../interfaces/IPasswordService";
import { UserResponseMapper } from "../../mappers/UserResponseMapper";
import { ILoginUser } from "../../ports/auth/ILoginUser";

export class LoginUserUseCase implements ILoginUser {
    constructor(
        private _userRepository: IUserRepository,
        private _authTokenService: IAuthTokenService,
        private _passwordService: IPasswordService,
        private _logger: ILogger
    ) { }

    async execute(dto: LoginUserRequestDTO): Promise<LoginUserResponseDTO> {
        const { email, password } = dto;

        const user = await this._userRepository.findByEmail(email);
        if (!user) {
            throw new NotFoundError(VALIDATION.VALIDATION_FAILED, [{ field: 'email', message: USER_ERRORS.USER_NOT_FOUND }]);
        };

        if (!user.isProviderLinked('LOCAL')) {
            throw new BadRequestError(VALIDATION.VALIDATION_FAILED, [{ field: 'email', message: AUTH_ERRORS.GOOGLE_SIGN_IN_REQUIRED }]);
        }

        if (!user.hasPassword()) {
            throw new BadRequestError(AUTH_ERRORS.INVALID_CREDENTIALS);
        }

        const isMatch = await this._passwordService.compare(password, user.getPassword()!);
        if (!isMatch) {
            throw new UnauthorizedError(VALIDATION.VALIDATION_FAILED, [{ field: 'password', message: AUTH_ERRORS.INCORRECT_PASSWORD }]);
        };

        if (!user.emailVerified) {
            throw new BadRequestError(VALIDATION.VALIDATION_FAILED, [{ field: 'email', message: AUTH_ERRORS.VERIFY_EMAIL_TO_LOGIN }]);
        }

        if (user.status === "INACTIVE") {
            throw new BadRequestError(VALIDATION.VALIDATION_FAILED, [{ field: 'email', message: USER_ERRORS.USER_BLOCKED }]);
        }

        const accessToken = this._authTokenService.generateAccessToken({ id: user.id, role: user.role });
        const refreshToken = this._authTokenService.generateRefreshToken({ id: user.id, role: user.role });

        this._logger.info(LOG_MESSAGES.USER_LOGGED_IN, { user });

        return {
            user: UserResponseMapper.toDTO(user),
            accessToken,
            refreshToken
        };
    }
}