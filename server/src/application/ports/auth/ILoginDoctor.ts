import { LoginDoctorRequestDTO, LoginDoctorResponseDTO } from "../../dtos/auth/auth.dto";

export interface ILoginDoctor {
    execute(dto: LoginDoctorRequestDTO): Promise<LoginDoctorResponseDTO>
}