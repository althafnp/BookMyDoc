import { GoogleAuthRequestDTO, LoginUserResponseDTO } from "../../dtos/auth";

export interface IGoogleAuth {
    execute(dto: GoogleAuthRequestDTO): Promise<LoginUserResponseDTO>
}