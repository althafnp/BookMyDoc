import { Types } from "mongoose";

export abstract class BaseMapper<Domain, Persistence> {
    public static toStringId(id: Types.ObjectId): string {
        return id.toString();
    }

    public static toObjectId(id: string): Types.ObjectId {
        return new Types.ObjectId(id);
    }
}