import { Document, model, Schema, Types } from "mongoose";


export interface IAdmin extends Document {
    _id: Types.ObjectId;
    email: string;
    password: string;
    role: "ADMIN";
}

const AdminSchema = new Schema<IAdmin>(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            default: 'ADMIN'
        },
    }
);


export const AdminModel = model<IAdmin>('Admin', AdminSchema);