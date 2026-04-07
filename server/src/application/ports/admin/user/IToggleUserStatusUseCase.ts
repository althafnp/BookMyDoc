import { ToggleUserStatusRequestDTO, ToggleUserStatusResponseDTO } from "../../../dtos/admin/user.dto";

export interface IToggleUserStatusUseCase {
    execute(dto: ToggleUserStatusRequestDTO): Promise<ToggleUserStatusResponseDTO>
}