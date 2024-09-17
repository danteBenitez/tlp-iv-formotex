import { Request, Response } from "express";
import { ConflictingMakeError, ExistingEquipmentsWithMakeError, MakeNotFoundError, MakeService } from "../services/make.service";
import { validateRequest, validateRequestBody } from "../utils/validate-schema";
import { createMakeSchema, makeIdSchema, updateMakeSchema } from "../validations/make.schema";

export class MakeController {

    constructor(
        private makeService: MakeService
    ) { }

    async findAll(_: Request, res: Response) {
        try {
            const make = await this.makeService.findAll();

            return res.status(200).json(make);

        } catch (err) {
            console.error("Error al recuperar marcas", err);
            res.status(500).json({
                message: "Error interno del servidor"
            });
        }
    }

    async findById(req: Request, res: Response) {
        const { data, success, error } = await validateRequest(req, makeIdSchema);
        if (!success) {
            return res.status(400).json(error);
        }

        try {
            const make = await this.makeService.findById(data.params.makeId);
            console.log(make);
            return res.status(200).json(make);

        } catch (err) {
            if (err instanceof MakeNotFoundError) {
                return res.status(404).json({
                    message: err.message
                });
            }

            console.error("Error al encontrar marca por ID", err);
            res.status(500).json({
                message: "Error interno del servidor"
            });
        }
    }

    async create(req: Request, res: Response) {
        const { data, success, error } = await validateRequestBody(req, createMakeSchema);
        if (!success) {
            return res.status(400).json(error);
        }

        try {
            const make = await this.makeService.create(data);

            return res.status(201).json(make);

        } catch (err) {
            if (
                err instanceof ConflictingMakeError
            ) {
                return res.status(409).json({
                    message: err.message
                });
            }

            console.log("Error al crear marca", err);
            res.status(500).json({
                message: "Error interno del servidor"
            });
        }
    }

    async update(req: Request, res: Response) {
        const { data, success, error } = await validateRequest(req, updateMakeSchema);
        if (!success) {
            return res.status(400).json(error);
        }

        try {
            const equipment = await this.makeService.update(data.params.makeId, data.body);

            return res.status(201).json(equipment);

        } catch (err) {
            if (
                err instanceof MakeNotFoundError
            ) {
                return res.status(404).json({
                    message: err.message
                });
            }

            if (err instanceof ConflictingMakeError) {
                return res.status(409).json({
                    message: err.message
                });
            }

            console.log("Error al actualizar marca", err);
            res.status(500).json({
                message: "Error interno del servidor"
            });
        }
    }

    async delete(req: Request, res: Response) {
        const { data, success, error } = await validateRequest(req, makeIdSchema);
        if (!success) {
            return res.status(400).json(error);
        }

        try {
            await this.makeService.delete(data.params.makeId);

            return res.status(201).end();

        } catch (err) {
            if (err instanceof MakeNotFoundError) {
                return res.status(404).json({
                    message: err.message
                });
            }

            if (err instanceof ExistingEquipmentsWithMakeError) {
                return res.status(409).json({
                    message: err.message
                });
            }

            console.log("Error al eliminar marca", err);
            res.status(500).json({
                message: "Error interno del servidor"
            });
        }


    }
}