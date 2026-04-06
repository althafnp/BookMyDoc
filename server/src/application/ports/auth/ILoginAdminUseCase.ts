import { LoginAdminRequestDTO, LoginAdminResponseDTO } from "../../dtos/auth/auth.dto";

export interface ILoginAdminUseCase {
    execute(dto: LoginAdminRequestDTO): Promise<LoginAdminResponseDTO>;
}