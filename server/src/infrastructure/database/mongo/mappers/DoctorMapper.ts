import { Doctor } from "../../../../domain/entities/Doctor";
import { IDoctor } from "../models/doctor.schema";
import { BaseMapper } from "./BaseMapper";

export class DoctorMapper {
    
    static toDomain(raw: IDoctor): Doctor {
        return new Doctor(
            BaseMapper.toStringId(raw._id),
            raw.name,
            raw.email,
            raw.password,
            BaseMapper.toStringId(raw.categoryId),
            raw.profileImage,
            raw.qualification,
            raw.experience,
            raw.consultationFee,
            raw.status,
            raw.role
        );
    }

    static toPersistence(domain: Doctor): Partial<IDoctor> {
        return {
            name: domain.name,
            email: domain.email,
            password: domain.getPassword(),
            categoryId: BaseMapper.toObjectId(domain.categoryId),
            profileImage: domain.profileImage,
            qualification: domain.qualification,
            experience: domain.experience,
            consultationFee: domain.consultationFee,
            status: domain.status,
            role: domain.role
        };
    }
}