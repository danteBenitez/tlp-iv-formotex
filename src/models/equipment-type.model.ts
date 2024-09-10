import { Optional } from "sequelize";
import { AutoIncrement, Column, Model, PrimaryKey, Table } from "sequelize-typescript";
import { IEquipmentType } from "../interfaces/equipment-type.interface";

interface EquipmentTypeCreationAttributes extends Optional<IEquipmentType, "equipmentTypeId"> { }

@Table({
    timestamps: true,
    paranoid: true,
    tableName: 'equipment_type',
    underscored: true
})
export default class EquipmentType extends Model<IEquipmentType, EquipmentTypeCreationAttributes> {

    @PrimaryKey
    @AutoIncrement
    @Column
    declare equipmentTypeId: number;

    @Column
    declare name: string

    @Column
    declare description: string
}