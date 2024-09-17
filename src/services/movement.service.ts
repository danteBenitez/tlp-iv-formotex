import { MOVEMENT_TYPES, MovementType as MovementTypeName } from "../consts/movement-type";
import EquipmentUnit from "../models/equipment-unit.model";
import Equipment from "../models/equipment.model";
import DeliveryMovement from "../models/movements/delivery-movement.model";
import EntryMovement from "../models/movements/entry-movement.model";
import MaintenanceMovement from "../models/movements/maintenance-movement.model";
import MovementType from "../models/movements/movement-type.model";
import Movement from "../models/movements/movement.model";
import TransportMovement from "../models/movements/transport-movement.model";
import Organization from "../models/organization.model";
import User from "../models/user.model";

type MovementInfo = {
    author: User,
    unit: EquipmentUnit
}

export class MovementTypeNotFound extends Error { }

/**
 * Un servicio que permite el registro de movimientos dentro de los inventarios.
 * 
 * Se considera movimiento cualquier cambio en la ubicación de los equipos,
 * y existen tres razones principales para ello:
 *  - Mantenimiento
 *  - Transporte entre depósitos de Formotex
 *  - Entrega de equipos a su organización
 */
export class MovementService {

    constructor(
        private movementModel: typeof Movement,
        private movementTypeModel: typeof MovementType,
        private transportMovementModel: typeof TransportMovement,
        private maintenanceMovementModel: typeof MaintenanceMovement,
        private deliveryMovementModel: typeof DeliveryMovement,
        private entryMovementModel: typeof EntryMovement
    ) { }

    async findAll(type?: MovementTypeName) {
        const movements = await this.movementModel.findAll({
            order: [["createdAt", "DESC"]],
            include: [{
                model: EquipmentUnit,
                include: [Equipment]
            }, User, {
                model: MovementType,
                attributes: { exclude: ["tableName"] },
                where: type ? {
                    name: type ?? ""
                } : {}
            }],
        });

        return Promise.all(movements.map(async m => {
            const model = await this.getModelFromType(m.movementTypeId);

            return {
                // @ts-expect-error
                ...m.dataValues, details: await model.findByPk(m.movementDetailId, {
                    include: { all: true }
                })
            };
        }));
    }

    async getModelFromType(typeId: number) {
        const type = await this.movementTypeModel.findByPk(typeId);

        if (!type) {
            throw new MovementTypeNotFound("Tipo de movimiento no encontrado");
        }

        const NAME_TO_MODEL = {
            [MOVEMENT_TYPES.DELIVERY]: DeliveryMovement,
            [MOVEMENT_TYPES.ENTRY]: EntryMovement,
            [MOVEMENT_TYPES.MAINTENANCE]: MaintenanceMovement,
            [MOVEMENT_TYPES.TRANSPORT]: TransportMovement
        };

        return NAME_TO_MODEL[type.name as MovementTypeName];
    }

    async createTransportMovement(movementInfo: MovementInfo, originLocation: string, targetLocation: string) {
        const type = await this.movementTypeModel.findOne({
            where: { name: MOVEMENT_TYPES.TRANSPORT }
        });

        if (!type) {
            console.error("No es posible encontrar los tipos de movimiento. Sincronice la base de datos");
            throw new MovementTypeNotFound("No se encontró el tipo de movimiento");
        }

        const detail = await this.transportMovementModel.create({
            originLocation,
            targetLocation
        });

        const movement = await this.movementModel.create({
            authorId: movementInfo.author.userId,
            equipmentUnitId: movementInfo.unit.equipmentUnitId,
            movementTypeId: type.movementTypeId,
            movementDetailId: detail.transportMovementId
        });

        return movement;
    }

    async createDeliveryMovement(movementInfo: MovementInfo, organization: Organization) {
        const type = await this.movementTypeModel.findOne({
            where: { name: MOVEMENT_TYPES.DELIVERY }
        });

        if (!type) {
            console.error("No es posible encontrar los tipos de movimiento. Sincronice la base de datos");
            throw new MovementTypeNotFound("No se encontró el tipo de movimiento");
        }

        const detail = await this.deliveryMovementModel.create({
            organizationId: organization.organizationId
        });

        const movement = await this.movementModel.create({
            authorId: movementInfo.author.userId,
            equipmentUnitId: movementInfo.unit.equipmentUnitId,
            movementTypeId: type.movementTypeId,
            movementDetailId: detail.deliveryMovementId
        });

        return movement;

    }

    async createMaintenanceMovement(movementInfo: MovementInfo, startedAt: Date, endedAt: Date, maintenanceLocation: string) {
        const type = await this.movementTypeModel.findOne({
            where: { name: MOVEMENT_TYPES.MAINTENANCE }
        });

        if (!type) {
            console.error("No es posible encontrar los tipos de movimiento. Sincronice la base de datos");
            throw new MovementTypeNotFound("No se encontró el tipo de movimiento");
        }

        const detail = await this.maintenanceMovementModel.create({
            startedAt,
            endedAt,
            maintenanceLocation
        });

        const movement = await this.movementModel.create({
            authorId: movementInfo.author.userId,
            equipmentUnitId: movementInfo.unit.equipmentUnitId,
            movementTypeId: type.movementTypeId,
            movementDetailId: detail.maintenanceMovementId
        });

        return movement;
    }

    async createEntryMovement(movementInfo: MovementInfo) {
        const type = await this.movementTypeModel.findOne({
            where: { name: MOVEMENT_TYPES.ENTRY }
        });
        console.log({
            type
        });

        if (!type) {
            console.error("No es posible encontrar los tipos de movimiento. Sincronice la base de datos");
            throw new MovementTypeNotFound("No se encontró el tipo de movimiento");
        }

        const detail = await this.entryMovementModel.create();

        const movement = await this.movementModel.create({
            authorId: movementInfo.author.userId,
            equipmentUnitId: movementInfo.unit.equipmentUnitId,
            movementTypeId: type.movementTypeId,
            movementDetailId: detail.entryMovementId
        });

        return movement;
    }
}

export const movementService = new MovementService(Movement, MovementType, TransportMovement, MaintenanceMovement, DeliveryMovement, EntryMovement);