import { BadRequestError } from "../../../../shared/errors/HttpError";

export const parseWithZod = <T>(
    schema: any,
    data: unknown
): T => {
    const result = schema.safeParse(data);

    if (!result.success) {
        const errors = result.error.issues.map((e: any) => ({
            field: e.path.join("."),
            message: e.message,
        }));

        throw new BadRequestError("Validation failed", errors);
    }

    return result.data;
};