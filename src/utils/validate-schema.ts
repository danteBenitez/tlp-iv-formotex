import { Request } from "express";
import { Schema, z, ZodError } from "zod";

/**
 * Valida que una petición coincida con el {@link Schema}
 * dado.
 */
export async function validateRequestBody<TSchema extends Schema>(req: Request, schema: TSchema) {
    const { data, success, error } = await schema.safeParseAsync(req.body);
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

export async function validateRequest<TSchema extends Schema>(req: Request, schema: TSchema) {
    const { data, success, error } = await schema.safeParseAsync(req);
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

