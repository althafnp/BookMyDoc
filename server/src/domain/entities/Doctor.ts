import { DoctorRole, DoctorStatus } from "../enums/Auth";

export class Doctor {
    constructor(
        public readonly id: string,
        public name: string,
        public email: string,
        private password: string,
        public categoryId: string,
        public profileImage: string,
        public qualification: string,
        public experience: string,
        public consultationFee: number,
        public status: DoctorStatus = "ACTIVE",
        public role: DoctorRole,
    ) {}

    changePassword(newPassword: string) {
        this.password = newPassword;
    }

    getPassword(): string {
        return this.password;
    }

    deactivate() {
        this.status = "INACTIVE";
    }

    activate() {
        this.status = "ACTIVE";
    }
}