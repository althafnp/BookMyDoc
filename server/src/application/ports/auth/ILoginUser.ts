import { LoginUserRequestDTO, LoginUserResponseDTO } from "../../dtos/auth/auth.dto";

export interface ILoginUser {
    execute(dto: LoginUserRequestDTO): Promise<LoginUserResponseDTO>
}