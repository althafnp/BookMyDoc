import { GoogleAuthRequestDTO, LoginUserResponseDTO } from "../../dtos/auth/auth.dto";

export interface IGoogleAuth {
    execute(dto: GoogleAuthRequestDTO): Promise<LoginUserResponseDTO>
}