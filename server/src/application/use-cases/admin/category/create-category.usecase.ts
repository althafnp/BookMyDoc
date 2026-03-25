import { Category } from "../../../../domain/entities/Category";
import { ICategoryRepository } from "../../../../domain/repositories/ICategoryRepository";
import { CATEGORY_ERRORS, LOG_MESSAGES } from "../../../../shared/constants/Messages";
import { ConflictError } from "../../../../shared/errors/HttpError";
import { CreateCategoryRequestDTO, CreateCategoryResponseDTO } from "../../../dtos/admin/category.dto";
import { ILogger } from "../../../interfaces/ILogger";
import { CategoryResponseMapper } from "../../../mappers/admin/CategoryResponseMapper";
import { ICreateCategory } from "../../../ports/admin/category/ICreateCategory";

export class CreateCategoryUseCase implements ICreateCategory {
    constructor(
        private _categoryRepository: ICategoryRepository,
        private _logger: ILogger
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