import api from "@/core/http/api"
import type { SignupFormValues } from "../schemas/signupSchema"

export const signupUser = async (data: SignupFormValues) => {
    const response = await api.post("/auth/signup", data)
    return response.data
}