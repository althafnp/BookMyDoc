import { User } from "../../../domain/entities/User";
import { ToggleUserStatusResponseDTO, UserItemDTO } from "../../dtos/admin/user.dto";
import { LoginUserResponseDTO } from "../../dtos/auth/auth.dto";

export class UserResponseMapper {
    static toDTO(user: User): LoginUserResponseDTO["user"] {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImage: user.profileImage,
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
}