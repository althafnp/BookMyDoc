import {
    ToggleCategoryStatusRequestDTO,
    ToggleCategoryStatusResponseDTO,
} from "../../../dtos/admin/category.dto";

export interface IToggleCategoryStatus {
    execute(dto: ToggleCategoryStatusRequestDTO): Promise<ToggleCategoryStatusResponseDTO>;
}