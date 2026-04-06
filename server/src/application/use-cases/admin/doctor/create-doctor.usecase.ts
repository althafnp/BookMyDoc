import { inject, injectable } from "inversify";
import { Doctor } from "../../../../domain/entities/Doctor";
import { DoctorAvailability } from "../../../../domain/entities/DoctorAvailability";
import { IDoctorAvailabilityRepository } from "../../../../domain/repositories/IDoctorAvailabiltyRepository";
import { IDoctorRepository } from "../../../../domain/repositories/IDoctorRepository";
import { DOCTOR_ERRORS, LOG_MESSAGES } from "../../../../shared/constants/Messages";
import { ConflictError } from "../../../../shared/errors/HttpError";
import { CreateDoctorRequestDTO, CreateDoctorResponseDTO } from "../../../dtos/admin/doctor.dto";
import { IAppConfig } from "../../../interfaces/IAppConfig";
import { IEmailService } from "../../../interfaces/IEmailService";
import { IFileStorageService } from "../../../interfaces/IFileStorageService";
import { ILogger } from "../../../interfaces/ILogger";
import { IPasswordService } from "../../../interfaces/IPasswordService";
import { DoctorResponseMapper } from "../../../mappers/admin/DoctorResponseMapper";
import { ICreateDoctorUseCase } from "../../../ports/admin/doctor/ICreateDoctorUseCase";
import { TYPES } from "../../../../di/types";

@injectable()
export class CreateDoctorUseCase implements ICreateDoctorUseCase {
    constructor(
        @inject(TYPES.IDoctorRepository) private _doctorRepository: IDoctorRepository,
        @inject(TYPES.IDoctorAvailabilityRepository) private _doctorAvailabilityRepository: IDoctorAvailabilityRepository,
        @inject(TYPES.IPasswordService) private _passwordService: IPasswordService,
        @inject(TYPES.IFileStorageService) private _fileStorageService: IFileStorageService,
        @inject(TYPES.IEmailService) private _emailService: IEmailService,
        @inject(TYPES.IAppConfig) private _appConfig: IAppConfig,
        @inject(TYPES.ILogger) private _logger: ILogger,
    ) {}

    async execute(dto: CreateDoctorRequestDTO): Promise<CreateDoctorResponseDTO> {
        const existing = await this._doctorRepository.findByEmail(dto.email);
        if(existing) {
            throw new ConflictError(DOCTOR_ERRORS.DOCTOR_ALREADY_EXISTS);
        }

        const hashedPassword = await this._passwordService.hash(dto.password);

        const imageKey = `doctors/${Date.now()}-${dto.email}`;
        const imageUrl = `https://${this._appConfig.awsS3BucketName}.s3.${this._appConfig.awsRegion}.amazonaws.com/${imageKey}`;
        await this._fileStorageService.upload(
            dto.profileImage.buffer,
            dto.profileImage.mimetype,
            imageKey
        );

        const doctor = new Doctor(
            "",
            dto.name,
            dto.email,
            hashedPassword,
            dto.categoryId,
            imageUrl,
            dto.qualification,
            dto.experience,
            dto.consultationFee,
            "ACTIVE",
            "DOCTOR"        
        );

        const createdDoctor = await this._doctorRepository.create(doctor);

        const availability = new DoctorAvailability(
            "",
            createdDoctor.id,
            dto.availability.startTime,
            dto.availability.endTime,
            dto.availability.slotDuration,
            dto.availability.workingDays
        );

        const createdAvailability = await this._doctorAvailabilityRepository.create(availability);

        const loginUrl = `${this._appConfig.frontendUrl}/doctor/auth/login`;

        this._emailService.sendDoctorOnBoardingEmail(dto.email, dto.name, loginUrl)
            .catch((err) => this._logger.error("Failed to send doctor onboarding email", { error: err }));

        this._logger.info(LOG_MESSAGES.DOCTOR_CREATED, { doctorId: createdDoctor.id });

        return DoctorResponseMapper.toCreateDTO(createdDoctor, createdAvailability);
    }
}