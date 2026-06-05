import { GetProfileResponseDTO, UpdateProfileRequestDTO } from "../../../dtos/user/profile.dto";

export interface IUpdateProfileUseCase {
    execute(userId: string, dto: UpdateProfileRequestDTO): Promise<GetProfileResponseDTO>;
}