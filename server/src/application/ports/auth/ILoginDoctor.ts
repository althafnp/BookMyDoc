import { LoginDoctorRequestDTO, LoginDoctorResponseDTO } from "../../dtos/auth";

export interface ILoginDoctor {
    execute(dto: LoginDoctorRequestDTO): Promise<LoginDoctorResponseDTO>
}