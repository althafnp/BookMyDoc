export class DoctorAvailability {
    constructor(
        public readonly id: string,
        public doctorId: string,
        public startTime: string,
        public endTime: string,
        public slotDuration: number,
        public workingDays: number[]
    ) {}

    updateTime(startTime: string, endTime: string) {
        this.startTime = startTime;
        this.endTime = endTime;
    }

    updateSlotDuration(duration: number) {
        this.slotDuration = duration;
    }

    updateWorkingDays(days: number[]) {
        this.workingDays = days;
    }
}