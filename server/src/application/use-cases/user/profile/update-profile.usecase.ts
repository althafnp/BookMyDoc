import { inject, injectable } from "inversify";
import { IUpdateProfileUseCase } from "../../../ports/user/profile/IUpdateProfileUseCase";
import { TYPES } from "../../../../di/types";
import { IUserRepository } from "../../../../domain/repositories/IUserRepository";
import { IFileStorageService } from "../../../interfaces/IFileStorageService";
import { IAppConfig } from "../../../interfaces/IAppConfig";
import { GetProfileResponseDTO, UpdateProfileRequestDTO } from "../../../dtos/user/profile.dto";
import { NotFoundError } from "../../../../shared/errors/HttpError";
import { USER_ERRORS } from "../../../../shared/constants/Messages";
import { UserResponseMapper } from "../../../mappers/user/UserResponseMapper";
import { mimeToExtension } from "../../../../shared/utils/mimeToExtension";
import { randomUUID } from "crypto";

@injectable()
export class UpdateProfileUseCase implements IUpdateProfileUseCase {
    constructor(
        @inject(TYPES.IUserRepository) private _userRepository: IUserRepository,
        @inject(TYPES.IFileStorageService) private _fileStorageService: IFileStorageService,
        @inject(TYPES.IAppConfig) private _appConfig: IAppConfig
    ) {}

    async execute(userId: string, dto: UpdateProfileRequestDTO): Promise<GetProfileResponseDTO> {
        const user = await this._userRepository.findById(userId);
        if (!user) {
            throw new NotFoundError(USER_ERRORS.USER_NOT_FOUND);
        }

        user.name = dto.name;

        if(dto.removeImage && user.profileImage) {
            await this._fileStorageService.delete(user.profileImage);

            user.profileImage = null;
        }


        if (dto.profileImage) {
            //delete old image if exists
            if(user.profileImage) {
                await this._fileStorageService.delete(user.profileImage)
            }

            const extension = mimeToExtension(dto.profileImage.mimetype);

            const imageKey = `users/${randomUUID()}.${extension}`;

            await this._fileStorageService.upload(
                dto.profileImage.buffer,
                dto.profileImage.mimetype,
                imageKey
            );

            user.profileImage = imageKey;
        }

        const updatedUser = await this._userRepository.update(user);
        console.log(updatedUser)

        return UserResponseMapper.toProfileDTO(updatedUser!, this._appConfig);
    }
}