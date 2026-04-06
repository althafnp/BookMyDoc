import { LoginUserRequestDTO, LoginUserResponseDTO } from "../../dtos/auth/auth.dto";

export interface ILoginUserUseCase {
    execute(dto: LoginUserRequestDTO): Promise<LoginUserResponseDTO>
}