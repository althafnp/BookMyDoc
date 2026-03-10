import { emailSchema } from "@/utils/validators/emailSchema"
import { z } from "zod"

export const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, 'Password is required')
})

export type LoginFormValues = z.infer<typeof loginSchema>