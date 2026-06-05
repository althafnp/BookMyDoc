import { inject, injectable } from "inversify";
import { TYPES } from "../../../di/types";
import { IGetProfileUseCase } from "../../../application/ports/user/profile/IGetProfileUseCase";
import { asyncHandler } from "../../../shared/utils/asyncHandler";
import { UnauthorizedError } from "../../../shared/errors/HttpError";
import { HttpStatus } from "../../../shared/constants/HttpStatus";
import { ApiResponse } from "../../../shared/utils/ApiResponse";
import { IUpdateProfileUseCase } from "../../../application/ports/user/profile/IUpdateProfileUseCase";
import { UpdateProfileRequestDTO } from "../../../application/dtos/user/profile.dto";
import { parseWithZod } from "../../validators/zod-error.validator";
import { updateUserProfileSchema } from "../../validators/profile.validator";

@injectable()
export class UserProfileController {
    constructor(
        @inject(TYPES.IGetProfileUseCase) private _getProfileUseCase: IGetProfileUseCase,
        @inject(TYPES.IUpdateProfileUseCase) private _updateProfileUseCase: IUpdateProfileUseCase,
    ) {}

    getProfile = asyncHandler(async (req, res) => {
        const userId = req.user?.id;
        if (!userId) {
            throw new UnauthorizedError();
        }

        const result = await this._getProfileUseCase.execute(userId);

        res.status(HttpStatus.OK).json(
            ApiResponse.success("Profile fetched successfully", result)
        );
    });

    
    updateProfile = asyncHandler(async (req, res) => {
        const userId = req.user?.id;
        if (!userId) {
            throw new UnauthorizedError();
        };

        const { name } = parseWithZod(updateUserProfileSchema, req.body);
        console.log(req.body)

        const dto: UpdateProfileRequestDTO = {
            name,
            removeImage: req.body.removeImage === "true",
            profileImage: req.file
                ? { buffer: req.file.buffer, mimetype: req.file.mimetype }
                : undefined,
        };

        const result = await this._updateProfileUseCase.execute(userId, dto);

        res.status(HttpStatus.OK).json(
            ApiResponse.success("Profile updated successfully", result)
        );
    });
}