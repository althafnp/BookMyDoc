import { ICategoryRepository } from "../../../../domain/repositories/ICategoryRepository";
import { CATEGORY_ERRORS, LOG_MESSAGES } from "../../../../shared/constants/Messages";
import { NotFoundError } from "../../../../shared/errors/HttpError";
import { ToggleCategoryStatusRequestDTO, ToggleCategoryStatusResponseDTO } from "../../../dtos/admin/category.dto";
import { ILogger } from "../../../interfaces/ILogger";
import { CategoryResponseMapper } from "../../../mappers/admin/CategoryResponseMapper";
import { IToggleCategoryStatus } from "../../../ports/admin/category/IToggleCategoryStatus";

export class ToggleCategoryStatusUseCase implements IToggleCategoryStatus {
    constructor(
        private _categoryRepository: ICategoryRepository,
        private _logger: ILogger
    ) {}

    async execute(dto: ToggleCategoryStatusRequestDTO): Promise<ToggleCategoryStatusResponseDTO> {
        const category = await this._categoryRepository.findById(dto.id);
        if(!category) {
            throw new NotFoundError(CATEGORY_ERRORS.CATEGORY_NOT_FOUND);
        }

        if(category.status === "ACTIVE") {
            category.deactivate();
        } else {
            category.activate();
        }

        const updated = await this._categoryRepository.update(category);

        this._logger.info(LOG_MESSAGES.CATEGORY_STATUS_TOGGLED, {
            categoryId: updated?.id,
            newStatus: updated?.status 
        });

        return CategoryResponseMapper.toDTO(updated!);
    }
}