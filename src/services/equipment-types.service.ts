import EquipmentType from "../models/equipment-type.model";
import { CreateEquipmentTypeData } from "../validations/equipment-type.schema";
import { UpdateEquipmentData } from "../validations/equipment.schema";

export class EquipmentTypeNotFoundError extends Error { }
export class ConflictingEquipmentTypeError extends Error { }

export class EquipmentTypeService {

    constructor(
        private equipmentTypeModel: typeof EquipmentType
    ) { }

    async findAll() {
        return this.equipmentTypeModel.findAll();
    }

    async findById(equipmentId: number) {
        const type = this.equipmentTypeModel.findByPk(equipmentId);
        if (!type) {
            throw new EquipmentTypeNotFoundError("Tipo de equipamiento no encontrado");
        }
        return type;
    }

    async create(data: CreateEquipmentTypeData) {
        const existing = await this.equipmentTypeModel.findOne({
            where: { name: data.name }
        });

        if (existing) {
            throw new ConflictingEquipmentTypeError("Un tipo de equipamiento ya existe con ese nombre");
        }

        const type = await this.equipmentTypeModel.create({
            name: data.name,
            description: data.description
        });

        return type;
    }

    async update(typeId: number, updateData: UpdateEquipmentData) {
        const existing = await this.equipmentTypeModel.findByPk(typeId);

        if (!existing) {
            throw new EquipmentTypeNotFoundError("Tipo de equipamiento no encontrado");
        }

        existing.update(updateData);

        return existing;
    }


    async delete(typeId: number) {
        const affected = await this.equipmentTypeModel.destroy({
            where: { equipmentTypeId: typeId }
        });

        if (affected === 0) {
            throw new EquipmentTypeNotFoundError("Tipo de equipamiento no encontrado");
        }

        return affected;
    }
}