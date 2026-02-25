import { User } from "../../../../domain/entities/User";
import { IUserRepository } from "../../../../domain/repositories/IUserRepository";
import { UserMapper } from "../../../../interface-adapters/mappers/UserMapper";
import { UserModel } from "../models/user.schema";

export class MongoUserRepository implements IUserRepository{
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
}