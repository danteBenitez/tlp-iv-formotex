import { z } from "zod";

export const createEquipmentSchema = z.object({
    name: z.string().min(1, {
        message: "El nombre del equipamiento es requerido"
    }).max(255, {
        message: "El nombre del equipamiento no puede tener más de 255 caracteres"
    }),
    description: z.string().min(1, {
        message: "La descripción del equipamiento es requerida"
    }),
    make: z.string().min(1, {
        message: "La marca del equipo es requerida"
    }).max(255, {
        message: "La marca del equipo no puede tener más de 255 caracteres"
    }),
    typeId: z.number({
        message: "El ID de tipo es un entero"
    }).int({
        message: "El ID de tipo debe ser un entero"
    }),
});


export type CreateEquipmentData = z.infer<typeof createEquipmentSchema>;

export const equipmentIdSchema = z.object({
    params: z.object({
        equipmentId: z.number({
            coerce: true,
            message: "El ID del equipo es requerido"
        }).int({
            message: "El ID del equipo debe ser un entero"
        })
    })
})

export const updateEquipmentSchema = z.intersection(z.object({
    body: createEquipmentSchema.partial(),
}), equipmentIdSchema);

export type UpdateEquipmentData = z.infer<typeof updateEquipmentSchema>["body"];