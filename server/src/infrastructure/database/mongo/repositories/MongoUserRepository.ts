import { injectable } from "inversify";
import { User } from "../../../../domain/entities/User";
import { IUserRepository, UserFindAllOptions, UserFindAllResult } from "../../../../domain/repositories/IUserRepository";
import { UserMapper } from "../mappers/UserMapper";
import { UserModel } from "../models/user.schema";


@injectable()
export class MongoUserRepository implements IUserRepository {
    async create(user: User): Promise<User> {
        const persistence = UserMapper.toPersistence(user);

        const doc = await UserModel.create(persistence);

        return UserMapper.toDomain(doc);
    }

    async findById(id: string): Promise<User | null> {
        const doc = await UserModel.findById(id);
        return doc ? UserMapper.toDomain(doc) : null;
    }

    async findByEmail(email: string): Promise<User | null> {
        const doc = await UserModel.findOne({ email });
        return doc ? UserMapper.toDomain(doc) : null;
    }

    async update(user: User): Promise<User | null> {
        const persistence = UserMapper.toPersistence(user);

        const doc = await UserModel.findByIdAndUpdate(
            user.id,
            persistence,
            { returnDocument: 'after' }
        );

        return doc ? UserMapper.toDomain(doc) : null;
    }

    async findAll(options: UserFindAllOptions): Promise<UserFindAllResult> {
        const { page, limit, sortBy, sortOrder, status, search } = options;

        const filter: Record<string, unknown> = {};

        if(status) {
            filter.status = status;
        }

        const searchFields = ["name", "email"];

        if(search) {
            const regex = { $regex: search, $options: "i" }

            filter.$or = searchFields.map(field => ({
                [field]: regex
            }))
        };

        const skip = (page - 1) * limit;

        const sortDirection = sortOrder === "asc" ? 1 : -1;

        const [docs, total] = await Promise.all([
            UserModel.find(filter)
                .sort({ [sortBy]: sortDirection })
                .skip(skip)
                .limit(limit),
            UserModel.countDocuments(filter)
        ]);

        const users = docs.map(UserMapper.toDomain);

        return { users, total };
    }
}