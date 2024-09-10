import EquipmentType from "../models/equipment-type.model";
import Equipment from "../models/equipment.model";
import Organization from "../models/organization.model";
import { CreateEquipmentData, UpdateEquipmentData } from "../validations/equipment.schema";
import { EquipmentTypeNotFoundError } from "./equipment-types.service";
import { OrganizationNotFoundError } from "./organization.service";

export class EquipmentNotFoundError extends Error { }

export class EquipmentService {

    constructor(
        private equipmentModel: typeof Equipment,
        private equipmentTypeModel: typeof EquipmentType,
        private organizationModel: typeof Organization
    ) { }

    async findAll() {
        return this.equipmentModel.findAll({
            include: [this.equipmentTypeModel, this.organizationModel]
        });
    }

    async findById(equipmentId: number) {
        const equipment = await this.equipmentModel.findOne({
            where: { equipmentId }
        });

        if (!equipment) {
            throw new EquipmentNotFoundError("Equipamiento no encontrado");
        }

        return equipment;
    }

    async create(equipmentData: CreateEquipmentData) {
        const organization = await this.organizationModel.findByPk(equipmentData.organizationId);

        if (!organization) {
            throw new OrganizationNotFoundError("Organización no encontrada");
        }

        const type = await this.organizationModel.findByPk(equipmentData.typeId);

        if (!type) {
            throw new EquipmentTypeNotFoundError("Tipo de equipamiento no encontrado");
        }

        const equipment = await this.equipmentModel.create(equipmentData);

        return equipment;
    }

    async update(equipmentId: number, equipmentData: UpdateEquipmentData) {
        const existing = await this.equipmentModel.findByPk(equipmentId);

        if (!existing) {
            throw new EquipmentNotFoundError("Equipamiento no encontrado");
        }

        if (equipmentData.organizationId) {
            const organization = await this.organizationModel.findByPk(equipmentData.organizationId);

            if (!organization) {
                throw new OrganizationNotFoundError("Organización no encontrada");
            }
            existing.$set("organization", organization);
        }

        if (equipmentData.typeId) {
            const type = await this.organizationModel.findByPk(equipmentData.typeId);

            if (!type) {
                throw new EquipmentTypeNotFoundError("Tipo de equipamiento no encontrado");
            }
            existing.$set("type", type);
        }

        await existing.update(equipmentData);

        return existing;
    }

    async delete(equipmentId: number) {
        const affected = await this.equipmentModel.destroy({
            where: { equipmentId }
        });

        if (affected === 0) {
            throw new EquipmentNotFoundError("Equipamiento no encontrado");
        }

        return affected;
    }
}

export const equipmentService = new EquipmentService(Equipment, EquipmentType, Organization);