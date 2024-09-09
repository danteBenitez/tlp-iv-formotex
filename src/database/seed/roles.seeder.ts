import { ROLES } from "../../consts/roles.js";
import { Role } from "../../models/role.model.js";

const ROLES_TO_INSERT = [
    {
        role_id: 1,
        name: ROLES.ADMIN,
    },
    {
        role_id: 2,
        name: ROLES.USER,
    }
];

export async function seedRoles() {
    return Promise.all(
        ROLES_TO_INSERT.map((role) => {
            return Role.findOrCreate({
                where: role,
                defaults: role,
            });
        })
    );
}