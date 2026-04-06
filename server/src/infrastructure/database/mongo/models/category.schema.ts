import { Document, model, Schema, Types } from "mongoose";
import { Status } from "../../../../domain/enums/Auth";

export interface ICategory extends Document {
    _id: Types.ObjectId;
    name: string;
    status: Status
}

const CategorySchema: Schema = new Schema<ICategory>(
    {
        name: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["ACTIVE", "INACTIVE"],
            default: "ACTIVE"
        }
    },
    { timestamps: true }
);

export const CategoryModel = model<ICategory>("Category", CategorySchema);