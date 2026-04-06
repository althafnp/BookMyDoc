import z from "zod";
import { paginationSchema } from "./pagination.validator";

export const createCategorySchema = z.object({
    name: z.string().trim().min(1, "Category name is required")
});


export const updateCategorySchema = z.object({
    name: z.string().trim().min(1, "Category name is required")
});


export const categoryIdSchema = z.object({
    id: z.string().min(1, "Category id is required")
});


export const getAllCategoriesSchema = paginationSchema.extend({
    sortBy: z.enum(["name", "createdAt"]).default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
    status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
    search: z.string().trim().optional()
});