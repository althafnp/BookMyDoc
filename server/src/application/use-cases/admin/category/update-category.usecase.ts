import { ICategoryRepository } from "../../../../domain/repositories/ICategoryRepository";
import { CATEGORY_ERRORS, LOG_MESSAGES } from "../../../../shared/constants/Messages";
import { ConflictError, NotFoundError } from "../../../../shared/errors/HttpError";
import { UpdateCategoryRequestDTO, UpdateCategoryResponseDTO } from "../../../dtos/admin/category.dto";
import { ILogger } from "../../../interfaces/ILogger";
import { CategoryResponseMapper } from "../../../mappers/admin/CategoryResponseMapper";
import { IUpdateCategory } from "../../../ports/admin/category/IUpdateCategory";

export class UpdateCategoryUseCase implements IUpdateCategory {
    constructor(
        private _categoryRepository: ICategoryRepository,
        private _logger: ILogger
    ) {}

    async execute(dto: UpdateCategoryRequestDTO): Promise<UpdateCategoryResponseDTO> {
        const category = await this._categoryRepository.findById(dto.id);
        if(!category) {
            throw new NotFoundError(CATEGORY_ERRORS.CATEGORY_NOT_FOUND);
        };

        const existing = await this._categoryRepository.findByName(dto.name);
        if(existing) {
            throw new ConflictError(CATEGORY_ERRORS.CATEGORY_ALREADY_EXISTS);
        };

        category.name = dto.name;

        const updated = await this._categoryRepository.update(category);

        this._logger.info(LOG_MESSAGES.CATEGORY_UPDATED, { category: updated });

        return CategoryResponseMapper.toDTO(updated!);
    }
}