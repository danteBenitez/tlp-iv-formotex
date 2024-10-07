import { createInterface } from "readline/promises";
import { Database } from "../database/connection.js";
import { setupDatabase } from "../database/setup.js";

export async function syncDatabase() {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const answer = await rl.question(`¿Está seguro que desea forzar la sincronización de base de datos?\nEsta acción podría eliminar datos ya guardados. (Y/n)`);
    const connection = Database.getInstance();

    try {
        if (answer == "Y") {
            console.log("Sincronizando base de datos...");
            await connection.sync({
                force: true
            })
            await setupDatabase();
            console.log("Sincronización exitosa");
        }

    } catch (err) {
        console.error("Hubo un error en la sincronización", err);
    } finally {
        rl.close();
        connection.close();
    }
}

syncDatabase();