import { Request, Response } from "express";
import { EquipmentUnitNotFound, EquipmentUnitService } from "../services/equipment-unit.service";
import { EquipmentNotFoundError } from "../services/equipment.service";
import { OrganizationNotFoundError } from "../services/organization.service";
import { validateRequest, validateRequestBody } from "../utils/validate-schema";
import { createEquipmentUnitSchema, equipmentUnitIdSchema, updateEquipmentUnitSchema } from "../validations/equipment-unit.schema";

export class EquipmentUnitController {

    constructor(
        private equipmentUnitService: EquipmentUnitService
    ) { }

    async findAll(_: Request, res: Response) {
        try {
            const types = await this.equipmentUnitService.findAll();

            return res.status(200).json(types);

        } catch (err) {
            console.error("Error al encontrar unidades de equipamiento: ", err);
            res.status(500).json({
                message: "Error interno del servidor"
            });
        }
    }

    async findOne(req: Request, res: Response) {
        const { data, success, error } = await validateRequest(req, equipmentUnitIdSchema);
        if (!success) {
            return res.status(400).json(error);
        }

        try {
            const type = await this.equipmentUnitService.findById(data.params.equipmentUnitId);

            return res.status(200).json(type);

        } catch (err) {
            if (err instanceof EquipmentUnitNotFound) {
                return res.status(404).json({
                    message: err.message
                });
            }

            console.error("Error al encontrar una unidad de equipamiento: ", err);
            res.status(500).json({
                message: "Error interno del servidor"
            });
        }
    }

    async create(req: Request, res: Response) {
        const { data, success, error } = await validateRequestBody(req, createEquipmentUnitSchema);
        if (!success) {
            return res.status(400).json(error);
        }

        try {
            const type = await this.equipmentUnitService.create(data);

            return res.status(200).json(type);

        } catch (err) {
            if (
                err instanceof OrganizationNotFoundError
                || err instanceof EquipmentNotFoundError
            ) {
                return res.status(404).json({
                    message: err.message
                });
            }

            console.error("Error al crear una unidad de equipamiento: ", err);
            res.status(500).json({
                message: "Error interno del servidor"
            });
        }
    }

    async update(req: Request, res: Response) {
        const { data, success, error } = await validateRequest(req, updateEquipmentUnitSchema);
        if (!success) {
            return res.status(400).json(error);
        }

        try {
            const type = await this.equipmentUnitService.update(data.params.equipmentUnitId, data.body);

            return res.status(200).json(type);

        } catch (err) {
            if (
                err instanceof OrganizationNotFoundError
                || err instanceof EquipmentNotFoundError
            ) {
                return res.status(400).json({
                    message: err.message
                });
            }

            console.error("Error al actualizar un tipo de equipamiento: ", err);
            res.status(500).json({
                message: "Error interno del servidor"
            });
        }
    }

    async delete(req: Request, res: Response) {
        const { data, success, error } = await validateRequest(req, equipmentUnitIdSchema);
        if (!success) {
            return res.status(400).json(error);
        }

        try {
            const type = await this.equipmentUnitService.delete(data.params.equipmentUnitId);

            return res.status(200).json(type);

        } catch (err) {
            if (err instanceof EquipmentUnitNotFound) {
                return res.status(400).json({
                    message: err.message
                });
            }

            console.error("Error al eliminar un tipo de equipamiento: ", err);
            res.status(500).json({
                message: "Error interno del servidor"
            });
        }
    }
}