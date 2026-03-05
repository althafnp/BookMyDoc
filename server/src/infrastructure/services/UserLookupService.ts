import { inject, injectable } from "inversify";
import { IUserLookupService, UserInfo } from "../../application/interfaces/IUserLookupService";
import { Role } from "../../domain/enums/Auth";
import { TYPES } from "../../di/types";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IDoctorRepository } from "../../domain/repositories/IDoctorRepository";
import { IAdminRepository } from "../../domain/repositories/IAdminRepository";


@injectable()
export class UserLookupService implements IUserLookupService {
    constructor(
        @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
        @inject(TYPES.IDoctorRepository) private doctorRepository: IDoctorRepository,
        @inject(TYPES.IAdminRepository) private adminRepository: IAdminRepository,
    ) {}

    async findByIdAndRole(id: string, role: Role): Promise<UserInfo | null> {
        switch (role) {
            case "USER": {
                const user = await this.userRepository.findById(id);
                if(!user) return null;

                return { id: user.id, name: user.name, email: user.email, role: "USER", profileImage: user.profileImage }
            }
            case "DOCTOR": {
                const doctor = await this.doctorRepository.findById(id);
                if(!doctor) return null;

                return { id: doctor.id, name: doctor.name, email: doctor.email, role: "DOCTOR", profileImage: doctor.image }
            }
            case "ADMIN": {
                const admin = await this.adminRepository.findById(id);
                if(!admin) return null;

                return { id: admin.id, email: admin.email, role: "ADMIN" };
            }
        }
    }
}