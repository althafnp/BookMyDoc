import { inject, injectable } from "inversify";
import { GetAllUsersRequestDTO, GetAllUsersResponseDTO } from "../../../dtos/admin/user.dto";
import { IGetAllUsersUseCase } from "../../../ports/admin/user/IGetAllUsersUseCase";
import { TYPES } from "../../../../di/types";
import { IUserRepository } from "../../../../domain/repositories/IUserRepository";
import { UserResponseMapper } from "../../../mappers/user/UserResponseMapper";

@injectable()
export class GetAllUsersUseCase implements IGetAllUsersUseCase {
    constructor(
        @inject(TYPES.IUserRepository) private _userRepository: IUserRepository
    ) {}

    async execute(dto: GetAllUsersRequestDTO): Promise<GetAllUsersResponseDTO> {
        const { users, total } = await this._userRepository.findAll(dto);

        return {
            items: users.map(UserResponseMapper.toListDTO),
            meta: {
                total,
                page: dto.page,
                limit: dto.limit,
                totalPages: Math.ceil(total / dto.limit)
            }
        }
    }
}