import z from "zod";

export const availabilitySchema = z.object({
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    slotDuration: z.coerce.number().int().positive("Slot duration must be positive"),
    workingDays: z.
        array(z.coerce.number().int().min(0).max(6))
        .min(1, "At least one working day is required")
});

export const createDoctorSchema = z.object({
    name: z.string().trim().min(1, "Doctor name is required"),
    email: z.string().trim().pipe(z.email("Invalid email address")),
    password: z.string().min(6, "Password must be at least 6 characters"),
    categoryId: z.string().min(1, "Category is required"),
    qualification: z.string().trim().min(1, "Qualification is required"),
    experience: z.string().trim().min(1, "Experience is required"),
    consultationFee: z.coerce.number().positive("Consultation fee must be positive"),
    profileImage: z
        .instanceof(File, { message: "Profile image is required" })
        .refine((f) => f.size > 0, "Profile image is required")
        .refine(
            (f) => ["image/jpeg", "image/png", "image/webp"].includes(f.type),
            "Only JPG, PNG, or WEBP images are allowed"
        ),
    availability: availabilitySchema
});


export const updateDoctorSchema = z.object({
    name: z.string().trim().min(1, "Doctor name is required"),
    email: z.string().trim().pipe(z.email("Invalid email address")),
    categoryId: z.string().min(1, "Category is required"),
    qualification: z.string().trim().min(1, "Qualification is required"),
    experience: z.string().trim().min(1, "Experience is required"),
    consultationFee: z.coerce.number().positive("Consultation fee must be positive"),
    profileImage: z
        .instanceof(File)
        .refine(
            (f) => ["image/jpeg", "image/png", "image/webp"].includes(f.type),
            "Only JPG, PNG, or WEBP images are allowed"
        )
        .optional(),
    availability: availabilitySchema
})


export type CreateDoctorFormValues = z.output<typeof createDoctorSchema>;


export type UpdateDoctorFormValues = z.output<typeof updateDoctorSchema>;


export type DoctorFormInput = {
    name: string;
    email: string;
    password?: string;
    categoryId: string;
    qualification: string;
    experience: string;
    consultationFee: number | string;
    profileImage?: File;
    availability: {
        startTime: string;
        endTime: string;
        slotDuration: number | string;
        workingDays: (number | string)[];
    };
};