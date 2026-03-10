import { useMutation } from "@tanstack/react-query"
import { forgotDoctorPassword } from "../api/authApi"

export const useForgotDoctorPassword = () => {
    return useMutation({
        mutationFn: forgotDoctorPassword
    })
}