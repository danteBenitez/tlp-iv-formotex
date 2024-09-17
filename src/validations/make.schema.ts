import { z } from "zod";

export const createMakeSchema = z.object({
    name: z.string().min(1, {
        message: "El nombre de la marca es requerida",
    }).max(255, {
        message: "El nombre de la marca no puede tener más de 255 caracteres"
    }),
    description: z.string().min(1, {
        message: "La descripción de la marca es requerida",
    })
});

export type CreateMakeData = z.infer<typeof createMakeSchema>;

export const updateMakeSchema = z.object({
    body: createMakeSchema.partial(),
    params: z.object({
        makeId: z.number({
            coerce: true,
            message: "ID de tipo de equipamiento requerido"
        }).int({
            message: "ID de tipo de equipamiento debe ser un entero"
        })
    })
});

export type UpdateEquipmentTypeData = z.infer<typeof updateMakeSchema>;

export const makeIdSchema = z.object({
    params: z.object({
        makeId: z.number({
            coerce: true,
            message: "ID de equipamiento requerido"
        })
    })
});