import z from "zod";
import { paginationSchema } from "./pagination.validator";


export const availabilitySchema = z.object({
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    slotDuration: z.coerce.number().int().positive("Slot duration must be positive"),
    workingDays: z
        .array(z.coerce.number().int().min(0).max(6))
        .min(1, "At least one working day is required"),
})

export const createDoctorSchema = z.object({
    name: z.string().trim().min(1, "Doctor name is required"),
    email: z.string().trim().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    categoryId: z.string().min(1, "Category is required"),
    qualification: z.string().trim().min(1, "Qualification is required"),
    experience: z.string().trim().min(1, "Experience is required"),
    consultationFee: z.coerce.number().positive("Consultation fee must be positive"),
    availability: availabilitySchema,
});

export const updateDoctorSchema = z.object({
    name: z.string().trim().min(1, "Doctor name is required"),
    email: z.string().trim().email("Invalid email address"),
    categoryId: z.string().min(1, "Category is required"),
    qualification: z.string().trim().min(1, "Qualification is required"),
    experience: z.string().trim().min(1, "Experience is required"),
    consultationFee: z.coerce.number().positive("Consultation fee must be positive"),
    availability: availabilitySchema,
});

export const doctorIdSchema = z.object({
    id: z.string().min(1, "Doctor id is required"),
});


export const getAllDoctorsSchema = paginationSchema.extend({
    sortBy: z.enum(["name", "createdAt"]).default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
    status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
    categoryId: z.string().optional(),
    search: z.string().trim().optional(),
})