import { config } from "../config/config.service.js";
import { defineRelations } from "../models/relations.js";
import { sequelize } from "./connection.js";
import { seedDatabase } from "./seed/index.js";

export async function setupDatabase() {
    defineRelations();

    await sequelize.sync({
        force: config.getDatabaseOptions().SHOULD_FORCE
    })
    await seedDatabase()
        .then(() => console.log("Insertados roles correctamente"));

    return sequelize.authenticate();
}