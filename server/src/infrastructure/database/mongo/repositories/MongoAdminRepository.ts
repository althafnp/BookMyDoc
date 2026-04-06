import { Admin } from "../../../../domain/entities/Admin";
import { IAdminRepository } from "../../../../domain/repositories/IAdminRepository";
import { AdminMapper } from "../mappers/AdminMapper";
import { AdminModel } from "../models/admin.schema";

export class MongoAdminRepository implements IAdminRepository {

    async findById(id: string): Promise<Admin | null> {
        const doc = await AdminModel.findById(id);
        return doc ? AdminMapper.toDomain(doc) : null;
    }

    async findByEmail(email: string): Promise<Admin | null> {
        const doc = await AdminModel.findOne({ email });
        return doc ? AdminMapper.toDomain(doc) : null;
    }
}