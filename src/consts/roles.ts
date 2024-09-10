export const ROLES = {
    ADMIN: "admin",
    USER: "employee"
} as const;

export type RoleName = typeof ROLES[keyof typeof ROLES];

/** Roles permitidos a ser asignados a usuarios no administradores */
export const ALLOWED_ROLES = [ROLES.USER] as const;

export type AssignableRoles = typeof ALLOWED_ROLES[keyof typeof ALLOWED_ROLES];

/** Roles permitidos a ser asignados por administradores */
export const ADMIN_ALLOWED_ROLES = [ROLES.USER, ROLES.ADMIN];

export type AdminAssignableRoles = typeof ADMIN_ALLOWED_ROLES[keyof typeof ADMIN_ALLOWED_ROLES];