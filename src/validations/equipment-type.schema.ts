import { z } from "zod";

export const createEquipmentTypeSchema = z.object({
    name: z.string().min(1, {
        message: "El nombre del tipo es requerido",
    }).max(255, {
        message: "El nombre del tipo no puede tener más de 255 caracteres"
    }),
    description: z.string().min(1, {
        message: "La descripción del tipo es requerida",
    })
});

export type CreateEquipmentTypeData = z.infer<typeof createEquipmentTypeSchema>;

export const updateEquipmentTypeSchema = z.object({
    body: createEquipmentTypeSchema.partial(),
    params: z.object({
        equipmentTypeId: z.number({
            coerce: true,
            message: "ID de tipo de equipamiento requerido"
        }).int({
            message: "ID de tipo de equipamiento debe ser un entero"
        })
    })
});

export type UpdateEquipmentTypeData = z.infer<typeof updateEquipmentTypeSchema>;

export const equipmentTypeIdSchema = z.object({
    params: z.object({
        equipmentTypeId: z.number({
            coerce: true,
            message: "ID de equipamiento requerido"
        })
    })
});