import { z } from "zod";
import { ALLOWED_EQUIPMENT_STATES } from "../consts/equipment-states";

const listFormatter = new Intl.ListFormat("es", {
    type: "disjunction"
});
const allowedEquipmentMessage = listFormatter.format(ALLOWED_EQUIPMENT_STATES);

export const createEquipmentUnitSchema = z.object({
    organizationId: z.number({
        message: "El ID de organización es requerido"
    }).int({
        message: "El ID de organización debe ser un entero"
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
    state: z.enum(ALLOWED_EQUIPMENT_STATES, {
        message: "Los estados disponibles de un equipo son: " + allowedEquipmentMessage
    }),
    equipmentId: z.number({
        message: "El ID de equipamiento es requerido"
    }).int({
        message: "El ID de equipamiento debe ser un entero"
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

export type CreateEquipmentUnitData = z.infer<typeof createEquipmentUnitSchema>;

export const equipmentUnitIdSchema = z.object({
    params: z.object({
        equipmentUnitId: z.number({
            coerce: true,
            message: "El ID de unidad es requerido"
        }).int({
            message: "El ID de unidad debe ser un entero"
        })
    })
});

export const updateEquipmentUnitSchema = z.intersection(z.object({
    body: createEquipmentUnitSchema.partial()
}), equipmentUnitIdSchema);

export type UpdateEquipmentUnitData = z.infer<typeof updateEquipmentUnitSchema>["body"];

export const registerMaintenanceForUnitSchema = z.object({
    body: z.object({
        maintenanceLocation: z.string().min(1, {
            message: "La ubicación de mantenimiento es requerida"
        }),
        startDate: z.date({
            coerce: true,
            message: "La fecha de inicio del mantenimiento es requerida"
        }),
        endDate: z.date({
            coerce: true,
            message: "La fecha de fin del mantenimiento es requerida"
        })
    }).refine(data => data.endDate > data.startDate, {
        message: "La fecha de fin debe ser futura a la de inicio"
    }),
}).and(equipmentUnitIdSchema);

export const registerDeliverySchema = z.object({}).and(equipmentUnitIdSchema);