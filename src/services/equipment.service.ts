import { Op, WhereOptions } from "sequelize";
import { IEquipmentType } from "../interfaces/equipment-type.interface";
import { IEquipment } from "../interfaces/equipment.interface";
import { IMake } from "../interfaces/make.interface";
import EquipmentType from "../models/equipment-type.model";
import EquipmentUnit from "../models/equipment-unit.model";
import Equipment from "../models/equipment.model";
import Make from "../models/make.model";
import User from "../models/user.model";
import PaginatedResponse from "../responses/paginated-response";
import { CreateEquipmentData, UpdateEquipmentData } from "../validations/equipment.schema";
import { EquipmentTypeNotFoundError } from "./equipment-types.service";
import { MakeNotFoundError } from "./make.service";
import { movementService, MovementService } from "./movement.service";

export class EquipmentNotFoundError extends Error { }

export class EquipmentService {

    constructor(
        private equipmentModel: typeof Equipment,
        private makeModel: typeof Make,
        private equipmentTypeModel: typeof EquipmentType,
        private equipmentUnitModel: typeof EquipmentUnit,
        private movementService: MovementService
    ) { }

    async findAll(params?: {
        query?: string,
        make?: string,
        type?: string,
        page?: string
    }) {
        const options: WhereOptions<IEquipment> = {};

        if (params?.query) {
            options[Op.or as keyof WhereOptions] = {
                name: { [Op.like]: `%${params?.query}%` },
                description: { [Op.like]: `%${params?.query}%` }
            };
        }

        const makeOptions: WhereOptions<IMake> = {};

        if (params?.make) {
            makeOptions["name"] = {
                [Op.like]: `%${params.make}%`
            };
        }

        const typeOptions: WhereOptions<IEquipmentType> = {};

        if (params?.type) {
            typeOptions["name"] = {
                [Op.like]: `%${params.type}%`
            };
        }
        const page = parseInt(params?.page ?? "1");
        const result = await this.equipmentModel.findAndCountAll({
            where: options,
            limit: PaginatedResponse.PER_PAGE_DEFAULT,
            offset: page === 1 ? 0 : (page - 1) * PaginatedResponse.PER_PAGE_DEFAULT,
            include: [{
                model: this.equipmentTypeModel,
                where: typeOptions
            }, {
                model: this.makeModel,
                where: makeOptions
            }],
        });

        return PaginatedResponse.fromData(result.rows, result.count, parseInt(params?.page ?? "1")).toJson();
    }

    async findById(equipmentId: number) {
        const equipment = await this.equipmentModel.findOne({
            where: { equipmentId },
            include: [this.equipmentTypeModel, this.equipmentUnitModel, this.makeModel]
        });

        if (!equipment) {
            throw new EquipmentNotFoundError("Equipamiento no encontrado");
        }

        return equipment;
    }

    async create(equipmentData: CreateEquipmentData, user: User) {

        const type = await this.equipmentTypeModel.findByPk(equipmentData.typeId);

        if (!type) {
            throw new EquipmentTypeNotFoundError("Tipo de equipamiento no encontrado");
        }

        const make = await this.makeModel.findByPk(equipmentData.makeId);

        if (!make) {
            throw new MakeNotFoundError("Marca sin registrar");
        }

        const equipment = await this.equipmentModel.create(equipmentData);

        if (equipmentData.units) {
            const units = await this.equipmentUnitModel.bulkCreate(
                equipmentData.units.map(u => {
                    return { ...u, equipmentId: equipment.equipmentId }
                }))
            units.map(async u => await this.movementService.createEntryMovement({
                author: user,
                unit: u
            }))
        }

        return equipment;
    }

    async update(equipmentId: number, equipmentData: UpdateEquipmentData, user: User) {
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

        if (equipmentData.makeId) {
            const make = await this.makeModel.findByPk(equipmentData.makeId);

            if (!make) {
                throw new MakeNotFoundError("Marca no registrada");
            }

            existing.$set("make", make);
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
                const [instance, found] = await this.equipmentUnitModel.upsert({
                    ...unit,
                    equipmentId: existing.equipmentId
                });
                if (!found) {
                    await this.movementService.createEntryMovement({
                        author: user,
                        unit: instance
                    });
                }
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

export const equipmentService = new EquipmentService(Equipment, Make, EquipmentType, EquipmentUnit, movementService);