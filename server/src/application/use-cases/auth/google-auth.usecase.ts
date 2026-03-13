import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { BadRequestError } from "../../../shared/errors/HttpError";
import { GoogleAuthRequestDTO, LoginUserResponseDTO } from "../../dtos/auth";
import { IAuthTokenService } from "../../interfaces/IAuthTokenService";
import { IGoogleAuthService } from "../../interfaces/IGoogleAuthService";
import { UserResponseMapper } from "../../mappers/UserResponseMapper";
import { IGoogleAuth } from "../../ports/auth/IGoogleAuth";

export class GoogleAuthUseCase implements IGoogleAuth{
    constructor(
        private userRepository: IUserRepository,
        private authTokenService: IAuthTokenService,
        private googleAuthService: IGoogleAuthService
    ) {}

    async execute(dto: GoogleAuthRequestDTO): Promise<LoginUserResponseDTO> {
        const { token } = dto;
        
        const googleUser = await this.googleAuthService.verifyIdToken(token);
        // console.log('user: ', googleUser)

        let user = await this.userRepository.findByEmail(googleUser.email);

        if(user) {
            if(!user.isProviderLinked("GOOGLE")) {
                user.addProvider("GOOGLE", googleUser.googleId);
            }

            if(user.status === "BLOCKED") {
                throw new BadRequestError("User is currenty blocked")
            };

            await this.userRepository.update(user);
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
            )

            user = await this.userRepository.create(user)
        }

        const accessToken = this.authTokenService.generateAccessToken({ id: user.id, role: user.role });
        const refreshToken = this.authTokenService.generateAccessToken({ id: user.id, role: user.role });

        return { 
            user: UserResponseMapper.toDTO(user),
            accessToken,
            refreshToken
        }
    }
}