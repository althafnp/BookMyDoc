import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { ICreateCategory } from "../../application/ports/admin/category/ICreateCategory";
import { IGetAllCategories } from "../../application/ports/admin/category/IGetAllCategories";
import { IUpdateCategory } from "../../application/ports/admin/category/IUpdateCategory";
import { IToggleCategoryStatus } from "../../application/ports/admin/category/IToggleCategoryStatus";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { parseWithZod } from "../validators/zod-error.validator";
import { CreateCategoryRequestDTO, GetAllCategoriesRequestDTO, ToggleCategoryStatusRequestDTO, UpdateCategoryRequestDTO } from "../../application/dtos/admin/category.dto";
import { categoryIdSchema, createCategorySchema, getAllCategoriesSchema, updateCategorySchema } from "../validators/category.validators";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { ApiResponse } from "../../shared/utils/ApiResponse";
import { CATEGORY_SUCCESS } from "../../shared/constants/Messages";

@injectable()
export class CategoryController {
    constructor(
        @inject(TYPES.ICreateCategory) private _createCategoryUseCase: ICreateCategory,
        @inject(TYPES.IGetAllCategories) private _getAllCategoriesUseCase: IGetAllCategories,
        @inject(TYPES.IUpdateCategory) private _updateCategoryUseCase: IUpdateCategory,
        @inject(TYPES.IToggleCategoryStatus) private _toggleCategoryStatusUseCase: IToggleCategoryStatus,
    ) {}

    createCategory = asyncHandler(async (req, res) => {
        const dto = parseWithZod<CreateCategoryRequestDTO>(createCategorySchema, req.body);

        const result = await this._createCategoryUseCase.execute(dto);

        res.status(HttpStatus.CREATED).json(ApiResponse.success(CATEGORY_SUCCESS.CATEGORY_CREATED, result));
    });

    getAllCategories = asyncHandler(async (req, res) => {
        const dto = parseWithZod<GetAllCategoriesRequestDTO>(getAllCategoriesSchema, req.query);

        const result = await this._getAllCategoriesUseCase.execute(dto);

        res.status(HttpStatus.OK).json(ApiResponse.success(CATEGORY_SUCCESS.CATEGORIES_FETCHED, result));
    });

    updateCategory = asyncHandler(async (req, res) => {
        const { id } = parseWithZod<{ id: string }>(categoryIdSchema, req.params);
        const body = parseWithZod<{ name: string }>(updateCategorySchema, req.body);

        const dto: UpdateCategoryRequestDTO = { id, name: body.name };

        const result = await this._updateCategoryUseCase.execute(dto);

        res.status(HttpStatus.OK).json(ApiResponse.success(CATEGORY_SUCCESS.CATEGORY_UPDATED, result));
    });

    toggleCategoryStatus = asyncHandler(async (req, res) => {
        const dto = parseWithZod<ToggleCategoryStatusRequestDTO>(categoryIdSchema, req.params);

        const result = await this._toggleCategoryStatusUseCase.execute(dto);

        res.status(HttpStatus.OK).json(ApiResponse.success(CATEGORY_SUCCESS.CATEGORY_STATUS_TOGGLED, result));
    })
}