import { useMutation } from "@tanstack/react-query";
import { loginDoctor } from "../api/authApi";


export const useLoginDoctor = () => {
    return useMutation({
        mutationFn: loginDoctor,
    })
}