export const EQUIPMENT_STATES = {
    OK: "En buen estado",
    NEEDS_REPAIR: "Necesita reparaciones",
    DELIVERED: "Entregado a empresa",
    IN_MAINTENANCE: "En mantenimiento"
};

export type EquipmentState = typeof EQUIPMENT_STATES[keyof typeof EQUIPMENT_STATES];

