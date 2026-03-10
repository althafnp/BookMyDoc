import { RefreshTokenResponseDTO } from "../../dtos/auth";

export interface IRefreshToken {
    execute(token: string): Promise<RefreshTokenResponseDTO>
}