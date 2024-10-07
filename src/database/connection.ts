import path from "path";
import { Dialect } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import { config as configService } from "../config/config.service";

export class Database {
    private static instance: Database | null = null
    private static config = configService.getDatabaseOptions()

    private constructor(
        private sequelize: Sequelize
    ) { }

    static getInstance() {
        if (!Database.instance) {
            const config = Database.config;
            const sequelize = new Sequelize(config.NAME, config.USER, config.PASSWORD, {
                dialect: config.DIALECT as Dialect,
                host: config.HOST,
                port: config.PORT,
                database: config.NAME,
                models: [path.resolve('dist/models/**/*.model.js')]
            });
            Database.instance = new Database(sequelize)
        }
        return Database.instance;
    }

    async sync(opts: { force: boolean }): Promise<void> {
        await this.sequelize.sync(opts);
    }

    async close(): Promise<void> {
        return this.sequelize.close();
    }

    async checkConnection() {
        return this.sequelize.authenticate();
    }
}
