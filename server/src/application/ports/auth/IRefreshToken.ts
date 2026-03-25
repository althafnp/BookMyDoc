import { RefreshTokenResponseDTO } from "../../dtos/auth/auth.dto";

export interface IRefreshToken {
    execute(token: string): Promise<RefreshTokenResponseDTO>
}