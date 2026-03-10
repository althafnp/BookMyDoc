import { injectable } from "inversify";
import { Doctor } from "../../../../domain/entities/Doctor";
import { IDoctorRepository } from "../../../../domain/repositories/IDoctorRepository";
import { DoctorMapper } from "../mappers/DoctorMapper";
import { DoctorModel } from "../models/doctor.schema";


@injectable()
export class MongoDoctorRepository implements IDoctorRepository{
    async findById(id: string): Promise<Doctor | null> {
        const doc = await DoctorModel.findById(id);
        return doc ? DoctorMapper.toDomain(doc) : null;
    };

    async findByEmail(email: string): Promise<Doctor | null> {
        const doc = await DoctorModel.findOne({ email });
        return doc ? DoctorMapper.toDomain(doc) : null;
    }

    async update(doctor: Doctor): Promise<Doctor | null> {
        const persistence = DoctorMapper.toPersistence(doctor);

        const doc = await DoctorModel.findByIdAndUpdate(
            doctor.id,
            persistence,
            { returnDocument: "after" }
        );

        return doc ? DoctorMapper.toDomain(doc) : null;
    }
}