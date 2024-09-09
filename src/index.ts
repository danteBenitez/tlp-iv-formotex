import express from "express";
import { config } from "./config/config.service.js";
import { setupDatabase } from "./database/setup.js";
import { Server } from "./server.js";

const app = express();

const server = new Server(app);

const PORT = config.getServerPort();

server
    .onBeforeStart(async () => {
        return setupDatabase()
            .then(() => console.log("Conectado exitosamente a base de datos"))
    })

server.start(PORT);