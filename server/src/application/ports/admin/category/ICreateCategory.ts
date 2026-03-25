import { CreateCategoryRequestDTO, CreateCategoryResponseDTO } from "../../../dtos/admin/category.dto";

export interface ICreateCategory {
    execute(dto: CreateCategoryRequestDTO): Promise<CreateCategoryResponseDTO>
}