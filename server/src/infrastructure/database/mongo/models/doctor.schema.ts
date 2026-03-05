import { Document, model, Schema, Types } from "mongoose";


export interface IDoctor extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    image: string,
    categoryId: Types.ObjectId;
    experience: string;
    qualification: string;
    consultationFee: number;
    isActive: boolean;
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
        image: {
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
        isActive: {
            type: Boolean,
            default: true
        },
        role: {
            type: String,
            default: 'DOCTOR'
        }
    },
    { timestamps: true }
)


export const DoctorModel = model<IDoctor>("Doctor", DoctorSchema);