import { inject, injectable } from "inversify";
import { IDoctorRepository } from "../../../../domain/repositories/IDoctorRepository";
import { DOCTOR_ERRORS, LOG_MESSAGES } from "../../../../shared/constants/Messages";
import { NotFoundError } from "../../../../shared/errors/HttpError";
import { ToggleDoctorStatusRequestDTO, ToggleDoctorStatusResponseDTO } from "../../../dtos/admin/doctor.dto";
import { ILogger } from "../../../interfaces/ILogger";
import { DoctorResponseMapper } from "../../../mappers/admin/DoctorResponseMapper";
import { IToggleDoctorStatusUseCase } from "../../../ports/admin/doctor/IToggleDoctorStatusUseCase";
import { TYPES } from "../../../../di/types";

@injectable()
export class ToggleDoctorStatusUseCase implements IToggleDoctorStatusUseCase {
    constructor(
        @inject(TYPES.IDoctorRepository) private _doctorRepository: IDoctorRepository,
        @inject(TYPES.ILogger) private _logger: ILogger
    ) {}

    async execute(dto: ToggleDoctorStatusRequestDTO): Promise<ToggleDoctorStatusResponseDTO> {
        const doctor = await this._doctorRepository.findById(dto.id);
        if(!doctor) {
            throw new NotFoundError(DOCTOR_ERRORS.DOCTOR_NOT_FOUND);
        }

        if(doctor.status === "ACTIVE") {
            doctor.deactivate();
        } else {
            doctor.activate();
        };

        const updated = await this._doctorRepository.update(doctor);

        this._logger.info(LOG_MESSAGES.DOCTOR_STATUS_TOGGLED, {
            doctorId: updated?.id,
            newStatus: updated?.status 
        });

        return DoctorResponseMapper.toToggleDTO(updated!);
    }
}