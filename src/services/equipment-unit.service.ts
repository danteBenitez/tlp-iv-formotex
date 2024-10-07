import { WhereOptions } from "sequelize";
import { MOVEMENT_TYPES } from "../consts/movement-type";
import { IEquipmentUnit } from "../interfaces/equipment-unit.interface";
import EquipmentUnit from "../models/equipment-unit.model";
import Equipment from "../models/equipment.model";
import Organization from "../models/organization.model";
import User from "../models/user.model";
import { CreateEquipmentUnitData, UpdateEquipmentUnitData } from "../validations/equipment-unit.schema";
import { EquipmentNotFoundError } from "./equipment.service";
import { movementFactory, MovementFactory } from "./movement.service";
import { OrganizationNotFoundError } from "./organization.service";

export class EquipmentUnitNotFound extends Error { }

export class EquipmentUnitService {

    constructor(
        private equipmentUnitModel: typeof EquipmentUnit,
        private equipmentModel: typeof Equipment,
        private organizationModel: typeof Organization,
        private movementFactory: MovementFactory
    ) { }

    async findAll(params?: { serialNumber?: number }) {
        const findOptions: WhereOptions<IEquipmentUnit> = {};
        if (params?.serialNumber) {
            findOptions["serialNumber"] = params.serialNumber;
        }

        return this.equipmentUnitModel.findAll({
            include: [{
                model: this.equipmentModel,
            }, {
                model: this.organizationModel
            }],
            where: findOptions
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

    async create(equipmentData: CreateEquipmentUnitData, user: User) {
        const organization = await this.organizationModel.findByPk(equipmentData.organizationId);

        if (!organization) {
            throw new OrganizationNotFoundError("Organización no encontrada");
        }

        const equipment = await this.equipmentModel.findByPk(equipmentData.equipmentId);

        if (!equipment) {
            throw new EquipmentNotFoundError("Equipamiento no encontrado");
        }

        const unit = await this.equipmentUnitModel.create(equipmentData);

        // Registramos que se ingresó una nueva unidad
        await this.movementFactory.createMovement({
            author: user,
            unit
        }, {
            type: MOVEMENT_TYPES.ENTRY
        });

        return unit;
    }

    async update(equipmentId: number, equipmentData: UpdateEquipmentUnitData, user: User) {
        const existing = await this.equipmentUnitModel.findByPk(equipmentId);

        if (!existing) {
            throw new EquipmentUnitNotFound("Unidad no encontrada");
        }

        if (equipmentData.organizationId) {
            const organization = await this.organizationModel.findByPk(equipmentData.organizationId);

            if (!organization) {
                throw new OrganizationNotFoundError("Organización no encontrada");
            }
            await existing.$set("organization", organization);
        }

        if (equipmentData.equipmentId) {
            const equipment = await this.equipmentUnitModel.findByPk(equipmentData.equipmentId);

            if (!equipment) {
                throw new EquipmentNotFoundError("Equipamiento no encontrado");
            }
            await existing.$set("equipment", equipment);
        }

        if (equipmentData.location && existing.location !== equipmentData.location) {
            // Registramos un transporte de la unidad
            const movementInfo = {
                unit: existing,
                author: user
            };
            await this.movementFactory.createMovement(movementInfo, {
                type: MOVEMENT_TYPES.TRANSPORT,
                originLocation: existing.location,
                targetLocation: equipmentData.location
            });
        }

        await existing.update(equipmentData);

        return existing;
    }

    async registerMaintenance(
        equipmentUnitId: number,
        user: User,
        startedAt: Date,
        endedAt: Date,
        maintenanceLocation: string
    ) {
        const unit = await this.findById(equipmentUnitId);
        const info = {
            author: user,
            unit: unit
        };
        const movement = await this.movementFactory.createMovement(info, {
            type: MOVEMENT_TYPES.MAINTENANCE,
            startedAt, endedAt, maintenanceLocation
        });

        return movement;
    }

    async registerTransport(
        equipmentUnitId: number,
        user: User,
        originLocation: string,
        targetLocation: string,
    ) {
        const unit = await this.findById(equipmentUnitId);
        const info = {
            author: user,
            unit
        };
        const movement = await this.movementFactory.createMovement(info, {
            type: MOVEMENT_TYPES.TRANSPORT,
            originLocation, targetLocation,
        });

        return movement;
    }
    async registerDelivery(
        equipmentUnitId: number,
        user: User,
    ) {
        const unit = await this.equipmentUnitModel.findByPk(equipmentUnitId, {
            include: [this.organizationModel]
        });

        if (!unit) {
            throw new EquipmentUnitNotFound("Unidad no encontrada");
        }

        const movement = await this.movementFactory.createMovement({
            author: user,
            unit
        }, {
            type: MOVEMENT_TYPES.DELIVERY,
            organization: unit.organization!
        })

        return movement;
    }

    async delete(equipmentUnitId: number) {
        const affected = await this.equipmentUnitModel.destroy({
            where: { equipmentUnitId }
        });

        if (affected === 0) {
            throw new EquipmentUnitNotFound("Unidad no encontrada");
        }

        return affected;
    }
}

export const equipmentUnitService = new EquipmentUnitService(EquipmentUnit, Equipment, Organization, movementFactory);