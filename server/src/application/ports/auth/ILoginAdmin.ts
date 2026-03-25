import { LoginAdminRequestDTO, LoginAdminResponseDTO } from "../../dtos/auth/auth.dto";

export interface ILoginAdmin {
    execute(dto: LoginAdminRequestDTO): Promise<LoginAdminResponseDTO>;
}