import { z } from "zod";
import { createEquipmentUnitSchema } from "./equipment-unit.schema";

export const createEquipmentSchema = z.object({
    name: z.string().min(1, {
        message: "El nombre del equipamiento es requerido"
    }).max(255, {
        message: "El nombre del equipamiento no puede tener más de 255 caracteres"
    }),
    description: z.string().min(1, {
        message: "La descripción del equipamiento es requerida"
    }),
    makeId: z.number({
        message: "El ID de marca es requerido"
    }).int({
        message: "El ID de marca debe ser un entero"
    }),
    typeId: z.number({
        message: "El ID de tipo es un entero"
    }).int({
        message: "El ID de tipo debe ser un entero"
    }),
    // Permitimos que se nos pasen unidades del equipo
    // para crearlas y asociarlas automáticamente.
    // Como el equipo aún no ha sido creado, no pueden contener el ID
    // pero lo agregaremos al momento de la creación
    units: z.optional(createEquipmentUnitSchema.omit({ equipmentId: true }).array())
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
    body: createEquipmentSchema.omit({ units: true }).extend({
        // Permitimos que se nos pasen unidades para crear/actualizar
        // Las unidades a crear no contendrán un `equipmentId`, por lo que 
        // lo omitimos de la validación
        units: z.intersection(createEquipmentUnitSchema.omit({ equipmentId: true }),
            z.object({
                // Las unidades a actualizar tendrán un ID
                equipmentUnitId: z.number({
                    message: "ID numérico de unidad requerido"
                }).int({
                    message: "El ID de unidad debe ser un entero"
                }).optional(),
                // Las unidades que se tengan que borrar tendrán `deleted` en `true`
                deleted: z.boolean({
                    message: "El atributo de borrado debe ser un booleano"
                })
            })).array()
    }).partial(),
}), equipmentIdSchema);

export type UpdateEquipmentData = z.infer<typeof updateEquipmentSchema>["body"];