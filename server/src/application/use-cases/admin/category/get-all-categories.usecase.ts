import { inject, injectable } from "inversify";
import { ICategoryRepository } from "../../../../domain/repositories/ICategoryRepository";
import { GetAllCategoriesRequestDTO, GetAllCategoriesResponseDTO } from "../../../dtos/admin/category.dto";
import { CategoryResponseMapper } from "../../../mappers/admin/CategoryResponseMapper";
import { IGetAllCategoriesUseCase } from "../../../ports/admin/category/IGetAllCategoriesUseCase";
import { TYPES } from "../../../../di/types";

@injectable()
export class GetAllCategoriesUseCase implements IGetAllCategoriesUseCase {
    constructor(
        @inject(TYPES.ICategoryRepository) private _categoryRepository: ICategoryRepository
    ) {}

    async execute(dto: GetAllCategoriesRequestDTO): Promise<GetAllCategoriesResponseDTO> {
        const { categories, total } = await this._categoryRepository.findAll(dto);

        return {
            items: categories.map(CategoryResponseMapper.toDTO),
            meta: {
                total,
                page: dto.page,
                limit: dto.limit,
                totalPages: Math.ceil(total / dto.limit)
            }
        };
    }
}