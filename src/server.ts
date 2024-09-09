import express from "express";
import helmet from "helmet";
import morgan from "morgan";

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
    }

    protected addParsers() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
    }

    protected addMiddleware() {
        this.addParsers();

        this.app.use(morgan("dev"));
        this.app.use(helmet());
    }

    /**
     * Registra un callback a ser llamado antes de iniciar el servidor.
     */
    onBeforeStart(callback: Callback) {
        this.onBeforeStartCallbacks.push(callback);
    }
}