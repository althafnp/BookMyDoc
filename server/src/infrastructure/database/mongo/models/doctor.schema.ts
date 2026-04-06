import { Document, model, Schema, Types } from "mongoose";
import { Status } from "../../../../domain/enums/Auth";


export interface IDoctor extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    profileImage: string,
    categoryId: Types.ObjectId;
    experience: string;
    qualification: string;
    consultationFee: number;
    status: Status;
    role: "DOCTOR";
}

const DoctorSchema: Schema = new Schema<IDoctor>(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        profileImage: {
            type: String,
            required: true
        },
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },
        qualification: {
            type: String,
            required: true
        },
        experience: {
            type: String,
            required: true
        },
        consultationFee: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ["ACTIVE", "INACTIVE"],
            default: "ACTIVE"
        },
        role: {
            type: String,
            default: 'DOCTOR'
        }
    },
    { timestamps: true }
);


export const DoctorModel = model<IDoctor>("Doctor", DoctorSchema);