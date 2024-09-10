import { seedAdmin } from "./admin.seeder.js";
import { seedRoles } from "./roles.seeder.js";

export async function seedDatabase() {
    await seedRoles()
        .then(() => console.log("Roles insertados correctamente"));
    await seedAdmin()
        .then(() => console.log("Insertado usuario administrador"))
}