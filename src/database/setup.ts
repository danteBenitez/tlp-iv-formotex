import { Database } from "./connection.js";
import { seedDatabase } from "./seed/index.js";

export async function setupDatabase() {
    Database.getInstance().checkConnection();

    await seedDatabase();
}