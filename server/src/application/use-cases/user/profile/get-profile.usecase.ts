import { inject, injectable } from "inversify";
import { IGetProfileUseCase } from "../../../ports/user/profile/IGetProfileUseCase";
import { TYPES } from "../../../../di/types";
import { IUserRepository } from "../../../../domain/repositories/IUserRepository";
import { GetProfileResponseDTO } from "../../../dtos/user/profile.dto";
import { NotFoundError } from "../../../../shared/errors/HttpError";
import { USER_ERRORS } from "../../../../shared/constants/Messages";
import { UserResponseMapper } from "../../../mappers/user/UserResponseMapper";
import { IAppConfig } from "../../../interfaces/IAppConfig";

@injectable()
export class GetProfileUseCase implements IGetProfileUseCase {
    constructor(
        @inject(TYPES.IUserRepository) private _userRepository: IUserRepository,
        @inject(TYPES.IAppConfig) private _appConfig: IAppConfig,
    ) {}

    async execute(userId: string): Promise<GetProfileResponseDTO> {
        const user = await this._userRepository.findById(userId);
        if (!user) {
            throw new NotFoundError(USER_ERRORS.USER_NOT_FOUND);
        }

        return UserResponseMapper.toProfileDTO(user, this._appConfig)
    }
}