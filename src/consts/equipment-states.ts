export const EQUIPMENT_STATES = {
    /** En buen estado */
    OK: "ok",
    /** Necesita reparaciones */
    NEEDS_REPAIR: "needs_repair",
    /** Entregado a empresa correspondiente */
    DELIVERED: "delivered",
    /** En proceso de mantenimiento */
    IN_MAINTENANCE: "in_maintenance"
};

export type EquipmentState = typeof EQUIPMENT_STATES[keyof typeof EQUIPMENT_STATES];

export const ALLOWED_EQUIPMENT_STATES = Object.values(EQUIPMENT_STATES);

