import { ZodType } from "zod";
import { BadRequestError } from "../../shared/errors/HttpError";

export const parseWithZod = <T>(
    schema: ZodType<T>,
    data: unknown
): T => {
    const result = schema.safeParse(data);

    if (!result.success) {
        const errors = result.error.issues.map((e) => ({
            field: e.path.join("."),
            message: e.message,
        }));

        throw new BadRequestError("Validation failed", errors);
    }

    return result.data;
};