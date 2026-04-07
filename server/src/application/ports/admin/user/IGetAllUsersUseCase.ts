import { GetAllUsersRequestDTO, GetAllUsersResponseDTO } from "../../../dtos/admin/user.dto";

export interface IGetAllUsersUseCase {
    execute(dto: GetAllUsersRequestDTO): Promise<GetAllUsersResponseDTO>;
};