import {
    ToggleCategoryStatusRequestDTO,
    ToggleCategoryStatusResponseDTO,
} from "../../../dtos/admin/category.dto";

export interface IToggleCategoryStatusUseCase {
    execute(dto: ToggleCategoryStatusRequestDTO): Promise<ToggleCategoryStatusResponseDTO>;
}