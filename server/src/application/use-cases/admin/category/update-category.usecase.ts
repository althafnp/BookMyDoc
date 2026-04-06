import { inject, injectable } from "inversify";
import { ICategoryRepository } from "../../../../domain/repositories/ICategoryRepository";
import { CATEGORY_ERRORS, LOG_MESSAGES } from "../../../../shared/constants/Messages";
import { ConflictError, NotFoundError } from "../../../../shared/errors/HttpError";
import { UpdateCategoryRequestDTO, UpdateCategoryResponseDTO } from "../../../dtos/admin/category.dto";
import { ILogger } from "../../../interfaces/ILogger";
import { CategoryResponseMapper } from "../../../mappers/admin/CategoryResponseMapper";
import { IUpdateCategoryUseCase } from "../../../ports/admin/category/IUpdateCategoryUseCase";
import { TYPES } from "../../../../di/types";

@injectable()
export class UpdateCategoryUseCase implements IUpdateCategoryUseCase {
    constructor(
        @inject(TYPES.ICategoryRepository) private _categoryRepository: ICategoryRepository,
        @inject(TYPES.ILogger) private _logger: ILogger
    ) {}

    async execute(dto: UpdateCategoryRequestDTO): Promise<UpdateCategoryResponseDTO> {
        const category = await this._categoryRepository.findById(dto.id);
        if(!category) {
            throw new NotFoundError(CATEGORY_ERRORS.CATEGORY_NOT_FOUND);
        };

        if(dto.name !== category.name) {
            const existing = await this._categoryRepository.findByName(dto.name);
            if(existing) {
                throw new ConflictError(CATEGORY_ERRORS.CATEGORY_ALREADY_EXISTS);
            };
        }

        category.name = dto.name;

        const updated = await this._categoryRepository.update(category);

        this._logger.info(LOG_MESSAGES.CATEGORY_UPDATED, { category: updated });

        return CategoryResponseMapper.toDTO(updated!);
    }
}