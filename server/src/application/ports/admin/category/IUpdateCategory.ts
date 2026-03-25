import {
    UpdateCategoryRequestDTO,
    UpdateCategoryResponseDTO,
} from "../../../dtos/admin/category.dto";

export interface IUpdateCategory {
    execute(dto: UpdateCategoryRequestDTO): Promise<UpdateCategoryResponseDTO>;
}