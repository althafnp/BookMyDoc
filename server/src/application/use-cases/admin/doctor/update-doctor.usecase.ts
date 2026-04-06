import { inject, injectable } from "inversify";
import { IDoctorAvailabilityRepository } from "../../../../domain/repositories/IDoctorAvailabiltyRepository";
import { IDoctorRepository } from "../../../../domain/repositories/IDoctorRepository";
import { DOCTOR_ERRORS, LOG_MESSAGES } from "../../../../shared/constants/Messages";
import { ConflictError, NotFoundError } from "../../../../shared/errors/HttpError";
import { UpdateDoctorRequestDTO, UpdateDoctorResponseDTO } from "../../../dtos/admin/doctor.dto";
import { IFileStorageService } from "../../../interfaces/IFileStorageService";
import { ILogger } from "../../../interfaces/ILogger";
import { DoctorResponseMapper } from "../../../mappers/admin/DoctorResponseMapper";
import { IUpdateDoctorUseCase } from "../../../ports/admin/doctor/IUpdateDoctorUseCase";
import { TYPES } from "../../../../di/types";

@injectable()
export class UpdateDoctorUseCase implements IUpdateDoctorUseCase {
    constructor(
        @inject(TYPES.IDoctorRepository) private _doctorRepository: IDoctorRepository,
        @inject(TYPES.IDoctorAvailabilityRepository) private _doctorAvailabilityRepository: IDoctorAvailabilityRepository,
        @inject(TYPES.IFileStorageService) private _fileStorageService: IFileStorageService,
        @inject(TYPES.ILogger) private _logger: ILogger,
    ) {}

    async execute(dto: UpdateDoctorRequestDTO): Promise<UpdateDoctorResponseDTO> {
        const doctor = await this._doctorRepository.findById(dto.id);
        if(!doctor) {
            throw new NotFoundError(DOCTOR_ERRORS.DOCTOR_NOT_FOUND);
        }

        if(dto.email !== doctor.email) {
            const existing = await this._doctorRepository.findByEmail(dto.email);
            if (existing) {
                throw new ConflictError(DOCTOR_ERRORS.DOCTOR_ALREADY_EXISTS);
            }
        };

        if (dto.profileImage) {
            await this._fileStorageService.delete(doctor.profileImage);
            const imageKey = `doctors/${Date.now()}-${dto.email}`;
            await this._fileStorageService.upload(
                dto.profileImage.buffer,
                dto.profileImage.mimetype,
                imageKey,
            );
            doctor.profileImage = imageKey;
        }

        doctor.name = dto.name;
        doctor.email = dto.email;
        doctor.categoryId = dto.categoryId;
        doctor.qualification = dto.qualification;
        doctor.experience = dto.experience;
        doctor.consultationFee = dto.consultationFee;

        const updatedDoctor = await this._doctorRepository.update(doctor);

        const availability = await this._doctorAvailabilityRepository.findByDoctorId(dto.id);
        if (!availability) {
            throw new NotFoundError(DOCTOR_ERRORS.AVAILABILITY_NOT_FOUND);
        }

        availability.updateTime(dto.availability.startTime, dto.availability.endTime);
        availability.updateSlotDuration(dto.availability.slotDuration);
        availability.updateWorkingDays(dto.availability.workingDays);

        const updatedAvailability = await this._doctorAvailabilityRepository.update(availability);

        this._logger.info(LOG_MESSAGES.DOCTOR_UPDATED, { doctorId: updatedDoctor!.id });

        return DoctorResponseMapper.toCreateDTO(updatedDoctor!, updatedAvailability!);
    }
}