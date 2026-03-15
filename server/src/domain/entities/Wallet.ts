export class Wallet {
    private _balance: number;

    constructor(
        public readonly id: string,
        public userId: string,
        balance: number = 0
    ) {
        this._balance = balance;
    }

    get balance(): number {
        return this._balance;
    }

    credit(amount: number) {
        if(amount <= 0) {
            throw new Error("Credit amount must be greater than zero");
        };

        this._balance += amount;
    }

    debit(amount: number) {
        if(amount <= 0) {
            throw new Error("Debit amount must be greater than zero");
        }

        if(amount > this._balance) {
            throw new Error("Insufficient wallet balance");
        }

        this._balance -= amount;
    }
}