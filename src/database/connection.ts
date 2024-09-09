import path from "path";
import { Dialect } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import { config } from "../config/config.service.js";

const databaseConfig = config.getDatabaseOptions();

export const sequelize = new Sequelize(databaseConfig.NAME, databaseConfig.USER, databaseConfig.PASSWORD, {
    dialect: databaseConfig.DIALECT as Dialect,
    host: databaseConfig.HOST,
    port: databaseConfig.PORT,
    database: databaseConfig.NAME,
    models: [path.resolve('dist/models/**/*.model.js')]
});