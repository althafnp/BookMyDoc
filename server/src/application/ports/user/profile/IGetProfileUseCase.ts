import { GetProfileResponseDTO } from "../../../dtos/user/profile.dto";

export interface IGetProfileUseCase {
    execute(userId: string): Promise<GetProfileResponseDTO>;
}
