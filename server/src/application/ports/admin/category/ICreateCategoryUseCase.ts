import { CreateCategoryRequestDTO, CreateCategoryResponseDTO } from "../../../dtos/admin/category.dto";

export interface ICreateCategoryUseCase {
    execute(dto: CreateCategoryRequestDTO): Promise<CreateCategoryResponseDTO>
}