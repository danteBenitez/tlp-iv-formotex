export const ROLES = {
    ADMIN: "admin",
    USER: "user"
}

/** Roles permitidos a ser asignados a usuarios no administradores */
export const ALLOWED_ROLES = [ROLES.USER];

/** Roles permitidos a ser asignados por administradores */
export const ADMIN_ALLOWED_ROLES = [ROLES.USER, ROLES.ADMIN];