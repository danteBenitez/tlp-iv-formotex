import { seedAdmin } from "./admin.seeder.js";
import { seedEquipment } from "./equipment.seeder.js";
import { seedMovementTypes } from "./movement-type.seeder.js";
import { seedRoles } from "./roles.seeder.js";

export async function seedDatabase() {
    await seedRoles()
        .then(() => console.log("Roles insertados correctamente"));
    await seedAdmin()
        .then(() => console.log("Insertado usuario administrador"))
    await seedEquipment()
        .then(() => console.log("Datos de prueba insertados automáticamente"))
    await seedMovementTypes()
        .then(() => console.log("Tipo de movimientos insertados correctamente"));
}