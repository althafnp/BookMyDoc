import { LoginUserRequestDTO, LoginUserResponseDTO } from "../../dtos/auth";

export interface ILoginUser {
    execute(dto: LoginUserRequestDTO): Promise<LoginUserResponseDTO>
}