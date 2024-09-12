import { Optional } from "sequelize";
import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { IEquipment } from "../interfaces/equipment.interface.js";
import EquipmentType from "./equipment-type.model.js";
import EquipmentUnit from "./equipment-unit.model.js";

interface EquipmentCreationAttributes extends Optional<IEquipment, "equipmentId"> { }

@Table({
    timestamps: true,
    paranoid: true,
    tableName: 'equipment',
    underscored: true
})
export default class Equipment extends Model<IEquipment, EquipmentCreationAttributes> {

    @PrimaryKey
    @AutoIncrement
    @Column
    declare equipmentId: number;

    @Column
    declare name: string

    @Column(DataType.TEXT)
    declare description: string

    @BelongsTo(() => EquipmentType)
    declare type: EquipmentType

    @ForeignKey(() => EquipmentType)
    declare typeId: number

    @Column
    declare make: string

    @HasMany(() => EquipmentUnit)
    declare equipmentUnits: EquipmentUnit[]
}