import { injectable } from "inversify";
import { IDoctorAvailabilityRepository } from "../../../../domain/repositories/IDoctorAvailabiltyRepository";
import { DoctorAvailability } from "../../../../domain/entities/DoctorAvailability";
import { DoctorAvailabilityMapper } from "../mappers/DoctorAvailabilityMapper";
import { DoctorAvailabilityModel } from "../models/doctor-availability.schema";


@injectable()
export class MongoDoctorAvailbilityRepository implements IDoctorAvailabilityRepository {
    async create(availability: DoctorAvailability): Promise<DoctorAvailability> {
        const persistence = DoctorAvailabilityMapper.toPersistence(availability);

        const doc = await DoctorAvailabilityModel.create(persistence);

        return DoctorAvailabilityMapper.toDomain(doc);
    }

    async findByDoctorId(doctorId: string): Promise<DoctorAvailability | null> {
        const doc = await DoctorAvailabilityModel.findOne({ doctorId });
        
        return doc ? DoctorAvailabilityMapper.toDomain(doc) : null;
    }

    async findByDoctorIds(doctorIds: string[]): Promise<DoctorAvailability[]> {
        const docs = await DoctorAvailabilityModel.find({ doctorId: { $in: doctorIds } });
        
        return docs.map(DoctorAvailabilityMapper.toDomain);
    }

    async update(availability: DoctorAvailability): Promise<DoctorAvailability | null> {
        const persistence = DoctorAvailabilityMapper.toPersistence(availability);

        const doc = await DoctorAvailabilityModel.findByIdAndUpdate(
            availability.id,
            persistence,
            { returnDocument: "after" }
        );

        return doc ? DoctorAvailabilityMapper.toDomain(doc) : null;
    }
}