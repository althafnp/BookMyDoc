import { User } from "../../../domain/entities/User";
import { buildS3Url } from "../../../shared/utils/buildS3Url";
import { ToggleUserStatusResponseDTO, UserItemDTO } from "../../dtos/admin/user.dto";
import { LoginUserResponseDTO } from "../../dtos/auth/auth.dto";
import { GetProfileResponseDTO } from "../../dtos/user/profile.dto";
import { IAppConfig } from "../../interfaces/IAppConfig";


export class UserResponseMapper {
    static toDTO(user: User, config: IAppConfig): LoginUserResponseDTO["user"] {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImage: user.profileImage ? buildS3Url(config.awsS3BucketName, config.awsRegion, user.profileImage) : undefined,
        };
    }

    static toListDTO(user: User): UserItemDTO {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            status: user.status
        }
    }

    static toToggleDTO(user: User): ToggleUserStatusResponseDTO {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            status: user.status
        }
    }

    static toProfileDTO(user: User, config: IAppConfig): GetProfileResponseDTO {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage ? buildS3Url(config.awsS3BucketName, config.awsRegion, user.profileImage) : undefined,
        role: user.role
    };
}
}