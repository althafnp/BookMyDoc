import { emailSchema } from "@/utils/validators/emailSchema";
import { passwordSchema } from "@/utils/validators/passwordSchema";
import z from "zod";

export const forgotPasswordEmailSchema = z.object({
    email: emailSchema
});

export const resetPasswordSchema = z.object({
    password: passwordSchema,
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
})

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordEmailSchema>
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>
