import { inject, injectable } from "inversify";
import { IDoctorRepository } from "../../../../domain/repositories/IDoctorRepository";
import { GetAllDoctorsRequestDTO, GetAllDoctorsResponseDTO } from "../../../dtos/admin/doctor.dto";
import { DoctorResponseMapper } from "../../../mappers/admin/DoctorResponseMapper";
import { IGetAllDoctorsUseCase } from "../../../ports/admin/doctor/IGetAllDoctorsUseCase";
import { TYPES } from "../../../../di/types";
import { IDoctorAvailabilityRepository } from "../../../../domain/repositories/IDoctorAvailabiltyRepository";

@injectable()
export class GetAllDoctorsUseCase implements IGetAllDoctorsUseCase {
    constructor(
        @inject(TYPES.IDoctorRepository) private _doctorRepository: IDoctorRepository,
        @inject(TYPES.IDoctorAvailabilityRepository) private _doctorAvailabilityRepository: IDoctorAvailabilityRepository
    ) {}

    async execute(dto: GetAllDoctorsRequestDTO): Promise<GetAllDoctorsResponseDTO> {
        const { doctors, total } = await this._doctorRepository.findAll(dto);

        const doctorIds = doctors.map(d => d.id);

        const availabilityList = await this._doctorAvailabilityRepository.findByDoctorIds(doctorIds);

        const availabilityMap = new Map(
            availabilityList.map(a => [a.doctorId, a])
        );

        const items = doctors.map(doctor => 
            DoctorResponseMapper.toListDTO(doctor, availabilityMap.get(doctor.id) || null)
        )

        return {
            items,
            meta: {
                total,
                page: dto.page,
                limit: dto.limit,
                totalPages: Math.ceil(total / dto.limit)
            }
        }
    }
} 