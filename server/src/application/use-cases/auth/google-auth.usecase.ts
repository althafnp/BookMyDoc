import { inject, injectable } from "inversify";
import { User } from "../../../domain/entities/User";
import { Wallet } from "../../../domain/entities/Wallet";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IWalletRepository } from "../../../domain/repositories/IWalletRepository";
import { LOG_MESSAGES, USER_ERRORS } from "../../../shared/constants/Messages";
import { BadRequestError } from "../../../shared/errors/HttpError";
import { GoogleAuthRequestDTO, LoginUserResponseDTO } from "../../dtos/auth/auth.dto";
import { IAuthTokenService } from "../../interfaces/IAuthTokenService";
import { IGoogleAuthService } from "../../interfaces/IGoogleAuthService";
import { ILogger } from "../../interfaces/ILogger";
import { UserResponseMapper } from "../../mappers/user/UserResponseMapper";
import { IGoogleAuthUseCase } from "../../ports/auth/IGoogleAuthUseCase";
import { TYPES } from "../../../di/types";

@injectable()
export class GoogleAuthUseCase implements IGoogleAuthUseCase {
    constructor(
        @inject(TYPES.IUserRepository) private _userRepository: IUserRepository,
        @inject(TYPES.IWalletRepository) private _walletRepository: IWalletRepository,
        @inject(TYPES.IAuthTokenService) private _authTokenService: IAuthTokenService,
        @inject(TYPES.IGoogleAuthService) private _googleAuthService: IGoogleAuthService,
        @inject(TYPES.ILogger) private _logger: ILogger
    ) {}

    async execute(dto: GoogleAuthRequestDTO): Promise<LoginUserResponseDTO> {
        const { token } = dto;
        
        const googleUser = await this._googleAuthService.verifyIdToken(token);

        let user = await this._userRepository.findByEmail(googleUser.email);

        if(user) {
            if(user.status === "INACTIVE") {
                throw new BadRequestError(USER_ERRORS.USER_BLOCKED);
            };

            if(!user.isProviderLinked("GOOGLE")) {
                user.addProvider("GOOGLE", googleUser.googleId);

                await this._userRepository.update(user);
            }
        };

        
        if(!user) {
            user = new User(
                "",
                googleUser.name,
                googleUser.email,
                undefined,
                ["GOOGLE"],
                "USER",
                "ACTIVE",
                true,
                googleUser.googleId,
                googleUser.picture
            );

            user = await this._userRepository.create(user);

            // Create wallet for the new Google user
            const wallet = new Wallet("", user.id);
            await this._walletRepository.create(wallet);
        }

        const accessToken = this._authTokenService.generateAccessToken({ id: user.id, role: user.role });
        const refreshToken = this._authTokenService.generateRefreshToken({ id: user.id, role: user.role });

        this._logger.info(LOG_MESSAGES.USER_LOGGED_IN_GOOGLE, { userId: user.id, email: user.email});

        return { 
            user: UserResponseMapper.toDTO(user),
            accessToken,
            refreshToken
        };
    }
}