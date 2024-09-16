import { seedAdmin } from "./admin.seeder.js";
import { seedEquipment } from "./equipment.seeder.js";
import { seedRoles } from "./roles.seeder.js";

export async function seedDatabase() {
    await seedRoles()
        .then(() => console.log("Roles insertados correctamente"));
    await seedAdmin()
        .then(() => console.log("Insertado usuario administrador"))
    await seedEquipment()
        .then(() => console.log("Datos de prueba insertados automáticamente"))
}