import z from "zod";

export const signupSchema = z.object({
    name: z.string().min(1, "Name is required"),

    email: z
        .string()
        .min(1, "Email is required")
        .email("Enter a valid email"),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/,
            "Password must contain letter, number, and special character"
        ),

    confirmPassword: z.string().min(1, "Please confirm your password"),
})
.refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})