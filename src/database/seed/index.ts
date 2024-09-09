import { seedRoles } from "./roles.seeder.js";

export async function seedDatabase() {
    await seedRoles()
        .then(() => console.log("Roles insertados correctamente"));
}