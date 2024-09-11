import { z } from "zod";
import { ALLOWED_EQUIPMENT_STATES } from "../consts/equipment-states";

const listFormatter = new Intl.ListFormat("es", {
    type: "disjunction"
});
const allowedEquipmentMessage = listFormatter.format(ALLOWED_EQUIPMENT_STATES);

export const createEquipmentSchema = z.object({
    name: z.string().min(1, {
        message: "El nombre del equipamiento es requerido"
    }).max(255, {
        message: "El nombre del equipamiento no puede tener más de 255 caracteres"
    }),
    state: z.enum(ALLOWED_EQUIPMENT_STATES, {
        message: "Los estados disponibles de un equipo son: " + allowedEquipmentMessage
    }),
    description: z.string().min(1, {
        message: "La descripción del equipamiento es requerida"
    }),
    serialNumber: z.number({
        message: "El número de serie es requerido"
    }).int({
        message: "El número de serie debe ser un entero"
    }),
    location: z.string().min(1, {
        message: "La ubicación del equipo es requerida"
    }).max(255, {
        message: "La ubicación del equipo no puede tener más de 255 caracteres"
    }),
    make: z.string().min(1, {
        message: "La marca del equipo es requerida"
    }).max(255, {
        message: "La marca del equipo no puede tener más de 255 caracteres"
    }),
    organizationId: z.number({
        message: "El ID de organización es requerido"
    }).int({
        message: "El ID de organización debe ser un entero"
    }),
    typeId: z.number({
        message: "El ID de tipo es un entero"
    }).int({
        message: "El ID de tipo debe ser un entero"
    }),
    acquiredAt: z.date({
        coerce: true,
        message: "La fecha de adquisición es requerida"
    }).refine(date => {
        return date.getTime() < (new Date).getTime();
    }, {
        message: "La fecha de adquisición no puede ser futura"
    })
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