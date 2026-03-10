import { emailSchema } from "@/utils/validators/emailSchema";
import { passwordSchema } from "@/utils/validators/passwordSchema";
import z from "zod";

export const signupSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be atleast 2 characters")
        .max(50, "Name must be less than 50 characters"),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string()

}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});


export type SignupFormValues = z.infer<typeof signupSchema>;