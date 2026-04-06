import { injectable } from "inversify";
import { Doctor } from "../../../../domain/entities/Doctor";
import { DoctorFindAllOptions, DoctorFindAllResult, IDoctorRepository } from "../../../../domain/repositories/IDoctorRepository";
import { DoctorMapper } from "../mappers/DoctorMapper";
import { DoctorModel } from "../models/doctor.schema";
import { Types } from "mongoose";


@injectable()
export class MongoDoctorRepository implements IDoctorRepository {
    async create(doctor: Doctor): Promise<Doctor> {
        const persistence = DoctorMapper.toPersistence(doctor);

        const doc = await DoctorModel.create(persistence);

        return DoctorMapper.toDomain(doc);
    }

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

    async findAll(options: DoctorFindAllOptions): Promise<DoctorFindAllResult> {
        const { page, limit, sortBy, sortOrder, categoryId, status, search } = options;

        const filter: Record<string, unknown> = {};

        if(status) {
            filter.status = status;
        }

        if(categoryId) {
            filter.categoryId = new Types.ObjectId(categoryId);
        }

        const searchFields = ["name", "email"];

        if(search) {
            const regex = { $regex: search, $options: "i" }

            filter.$or = searchFields.map(field => ({
                [field]: regex
            }))
        }

        const skip = (page - 1) * limit;
        const sortDirection = sortOrder === "asc" ? 1 : -1;

        const [docs, total] = await Promise.all([
            DoctorModel.find(filter)
                .sort({ [sortBy]: sortDirection })
                .skip(skip)
                .limit(limit),
            DoctorModel.countDocuments(filter),    
        ]);

        const doctors = docs.map(DoctorMapper.toDomain);

        return { doctors, total };
    }
}