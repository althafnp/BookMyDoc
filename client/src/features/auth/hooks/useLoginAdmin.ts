import { useMutation } from "@tanstack/react-query";
import { loginAdmin } from "../api/authApi";

export const useLoginAdmin = () => {
    return useMutation({
        mutationFn: loginAdmin,
    })
}