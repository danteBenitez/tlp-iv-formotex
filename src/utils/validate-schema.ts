import { Request } from "express";
import { Schema, z, ZodError } from "zod";

/**
 * Valida que una petición coincida con el {@link Schema}
 * dado.
 */
export async function validateRequest<TSchema extends Schema>(req: Request, schema: TSchema, key: keyof Request = "body") {
    const { data, success, error } = await schema.safeParseAsync(req[key]);
    if (!success) {
        return {
            data,
            success,
            error: error as ZodError
        };
    }

    return {
        data: data as z.infer<TSchema>,
        success,
        error
    }
}