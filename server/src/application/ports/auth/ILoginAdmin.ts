import { LoginAdminRequestDTO, LoginAdminResponseDTO } from "../../dtos/auth";

export interface ILoginAdmin {
    execute(dto: LoginAdminRequestDTO): Promise<LoginAdminResponseDTO>;
}