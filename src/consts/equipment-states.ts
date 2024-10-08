export const EQUIPMENT_STATES = {
    /** En buen estado */
    OK: "ok",
    /** Necesita reparaciones */
    NEEDS_REPAIR: "needs_repair",
} as const;

export type EquipmentState = typeof EQUIPMENT_STATES[keyof typeof EQUIPMENT_STATES];

export const ALLOWED_EQUIPMENT_STATES = [EQUIPMENT_STATES.OK, EQUIPMENT_STATES.NEEDS_REPAIR] as const;

