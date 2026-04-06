import { RefreshTokenResponseDTO } from "../../dtos/auth/auth.dto";

export interface IRefreshTokenUseCase {
    execute(token: string): Promise<RefreshTokenResponseDTO>
}