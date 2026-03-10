import { useMutation } from "@tanstack/react-query";
import type { LoginFormValues } from "../schemas/loginSchema";
import { loginAdmin } from "../api/authApi";
import axios from "axios";

type UseLoginAdminProps = {
    setError: any,
}

export const useLoginAdmin = ({ setError }: UseLoginAdminProps) => {
    return useMutation({
        mutationFn: (data: LoginFormValues) => loginAdmin(data),

        onError: (err: any) => {
            console.log(err);
            if(axios.isAxiosError(err)) {
                const response = err?.response?.data;

                if(response?.errors && Array.isArray(response.errors)) {
                    response.errors.forEach((error: any) => {
                        setError(error.field as keyof LoginFormValues, {
                            type: 'server',
                            message: error.message
                        })
                    })
                }
                //Form-level errors
                else {
                    setError('root', {
                        type: 'server',
                        message: response?.message || "Something went wrong. Please try again."
                    })
                }
            } else {
                setError("root", {
                    type: "server",
                    message: "An unexpected error occured"
                })
            }
        }
    })
}