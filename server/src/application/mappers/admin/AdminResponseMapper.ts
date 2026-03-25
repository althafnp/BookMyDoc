import { Admin } from "../../../domain/entities/Admin";
import { LoginAdminResponseDTO } from "../../dtos/auth/auth.dto";

export class AdminResponseMapper {
    static toDTO(admin: Admin): LoginAdminResponseDTO["admin"] {
        return {
            id: admin.id,
            email: admin.email,
            role: admin.role,
        };
    }
}