export const MOVEMENT_TYPES = {
    TRANSPORT: "transport",
    DELIVERY: "delivery",
    MAINTENANCE: "mantenimiento",
    ENTRY: "entry"
} as const;

export type MovementType = typeof MOVEMENT_TYPES[keyof typeof MOVEMENT_TYPES];

export const MOVEMENT_TYPES_TABLE_NAMES: Record<MovementType, string> = {
    [MOVEMENT_TYPES.TRANSPORT]: "transport_movement",
    [MOVEMENT_TYPES.DELIVERY]: "delivery_movement",
    [MOVEMENT_TYPES.MAINTENANCE]: "maintenance_movement",
    [MOVEMENT_TYPES.ENTRY]: "entry_movement"
}

export const MOVEMENT_TYPES_TO_DESCRIPTION = {
    [MOVEMENT_TYPES.TRANSPORT]: "Transporte de equipos de una locación a otra",
    [MOVEMENT_TYPES.DELIVERY]: "Transporte de unidad a la organización correspondiente",
    [MOVEMENT_TYPES.MAINTENANCE]: "Transporte de un equipo a mantenimiento",
    [MOVEMENT_TYPES.ENTRY]: "Ingreso de una unidad a Formotex"
}