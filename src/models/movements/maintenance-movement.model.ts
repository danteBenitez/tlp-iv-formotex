import { Optional } from "sequelize";
import { AutoIncrement, Column, Model, PrimaryKey, Table } from "sequelize-typescript";
import { MOVEMENT_TYPES, MOVEMENT_TYPES_TABLE_NAMES } from "../../consts/movement-type";
import { IMaintenanceMovement } from "../../interfaces/maintenance-movement.interface";

interface MaintenanceMovementCreationAttributes extends Optional<IMaintenanceMovement, "maintenanceMovementId"> { }

@Table({
    timestamps: true,
    paranoid: true,
    tableName: MOVEMENT_TYPES_TABLE_NAMES[MOVEMENT_TYPES.MAINTENANCE],
    underscored: true
})
export default class MaintenanceMovement extends Model<IMaintenanceMovement, MaintenanceMovementCreationAttributes> {

    @PrimaryKey
    @AutoIncrement
    @Column
    declare maintenanceMovementId: number;

    @Column
    declare maintenanceLocation: string;

    @Column
    declare startedAt: Date

    @Column
    declare endedAt: Date
}