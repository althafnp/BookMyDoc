import { ICategoryRepository } from "../../../../domain/repositories/ICategoryRepository";
import { GetAllCategoriesRequestDTO, GetAllCategoriesResponseDTO } from "../../../dtos/admin/category.dto";
import { CategoryResponseMapper } from "../../../mappers/admin/CategoryResponseMapper";
import { IGetAllCategories } from "../../../ports/admin/category/IGetAllCategories";

export class GetAllCategoriesUseCase implements IGetAllCategories {
    constructor(
        private _categoryRepository: ICategoryRepository
    ) {}

    async execute(dto: GetAllCategoriesRequestDTO): Promise<GetAllCategoriesResponseDTO> {
        const { categories, total } = await this._categoryRepository.findAll(dto);

        return {
            categories: categories.map(CategoryResponseMapper.toDTO),
            total,
            page: dto.page,
            limit: dto.limit,
            totalPages: Math.ceil(total / dto.limit)
        };
    }
}