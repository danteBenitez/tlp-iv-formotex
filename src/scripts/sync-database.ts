import { createInterface } from "readline/promises";
import { sequelize } from "../database/connection.js";
import { setupDatabase } from "../database/setup.js";

export async function syncDatabase() {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const answer = await rl.question(`¿Está seguro que desea forzar la sincronización de base de datos?\nEsta acción podría eliminar datos ya guardados. (Y/n)`);

    try {
        if (answer == "Y") {
            console.log("Sincronizando base de datos...");
            await sequelize.sync({
                force: true
            })
            await setupDatabase();
            console.log("Sincronización exitosa");
        }

    } catch (err) {
        console.error("Hubo un error en la sincronización", err);
    } finally {
        rl.close();
        sequelize.close();
    }
}

syncDatabase();