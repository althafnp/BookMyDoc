import { GetAllCategoriesRequestDTO, GetAllCategoriesResponseDTO } from "../../../dtos/admin/category.dto";

export interface IGetAllCategoriesUseCase {
    execute(dto: GetAllCategoriesRequestDTO): Promise<GetAllCategoriesResponseDTO>;
}