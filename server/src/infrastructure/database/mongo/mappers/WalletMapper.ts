import { Wallet } from "../../../../domain/entities/Wallet";
import { IWallet } from "../models/wallet.schema";
import { BaseMapper } from "./BaseMapper";

export class WalletMapper extends BaseMapper<Wallet, IWallet> {

    static toDomain(raw: IWallet): Wallet {
        return new Wallet(
            BaseMapper.toStringId(raw._id),
            BaseMapper.toStringId(raw.userId),
            raw.balance
        );
    }

    static toPersistence(domain: Wallet): Partial<IWallet> {
        return {
            userId: BaseMapper.toObjectId(domain.userId),
            balance: domain.balance
        };
    }
}