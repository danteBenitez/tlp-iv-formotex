import { Request, Response } from "express";
import { EquipmentTypeNotFoundError } from "../services/equipment-types.service";
import { EquipmentNotFoundError, EquipmentService } from "../services/equipment.service";
import { OrganizationNotFoundError } from "../services/organization.service";
import { validateRequest, validateRequestBody } from "../utils/validate-schema";
import { createEquipmentSchema, equipmentIdSchema, updateEquipmentSchema } from "../validations/equipment.schema";

export class EquipmentController {

    constructor(
        private equipmentService: EquipmentService
    ) { }

    async findAll(_: Request, res: Response) {
        try {
            const equipment = await this.equipmentService.findAll();

            return res.status(200).json(equipment);

        } catch (err) {
            console.error("Error al recuperar equipamiento", err);
            res.status(500).json({
                message: "Error interno del servidor"
            });
        }
    }

    async findById(req: Request, res: Response) {
        const { data, success, error } = await validateRequest(req, equipmentIdSchema);
        if (!success) {
            return res.status(400).json(error);
        }

        try {
            const equipment = await this.equipmentService.findById(data.params.equipmentId);

            return res.status(200).json(equipment);

        } catch (err) {
            if (err instanceof EquipmentNotFoundError) {
                return res.status(404).json({
                    message: err.message
                });
            }

            console.error("Error al encontrar equipo por ID", err);
            res.status(500).json({
                message: "Error interno del servidor"
            });
        }
    }

    async create(req: Request, res: Response) {
        const { data, success, error } = await validateRequestBody(req, createEquipmentSchema);
        if (!success) {
            return res.status(400).json(error);
        }

        try {
            const equipment = await this.equipmentService.create(data);

            return res.status(201).json(equipment);

        } catch (err) {
            if (
                err instanceof OrganizationNotFoundError
                || err instanceof EquipmentTypeNotFoundError
            ) {
                return res.status(404).json({
                    message: err.message
                });
            }

            console.log("Error al crear equipamiento", err);
            res.status(500).json({
                message: "Error interno del servidor"
            });
        }
    }

    async update(req: Request, res: Response) {
        const { data, success, error } = await validateRequest(req, updateEquipmentSchema);
        if (!success) {
            return res.status(400).json(error);
        }

        try {
            const equipment = await this.equipmentService.update(data.params.equipmentId, data.body);

            return res.status(201).json(equipment);

        } catch (err) {
            if (
                err instanceof EquipmentNotFoundError
                || err instanceof OrganizationNotFoundError
                || err instanceof EquipmentTypeNotFoundError
            ) {
                return res.status(404).json({
                    message: err.message
                });
            }

            console.log("Error al actualizar equipamiento", err);
            res.status(500).json({
                message: "Error interno del servidor"
            });
        }
    }

    async delete(req: Request, res: Response) {
        const { data, success, error } = await validateRequest(req, equipmentIdSchema);
        if (!success) {
            return res.status(400).json(error);
        }

        try {
            await this.equipmentService.delete(data.params.equipmentId);

            return res.status(201).end();

        } catch (err) {
            if (err instanceof EquipmentNotFoundError) {
                return res.status(404).json({
                    message: err.message
                });
            }

            console.log("Error al eliminar equipamiento", err);
            res.status(500).json({
                message: "Error interno del servidor"
            });
        }


    }
}