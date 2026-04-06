import { Types } from "mongoose";

export abstract class BaseMapper {

    static toStringId(id: Types.ObjectId): string {
        return id.toString();
    }

    static toObjectId(id: string): Types.ObjectId {
        return new Types.ObjectId(id);
    }
}