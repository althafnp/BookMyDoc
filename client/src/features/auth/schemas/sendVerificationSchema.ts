import { emailSchema } from "@/utils/validators/emailSchema";
import z from "zod";

export const sendVerificationSchema = z.object({
    email: emailSchema
});


export type SendVerificationFormValues = z.infer<typeof sendVerificationSchema>;