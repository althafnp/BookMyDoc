import { inject, injectable } from "inversify";
import { CreateDoctorRequestDTO, GetAllDoctorsRequestDTO, ToggleDoctorStatusRequestDTO, UpdateDoctorRequestDTO } from "../../application/dtos/admin/doctor.dto";
import { ICreateDoctorUseCase } from "../../application/ports/admin/doctor/ICreateDoctorUseCase";
import { TYPES } from "../../di/types";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { DOCTOR_SUCCESS } from "../../shared/constants/Messages";
import { BadRequestError } from "../../shared/errors/HttpError";
import { ApiResponse } from "../../shared/utils/ApiResponse";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { createDoctorSchema, doctorIdSchema, getAllDoctorsSchema, updateDoctorSchema } from "../validators/doctor.validator";
import { parseWithZod } from "../validators/zod-error.validator";
import { IUpdateDoctorUseCase } from "../../application/ports/admin/doctor/IUpdateDoctorUseCase";
import { IToggleDoctorStatusUseCase } from "../../application/ports/admin/doctor/IToggleDoctorStatusUseCase";
import { IGetAllDoctorsUseCase } from "../../application/ports/admin/doctor/IGetAllDoctorsUseCase";


@injectable()
export class DoctorController {
    constructor(
        @inject(TYPES.ICreateDoctorUseCase) private _createDoctorUseCase: ICreateDoctorUseCase,
        @inject(TYPES.IGetAllDoctorsUseCase) private _getAllDoctorsUseCase: IGetAllDoctorsUseCase,
        @inject(TYPES.IUpdateDoctorUseCase) private _updateDoctorUseCase: IUpdateDoctorUseCase,
        @inject(TYPES.IToggleDoctorStatusUseCase) private _toggleDoctorStatusUseCase: IToggleDoctorStatusUseCase,
    ) {}

    createDoctor = asyncHandler(async (req, res) => {
        // Parse availability from JSON string (sent via multipart/form-data)
        const body = {
            ...req.body,
            availability: typeof req.body.availability === "string"
                ? JSON.parse(req.body.availability)
                : req.body.availability
        }

        const validated = parseWithZod<Omit<CreateDoctorRequestDTO, "profileImage">>(createDoctorSchema, body);

        if(!req.file) {
            throw new BadRequestError("Profile image is required");
        }

        const dto: CreateDoctorRequestDTO = {
            ...validated,
            profileImage: {
                buffer: req.file.buffer,
                mimetype: req.file.mimetype
            }
        };

        const result = await this._createDoctorUseCase.execute(dto);

        res.status(HttpStatus.CREATED).json(
            ApiResponse.success(DOCTOR_SUCCESS.DOCTOR_CREATED, result)
        );
    });

    getAllDoctors = asyncHandler(async (req, res) => {
        const dto = parseWithZod<GetAllDoctorsRequestDTO>(getAllDoctorsSchema, req.query);

        const result = await this._getAllDoctorsUseCase.execute(dto);

        res.status(HttpStatus.OK).json(
            ApiResponse.success(DOCTOR_SUCCESS.DOCTORS_FETCHED, result)
        );
    })

    updateDoctor = asyncHandler(async (req, res) => {
        const { id } = parseWithZod<{ id: string }>(doctorIdSchema, req.params);

        const body = {
            ...req.body,
            availability: typeof req.body.availability === "string"
                ? JSON.parse(req.body.availability)
                : req.body.availability
        };

        const validated = parseWithZod<Omit<UpdateDoctorRequestDTO, "id" | "profileImage">>(updateDoctorSchema, body);

        const dto: UpdateDoctorRequestDTO = {
            id,
            ...validated,
            ...(req.file && {
                profileImage: {
                    buffer: req.file.buffer,
                    mimetype: req.file.mimetype 
                },
            })
        };

        const result = await this._updateDoctorUseCase.execute(dto);

        res.status(HttpStatus.OK).json(
            ApiResponse.success(DOCTOR_SUCCESS.DOCTOR_UPDATED, result)
        );
    });

    toggleDoctorStatus = asyncHandler(async (req, res) => {
        const dto = parseWithZod<ToggleDoctorStatusRequestDTO>(doctorIdSchema, req.params);

        const result = await this._toggleDoctorStatusUseCase.execute(dto);

        res.status(HttpStatus.OK).json(
            ApiResponse.success(DOCTOR_SUCCESS.DOCTOR_STATUS_TOGGLED, result)
        );
    });
}