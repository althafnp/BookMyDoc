import { User } from "../../../domain/entities/User";
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
}