import {
    UpdateCategoryRequestDTO,
    UpdateCategoryResponseDTO,
} from "../../../dtos/admin/category.dto";

export interface IUpdateCategoryUseCase {
    execute(dto: UpdateCategoryRequestDTO): Promise<UpdateCategoryResponseDTO>;
}