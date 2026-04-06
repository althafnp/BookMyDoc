import { inject, injectable } from "inversify";
import { Category } from "../../../../domain/entities/Category";
import { ICategoryRepository } from "../../../../domain/repositories/ICategoryRepository";
import { CATEGORY_ERRORS, LOG_MESSAGES } from "../../../../shared/constants/Messages";
import { ConflictError } from "../../../../shared/errors/HttpError";
import { CreateCategoryRequestDTO, CreateCategoryResponseDTO } from "../../../dtos/admin/category.dto";
import { ILogger } from "../../../interfaces/ILogger";
import { CategoryResponseMapper } from "../../../mappers/admin/CategoryResponseMapper";
import { ICreateCategoryUseCase } from "../../../ports/admin/category/ICreateCategoryUseCase";
import { TYPES } from "../../../../di/types";

@injectable()
export class CreateCategoryUseCase implements ICreateCategoryUseCase {
    constructor(
        @inject(TYPES.ICategoryRepository) private _categoryRepository: ICategoryRepository,
        @inject(TYPES.ILogger) private _logger: ILogger
    ) {}

    async execute(dto: CreateCategoryRequestDTO): Promise<CreateCategoryResponseDTO> {
        const { name } = dto;

        const existing = await this._categoryRepository.findByName(name);
        if(existing) {
            throw new ConflictError(CATEGORY_ERRORS.CATEGORY_ALREADY_EXISTS);
        }

        const category = new Category("", name);

        const created = await this._categoryRepository.create(category);

        this._logger.info(LOG_MESSAGES.CATEGORY_CREATED, { category: created });

        return CategoryResponseMapper.toDTO(category);
    }
}