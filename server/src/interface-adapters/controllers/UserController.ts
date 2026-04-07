import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { IGetAllUsersUseCase } from "../../application/ports/admin/user/IGetAllUsersUseCase";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { parseWithZod } from "../validators/zod-error.validator";
import { GetAllUsersRequestDTO, ToggleUserStatusRequestDTO } from "../../application/dtos/admin/user.dto";
import { getAllUsersSchema, userIdSchema } from "../validators/user.validator";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { ApiResponse } from "../../shared/utils/ApiResponse";
import { USER_SUCCESS } from "../../shared/constants/Messages";
import { IToggleUserStatusUseCase } from "../../application/ports/admin/user/IToggleUserStatusUseCase";

@injectable()
export class UserController {
    constructor(
        @inject(TYPES.IGetAllUsersUseCase) private _getAllUsersUseCase: IGetAllUsersUseCase,
        @inject(TYPES.IToggleUserStatusUseCase) private _toggleUserStatusUseCase: IToggleUserStatusUseCase,
    ) {}

    getAllUsers = asyncHandler(async (req, res) => {
        const dto = parseWithZod<GetAllUsersRequestDTO>(getAllUsersSchema, req.query);

        const result = await this._getAllUsersUseCase.execute(dto);

        res.status(HttpStatus.OK).json(
            ApiResponse.success(USER_SUCCESS.USERS_FETCHED, result)
        )
    });

    toggleUserStatus = asyncHandler(async (req, res) => {
        const dto = parseWithZod<ToggleUserStatusRequestDTO>(userIdSchema, req.params);

        const result = await this._toggleUserStatusUseCase.execute(dto);

        res.status(HttpStatus.OK).json(
            ApiResponse.success(USER_SUCCESS.USER_STATUS_TOGGLED, result)
        );
    })
}