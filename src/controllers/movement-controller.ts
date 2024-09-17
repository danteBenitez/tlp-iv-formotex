import { Request, Response } from "express";
import { MovementType } from "../consts/movement-type";
import { MovementService, MovementTypeNotFound } from "../services/movement.service";

export class MovementController {

    constructor(
        private movementService: MovementService
    ) { }

    async findAll(req: Request, res: Response) {
        try {
            const movements = await this.movementService.findAll(req.query?.type as MovementType | undefined)

            res.status(200).json(movements);

        } catch (err) {
            if (err instanceof MovementTypeNotFound) {
                return res.status(404).json({
                    message: err.message
                });
            }

            console.error("Error al recuperar todas las actividades", err);
            res.status(500).json({
                message: "Error interno del servidor"
            });
        }
    }


}