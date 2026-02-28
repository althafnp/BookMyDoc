import { LoginUserResponseDTO } from "../../dtos/auth";

export interface IGoogleAuth {
    execute(googleToken: string): Promise<LoginUserResponseDTO>
}