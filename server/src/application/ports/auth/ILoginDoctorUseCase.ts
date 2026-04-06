import { LoginDoctorRequestDTO, LoginDoctorResponseDTO } from "../../dtos/auth/auth.dto";

export interface ILoginDoctorUseCase {
    execute(dto: LoginDoctorRequestDTO): Promise<LoginDoctorResponseDTO>
}