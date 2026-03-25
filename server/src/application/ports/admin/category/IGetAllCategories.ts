import { GetAllCategoriesRequestDTO, GetAllCategoriesResponseDTO } from "../../../dtos/admin/category.dto";

export interface IGetAllCategories {
    execute(dto: GetAllCategoriesRequestDTO): Promise<GetAllCategoriesResponseDTO>;
}