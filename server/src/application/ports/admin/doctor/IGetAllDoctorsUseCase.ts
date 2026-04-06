import { GetAllDoctorsRequestDTO, GetAllDoctorsResponseDTO } from "../../../dtos/admin/doctor.dto";

export interface IGetAllDoctorsUseCase {
    execute(dto: GetAllDoctorsRequestDTO): Promise<GetAllDoctorsResponseDTO>;
}