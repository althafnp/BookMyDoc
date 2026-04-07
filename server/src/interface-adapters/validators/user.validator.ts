import z from "zod";
import { paginationSchema } from "./pagination.validator";

export const getAllUsersSchema = paginationSchema.extend({
    sortBy: z.enum(["name", "createdAt"]).default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
    status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
    search: z.string().trim().optional(),
});

export const userIdSchema = z.object({
    id: z.string().min(1, "User id is required"),
});