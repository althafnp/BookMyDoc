import { TYPES } from "../../../../di/types";
import { IToggleUserStatusUseCase } from "../../../ports/admin/user/IToggleUserStatusUseCase";
import { IUserRepository } from "../../../../domain/repositories/IUserRepository";
import { inject, injectable } from "inversify";
import { ToggleUserStatusRequestDTO, ToggleUserStatusResponseDTO } from "../../../dtos/admin/user.dto";
import { NotFoundError } from "../../../../shared/errors/HttpError";
import { ILogger } from "../../../interfaces/ILogger";
import { LOG_MESSAGES } from "../../../../shared/constants/Messages";
import { UserResponseMapper } from "../../../mappers/user/UserResponseMapper";

@injectable()
export class ToggleUserStatusUseCase implements IToggleUserStatusUseCase {
    constructor(
        @inject(TYPES.IUserRepository) private _userRepository: IUserRepository,
        @inject(TYPES.ILogger) private _logger: ILogger
    ) {}

    async execute(dto: ToggleUserStatusRequestDTO): Promise<ToggleUserStatusResponseDTO> {
        const user = await this._userRepository.findById(dto.id);
        if(!user) {
            throw new NotFoundError('User not found');
        }

        if(user.status === "ACTIVE") {
            user.deactivate()
        } else {
            user.activate()
        }

        const updated = await this._userRepository.update(user);

        this._logger.info(LOG_MESSAGES.USER_STATUS_TOGGLED, {
            userId: updated?.id,
            newStatus: updated?.status 
        });

        return UserResponseMapper.toToggleDTO(updated!)
    }
}