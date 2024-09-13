import EquipmentType from "../models/equipment-type.model";
import EquipmentUnit from "../models/equipment-unit.model";
import Equipment from "../models/equipment.model";
import { CreateEquipmentData, UpdateEquipmentData } from "../validations/equipment.schema";
import { EquipmentTypeNotFoundError } from "./equipment-types.service";

export class EquipmentNotFoundError extends Error { }

export class EquipmentService {

    constructor(
        private equipmentModel: typeof Equipment,
        private equipmentTypeModel: typeof EquipmentType,
        private equipmentUnitModel: typeof EquipmentUnit
    ) { }

    async findAll() {
        return this.equipmentModel.findAll({
            include: [this.equipmentTypeModel]
        });
    }

    async findById(equipmentId: number) {
        const equipment = await this.equipmentModel.findOne({
            where: { equipmentId },
            include: [this.equipmentTypeModel, this.equipmentUnitModel]
        });

        if (!equipment) {
            throw new EquipmentNotFoundError("Equipamiento no encontrado");
        }

        return equipment;
    }

    async create(equipmentData: CreateEquipmentData) {

        const type = await this.equipmentTypeModel.findByPk(equipmentData.typeId);

        if (!type) {
            throw new EquipmentTypeNotFoundError("Tipo de equipamiento no encontrado");
        }

        const equipment = await this.equipmentModel.create(equipmentData);

        if (equipmentData.units) {
            await this.equipmentUnitModel.bulkCreate(equipmentData.units.map(u => ({ ...u, equipmentId: equipment.equipmentId })));
        }

        return equipment;
    }

    async update(equipmentId: number, equipmentData: UpdateEquipmentData) {
        const existing = await this.equipmentModel.findByPk(equipmentId);

        if (!existing) {
            throw new EquipmentNotFoundError("Equipamiento no encontrado");
        }

        if (equipmentData.typeId) {
            const type = await this.equipmentTypeModel.findByPk(equipmentData.typeId);

            if (!type) {
                throw new EquipmentTypeNotFoundError("Tipo de equipamiento no encontrado");
            }
            existing.$set("type", type);
        }

        await existing.update(equipmentData);

        if (equipmentData.units) {
            await Promise.all(equipmentData.units.map(async unit => {
                if (unit.deleted) {
                    await this.equipmentUnitModel.destroy({
                        where: { equipmentUnitId: unit.equipmentUnitId }
                    })
                    return;
                }
                await this.equipmentUnitModel.upsert({
                    ...unit,
                    equipmentId: existing.equipmentId
                });
            }));
        }

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

export const equipmentService = new EquipmentService(Equipment, EquipmentType, EquipmentUnit);