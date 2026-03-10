import { Admin } from "../../../../domain/entities/Admin"
import { IAdmin } from "../models/admin.schema"
import { BaseMapper } from "./BaseMapper"


export class AdminMapper extends BaseMapper<Admin, IAdmin> {
    static toDomain(raw: IAdmin): Admin {
        return new Admin(
            BaseMapper.toStringId(raw._id),
            raw.email,
            raw.password,
            raw.role
        )
    }

    static toPersistence(domain: Admin): Partial<IAdmin> {
        return {
            email: domain.email,
            password: domain.getPassword(),
            role: domain.role
        }
    }
}