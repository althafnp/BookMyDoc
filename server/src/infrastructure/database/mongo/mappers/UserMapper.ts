import { User } from "../../../../domain/entities/User";
import { IUser } from "../models/user.schema";
import { BaseMapper } from "./BaseMapper";

export class UserMapper extends BaseMapper<User, IUser> {

    static toDomain(raw: IUser): User {
        return new User(
            BaseMapper.toStringId(raw._id),
            raw.name,
            raw.email,
            raw.password,
            raw.providers,
            raw.role,
            raw.status,
            raw.emailVerified,
            raw.googleId,
            raw.profileImage
        );
    }

    static toPersistence(domain: User): Partial<IUser> {
        return {
            name: domain.name,
            email: domain.email,
            password: domain.getPassword(),
            providers: domain.providers,
            role: domain.role,
            status: domain.status,
            emailVerified: domain.emailVerified,
            googleId: domain.googleId,
            profileImage: domain.profileImage
        };
    }
}