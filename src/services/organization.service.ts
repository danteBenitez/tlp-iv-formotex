import Organization from "../models/organization.model";
import { CreateOrganizationData, UpdateOrganizationData } from "../validations/organization.schema";

export class OrganizationNotFoundError extends Error { }
export class ConflictingOrganizationError extends Error { }
export class OrganizationHasEquipmentError extends Error { }
export class OrganizationService {

    constructor(
        private organizationModel: typeof Organization,
    ) { }

    async findAll() {
        return this.organizationModel.findAll();
    }

    async findById(organizationId: number) {
        const org = await this.organizationModel.findByPk(organizationId);

        if (!org) {
            throw new OrganizationNotFoundError("Organización no encontrada");
        }

        return org;
    }

    async create(organizationData: CreateOrganizationData) {
        const existing = await this.organizationModel.findOne({
            where: {
                name: organizationData.name
            }
        });

        if (existing) {
            throw new ConflictingOrganizationError("Ya existe organización con ese nombre");
        }

        const org = await this.organizationModel.create(organizationData);

        return org;
    }

    async update(organizationId: number, organizationData: UpdateOrganizationData) {
        const existing = await this.organizationModel.findByPk(organizationId);

        if (!existing) {
            throw new OrganizationNotFoundError("Organización no encontrada");
        }

        const other = await this.organizationModel.findOne({
            where: {
                name: organizationData.name ?? "",
                organizationId
            }
        });

        if (other) {
            throw new ConflictingOrganizationError("Nombre de organización en uso");
        }

        await existing.update(organizationData);

        return existing;
    }

    async delete(organizationId: number) {
        const affected = await this.organizationModel.destroy({
            where: {
                organizationId
            },
            cascade: true
        });

        if (affected === 0) {
            throw new OrganizationNotFoundError("Organización no encontrada");
        }

        return affected;
    }
}

export const organizationService = new OrganizationService(Organization);