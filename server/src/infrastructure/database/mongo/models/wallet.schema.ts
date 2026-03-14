import { Document, model, Schema, Types } from "mongoose";

export interface IWallet extends Document {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    balance: number
}

const WalletSchema: Schema = new Schema<IWallet>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },
        balance: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);

export const WalletModel = model<IWallet>("Wallet", WalletSchema);