import { useMutation } from "@tanstack/react-query"
import type { ResetPasswordFormValues } from "../schemas/resetPassword";
import { resetDoctorPassword } from "../api/authApi";

type ResetPasswordInput = {
    token: string;
    data: ResetPasswordFormValues
}

export const useResetDoctorPassword = () => {
    return useMutation({
        mutationFn: ({ token, data }: ResetPasswordInput) => 
            resetDoctorPassword(token, data)
    });
}