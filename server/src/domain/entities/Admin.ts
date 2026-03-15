import { AdminRole } from "../enums/Auth";

export class Admin {
    constructor(
        public readonly id: string,
        public email: string,
        private password: string,
        public role: AdminRole,
    ) {}

    getPassword(): string {
        return this.password;
    }
}
