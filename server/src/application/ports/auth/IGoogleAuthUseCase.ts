import { GoogleAuthRequestDTO, LoginUserResponseDTO } from "../../dtos/auth/auth.dto";

export interface IGoogleAuthUseCase {
    execute(dto: GoogleAuthRequestDTO): Promise<LoginUserResponseDTO>
}