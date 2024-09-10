import { Request, Response } from "express";
import { ConflictingOrganizationError, OrganizationNotFoundError, OrganizationService } from "../services/organization.service";
import { validateRequest, validateRequestBody } from "../utils/validate-schema";
import { createOrganizationSchema, organizationIdSchema, updateOrganizationSchema } from "../validations/organization.schema";

export class OrganizationController {

    constructor(
        private organizationService: OrganizationService
    ) { }

    async findAll(req: Request, res: Response) {
        try {
            const orgs = await this.organizationService.findAll();

            return res.status(200).json(orgs);

        } catch (err) {
            console.error("Error al recuperar organizaciones: ", err);
            res.status(500).json({
                message: "Error interno del servidor"
            });
        }
    }

    async findById(req: Request, res: Response) {
        const { data, success, error } = await validateRequest(req, organizationIdSchema);
        if (!success) {
            return res.status(400).json(error);
        }

        try {
            const org = await this.organizationService.findById(data.params.organizationId);

            return res.status(200).json(org);

        } catch (err) {
            if (err instanceof OrganizationNotFoundError) {
                return res.status(404).json({
                    message: err.message
                });
            }

            console.log("Error al recuperar una organización: ", err);
            res.status(500).json({
                message: "Error interno del servidor"
            });
        }
    }

    async create(req: Request, res: Response) {
        const { data, success, error } = await validateRequestBody(req, createOrganizationSchema);
        if (!success) {
            return res.status(400).json(error);
        }

        try {
            const org = await this.organizationService.create(data);

            return res.status(201).json(org);

        } catch (err) {
            if (err instanceof ConflictingOrganizationError) {
                return res.status(404).json({
                    message: err.message
                });
            }

            console.log("Error al crear una organización: ", err);
            res.status(500).json({
                message: "Error interno del servidor"
            });
        }
    }

    async update(req: Request, res: Response) {
        const { data, success, error } = await validateRequest(req, updateOrganizationSchema);
        if (!success) {
            return res.status(400).json(error);
        }

        try {
            const org = await this.organizationService.update(data.params.organizationId, data.body);

            return res.status(200).json(org);

        } catch (err) {
            if (err instanceof ConflictingOrganizationError) {
                return res.status(400).json({
                    message: err.message
                });
            }
            if (err instanceof OrganizationNotFoundError) {
                return res.status(404).json({
                    message: err.message
                });
            }

            console.log("Error al actualizar una organización: ", err);
            res.status(500).json({
                message: "Error interno del servidor"
            });
        }
    }

    async delete(req: Request, res: Response) {
        const { data, success, error } = await validateRequest(req, organizationIdSchema);
        if (!success) {
            return res.status(400).json(error);
        }

        try {
            await this.organizationService.delete(data.params.organizationId);

            return res.status(200).end();

        } catch (err) {
            if (
                err instanceof ConflictingOrganizationError
            ) {
                return res.status(400).json({
                    message: err.message
                });
            }
            if (err instanceof OrganizationNotFoundError) {
                return res.status(404).json({
                    message: err.message
                });
            }

            console.log("Error al actualizar una organización: ", err);
            res.status(500).json({
                message: "Error interno del servidor"
            });
        }

    }
}