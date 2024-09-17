import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import authRouter from "./routes/auth.routes.js";
import equipmentTypeRouter from "./routes/equipment-types.routes.js";
import equipmentUnitRouter from "./routes/equipment-units.routes.js";
import equipmentRouter from "./routes/equipment.routes.js";
import makeRouter from "./routes/make.routes.js";
import organizationRouter from "./routes/organization.routes.js";
import userRouter from "./routes/user.routes.js";

type Callback = () => Promise<void>;

export class Server {
    private onBeforeStartCallbacks: Callback[];

    constructor(
        private app: express.Application
    ) {
        this.onBeforeStartCallbacks = [];
        this.addMiddleware();
        this.routes();
    }

    async start(port = 3000) {
        for (const callback of this.onBeforeStartCallbacks) {
            await callback();
        }

        return this.app.listen(port, () => {
            console.log(`Servidor escuchando en el puerto ${port}`);
        })
    }

    protected routes() {
        this.app.use('/auth', authRouter);
        this.app.use('/users', userRouter);
        this.app.use('/makes', makeRouter);
        this.app.use('/equipment/types', equipmentTypeRouter);
        this.app.use('/equipment/units', equipmentUnitRouter);
        this.app.use('/equipment', equipmentRouter);
        this.app.use('/organizations', organizationRouter);
    }

    protected addParsers() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
    }

    protected addMiddleware() {
        this.addParsers();

        this.app.use(morgan("dev"));
        this.app.use(helmet());
        this.app.use(cors({
            origin: "*"
        }));
    }

    /**
     * Registra un callback a ser llamado antes de iniciar el servidor.
     */
    onBeforeStart(callback: Callback) {
        this.onBeforeStartCallbacks.push(callback);
    }
}