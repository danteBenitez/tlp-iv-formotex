import { Dialect, Sequelize } from "sequelize";
import { config } from "../config/config.service.js";

const databaseConfig = config.getDatabaseOptions();

export const sequelize = new Sequelize(databaseConfig.NAME, databaseConfig.USER, databaseConfig.PASSWORD, {
    dialect: databaseConfig.DIALECT as Dialect,
    host: databaseConfig.HOST,
    port: databaseConfig.PORT,
    database: databaseConfig.NAME,
});