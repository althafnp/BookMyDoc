import { Schema, Document, model, Types } from "mongoose";
import { Status } from "../../../../domain/enums/Auth";

export interface IUser extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password?: string;
    providers: ("LOCAL" | "GOOGLE")[];
    googleId?: string;
    profileImage?: string;
    role: "USER";
    status: Status;
    emailVerified: boolean;
}

const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },

        password: {
            type: String
        },

        providers: {
            type: [String],
            enum: ["LOCAL", "GOOGLE"],
            required: true
        },

        googleId: {
            type: String
        },

        profileImage: {
            type: String
        },

        emailVerified: {
            type: Boolean,
            default: false
        },

        status: {
            type: String,
            enum: ["ACTIVE", "INACTIVE"],
            default: "ACTIVE"
        },
        role: {
            type: String,
            default: "USER"
        },
    },
    { timestamps: true }
);


export const UserModel = model<IUser>('User', UserSchema);