import { DoctorAvailability } from "../../../../domain/entities/DoctorAvailability";
import { IDoctorAvailability } from "../models/doctor-availability.schema";
import { BaseMapper } from "./BaseMapper";

export class DoctorAvailabilityMapper {

    static toDomain(raw: IDoctorAvailability): DoctorAvailability {
        return new DoctorAvailability(
            BaseMapper.toStringId(raw._id),
            BaseMapper.toStringId(raw.doctorId),
            raw.startTime,
            raw.endTime,
            raw.slotDuration,
            raw.workingDays
        );
    }

    static toPersistence(domain: DoctorAvailability): Partial<IDoctorAvailability> {
        return {
            doctorId: BaseMapper.toObjectId(domain.doctorId),
            startTime: domain.startTime,
            endTime: domain.endTime,
            slotDuration: domain.slotDuration,
            workingDays: domain.workingDays
        };
    }
}