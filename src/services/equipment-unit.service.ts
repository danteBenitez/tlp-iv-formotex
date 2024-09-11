import EquipmentUnit from "../models/equipment-unit.model";
import Equipment from "../models/equipment.model";
import Organization from "../models/organization.model";
import { CreateEquipmentUnitData, UpdateEquipmentUnitData } from "../validations/equipment-unit.schema";
import { OrganizationNotFoundError } from "./organization.service";

export class EquipmentUnitNotFound extends Error { }

export class EquipmentUnitService {

    constructor(
        private equipmentUnitModel: typeof EquipmentUnit,
        private equipmentModel: typeof Equipment,
        private organizationModel: typeof Organization
    ) { }

    async findAll() {
        return this.equipmentUnitModel.findAll({
            include: {
                model: this.equipmentModel,
            }
        });
    }

    async findById(equipmentUnitId: number) {
        const equipment = await this.equipmentUnitModel.findOne({
            where: { equipmentUnitId }
        });

        if (!equipment) {
            throw new EquipmentUnitNotFound("Unidad no encontrada");
        }

        return equipment;
    }

    async create(equipmentData: CreateEquipmentUnitData) {
        const organization = await this.equipmentUnitModel.findByPk(equipmentData.organizationId);

        if (!organization) {
            throw new OrganizationNotFoundError("Organización no encontrada");
        }

        const equipment = await this.equipmentUnitModel.create(equipmentData);

        return equipment;
    }

    async update(equipmentId: number, equipmentData: UpdateEquipmentUnitData) {
        const existing = await this.equipmentUnitModel.findByPk(equipmentId);

        if (!existing) {
            throw new EquipmentUnitNotFound("Unidad no encontrada");
        }

        if (equipmentData.organizationId) {
            const organization = await this.organizationModel.findByPk(equipmentData.organizationId);

            if (!organization) {
                throw new OrganizationNotFoundError("Organización no encontrada");
            }
            existing.$set("organization", organization);
        }

        await existing.update(equipmentData);

        return existing;
    }

    async delete(equipmentId: number) {
        const affected = await this.equipmentModel.destroy({
            where: { equipmentId }
        });

        if (affected === 0) {
            throw new EquipmentUnitNotFound("Equipamiento no encontrado");
        }

        return affected;
    }
}

export const equipmentUnitService = new EquipmentUnitService(EquipmentUnit, Equipment, Organization);