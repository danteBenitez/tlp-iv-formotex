import { Optional } from "sequelize";
import { AutoIncrement, BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { IMovement } from "../../interfaces/movement.interface";
import EquipmentUnit from "../equipment-unit.model";
import User from "../user.model";
import MovementType from "./movement-type.model";

interface MovementCreationAttributes extends Optional<IMovement, "movementId"> { }

@Table({
    timestamps: true,
    paranoid: true,
    tableName: 'movement',
    underscored: true
})
export default class Movement extends Model<IMovement, MovementCreationAttributes> {

    @PrimaryKey
    @AutoIncrement
    @Column
    declare movementId: number;

    @ForeignKey(() => User)
    declare authorId: number

    @BelongsTo(() => User)
    declare author: User

    @ForeignKey(() => EquipmentUnit)
    declare equipmentUnitId: number

    @BelongsTo(() => EquipmentUnit)
    declare unit: EquipmentUnit

    @ForeignKey(() => MovementType)
    declare movementType: number

    @BelongsTo(() => MovementType)
    declare type: EquipmentUnit

    @Column
    declare movementDetailId: number
}