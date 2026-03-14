import { Wallet } from "../entities/Wallet";

export interface IWalletRepository {
    create(wallet: Wallet): Promise<Wallet>;
}