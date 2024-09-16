
import { Op } from "sequelize";
import Equipment from "../models/equipment.model";
import Make from "../models/make.model";
import { UpdateEquipmentData } from "../validations/equipment.schema";
import { CreateMakeData } from "../validations/make.schema";

export class MakeNotFoundError extends Error { }
export class ConflictingMakeError extends Error { }
export class ExistingEquipmentsWithMakeError extends Error { }

export class MakeService {

    constructor(
        private makeModel: typeof Make,
        private equipmentModel: typeof Equipment
    ) { }

    async findAll() {
        return this.makeModel.findAll();
    }

    async findById(makeId: number) {
        const make = await this.makeModel.findByPk(makeId);
        if (!make) {
            throw new MakeNotFoundError("Marca sin registrar");
        }
        return make;
    }

    async create(data: CreateMakeData) {
        const existing = await this.makeModel.findOne({
            where: { name: data.name }
        });

        if (existing) {
            throw new ConflictingMakeError("Una marca ya existe con ese nombre");
        }

        const type = await this.makeModel.create({
            name: data.name,
            description: data.description
        });

        return type;
    }

    async update(makeId: number, updateData: UpdateEquipmentData) {
        const existing = await this.makeModel.findByPk(makeId);

        if (!existing) {
            throw new MakeNotFoundError("Marca no encontrada");
        }

        const other = await this.makeModel.findOne({
            where: {
                makeId: { [Op.not]: makeId },
                name: updateData.name
            }
        });

        if (other) {
            throw new ConflictingMakeError("Una marca ya existe con ese nombre");
        }

        await existing.update(updateData);

        return existing;
    }


    async delete(makeId: number) {
        const equipment = await this.equipmentModel.findAll({
            where: {
                makeId
            }
        });

        if (equipment.length !== 0) {
            throw new ExistingEquipmentsWithMakeError("Existe equipamiento registrado con esta marca. NO es posible eliminarlo");
        }

        const affected = await this.makeModel.destroy({
            where: { makeId }
        });

        if (affected === 0) {
            throw new MakeNotFoundError("Marca sin registrar");
        }

        return affected;
    }
}

export const makeService = new MakeService(Make, Equipment);