import { Request, Response } from "express";
import { ConflictingEquipmentTypeError, EquipmentTypeNotFoundError, EquipmentTypeService } from "../services/equipment-types.service";
import { validateRequest, validateRequestBody } from "../utils/validate-schema";
import { createEquipmentTypeSchema, equipmentTypeIdSchema, updateEquipmentTypeSchema } from "../validations/equipment-type.schema";

export class EquipmentTypeController {

    constructor(
        private equipmentTypeService: EquipmentTypeService
    ) { }

    async findAll(_: Request, res: Response) {
        try {
            const types = await this.equipmentTypeService.findAll();

            return res.status(200).json(types);

        } catch (err) {
            console.error("Error al encontrar tipos de equipamiento: ", err);
            res.status(500).json({
                message: "Error interno del servidor"
            });
        }
    }

    async findOne(req: Request, res: Response) {
        const { data, success, error } = await validateRequest(req, equipmentTypeIdSchema);
        if (!success) {
            return res.status(400).json(error);
        }

        try {
            const type = await this.equipmentTypeService.findById(data.params.equipmentId);

            return res.status(200).json(type);

        } catch (err) {
            if (err instanceof EquipmentTypeNotFoundError) {
                return res.status(400).json({
                    message: err.message
                });
            }

            console.error("Error al encontrar un tipo de equipamiento: ", err);
            res.status(500).json({
                message: "Error interno del servidor"
            });
        }
    }

    async create(req: Request, res: Response) {
        const { data, success, error } = await validateRequestBody(req, createEquipmentTypeSchema);
        if (!success) {
            return res.status(400).json(error);
        }

        try {
            const type = await this.equipmentTypeService.create(data);

            return res.status(200).json(type);

        } catch (err) {
            if (err instanceof ConflictingEquipmentTypeError) {
                return res.status(400).json({
                    message: err.message
                });
            }

            console.error("Error al crear un tipo de equipamiento: ", err);
            res.status(500).json({
                message: "Error interno del servidor"
            });
        }
    }

    async update(req: Request, res: Response) {
        const { data, success, error } = await validateRequest(req, updateEquipmentTypeSchema);
        if (!success) {
            return res.status(400).json(error);
        }

        try {
            const type = await this.equipmentTypeService.update(data.params.equipmentId, data.body);

            return res.status(200).json(type);

        } catch (err) {
            if (err instanceof ConflictingEquipmentTypeError) {
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
        const { data, success, error } = await validateRequest(req, equipmentTypeIdSchema);
        if (!success) {
            return res.status(400).json(error);
        }

        try {
            const type = await this.equipmentTypeService.delete(data.params.equipmentId);

            return res.status(200).json(type);

        } catch (err) {
            if (err instanceof EquipmentTypeNotFoundError) {
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