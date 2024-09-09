import { defineRelations } from "../models/relations.js";
import { sequelize } from "./connection.js";
import { seedDatabase } from "./seed/index.js";

export async function setupDatabase() {
    defineRelations();

    await seedDatabase();

    return sequelize.authenticate();
}