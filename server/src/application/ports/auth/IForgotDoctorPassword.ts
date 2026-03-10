export interface IForgotDoctorPassword {
    execute(email: string): Promise<void>
}