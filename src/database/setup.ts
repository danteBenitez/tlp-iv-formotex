import { sequelize } from "./connection.js";
import { seedDatabase } from "./seed/index.js";

export async function setupDatabase() {
    await seedDatabase();

    return sequelize.authenticate();
}