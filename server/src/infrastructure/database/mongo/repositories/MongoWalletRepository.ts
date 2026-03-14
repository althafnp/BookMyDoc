import { injectable } from "inversify";
import { Wallet } from "../../../../domain/entities/Wallet";
import { IWalletRepository } from "../../../../domain/repositories/IWalletRepository";
import { WalletMapper } from "../mappers/WalletMapper";
import { WalletModel } from "../models/wallet.schema";

@injectable()
export class MongoWalletRepository implements IWalletRepository {
    async create(wallet: Wallet): Promise<Wallet> {
        const persistence = WalletMapper.toPersistence(wallet);

        const doc = await WalletModel.create(persistence);

        return WalletMapper.toDomain(doc);
    }
}