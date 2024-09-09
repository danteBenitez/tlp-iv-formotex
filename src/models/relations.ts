import { Role } from "./role.model.js";
import { UserRole } from "./user-roles.model.js";
import { User } from "./user.model.js";

export function defineRelations() {
    // A un rol pertenecen varios usuarios
    Role.belongsToMany(User, {
        foreignKey: "role_id",
        otherKey: "user_id",
        through: UserRole,
        uniqueKey: "user_role_id",
    });
    // Un usuario pertenece a un rol
    User.belongsToMany(Role, {
        foreignKey: "user_id",
        otherKey: "role_id",
        through: UserRole,
        uniqueKey: "user_role_id",
    });
}