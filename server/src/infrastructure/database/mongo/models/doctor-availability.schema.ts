import { Document, model, Schema, Types } from "mongoose";


export interface IDoctorAvailability extends Document {
    _id: Types.ObjectId;
    doctorId: Types.ObjectId;
    startTime: string;
    endTime: string;
    slotDuration: number;
    workingDays: number[];
}

const DoctorAvailabilitySchema = new Schema<IDoctorAvailability>(
    {
        doctorId: {
            type: Schema.Types.ObjectId,
            ref: "Doctor",
            required: true,
            unique: true
        },
        startTime: {
            type: String,
            required: true
        },
        endTime: {
            type: String,
            required: true
        },
        slotDuration: {
            type: Number,
            required: true
        },
        workingDays: {
            type: [Number],
            required: true
        }
    },
    {timestamps: true}
);


export const DoctorAvailabilityModel = model<IDoctorAvailability>("DoctorAvailability", DoctorAvailabilitySchema);