import { Status } from "../enums/Auth";

export class Category {
    constructor(
        public readonly id: string,
        public name: string,
        public status: Status = "ACTIVE"
    ) {}

    activate() {
        this.status = "ACTIVE"
    }

    deactivate() {
        this.status = "INACTIVE"
    }
}