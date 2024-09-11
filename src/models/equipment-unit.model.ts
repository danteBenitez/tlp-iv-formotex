import { Optional } from "sequelize";
import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { ALLOWED_EQUIPMENT_STATES, EquipmentState } from "../consts/equipment-states";
import { IEquipmentUnit } from "../interfaces/equipment-unit.interface";
import Equipment from "./equipment.model";
import Organization from "./organization.model";

interface EquipmentUnitCreationAttributes extends Optional<IEquipmentUnit, "equipmentUnitId"> { }

@Table({
    timestamps: true,
    paranoid: true,
    tableName: 'equipment_unit',
    underscored: true
})
export default class EquipmentUnit extends Model<IEquipmentUnit, EquipmentUnitCreationAttributes> {

    @PrimaryKey
    @AutoIncrement
    @Column
    declare equipmentUnitId: number;

    @Column
    declare serialNumber: string

    @Column
    @ForeignKey(() => Equipment)
    declare equipmentId: number;

    @Column(DataType.ENUM(...ALLOWED_EQUIPMENT_STATES))
    declare state: EquipmentState

    @BelongsTo(() => Equipment)
    declare equipment: Equipment;

    @BelongsTo(() => Organization)
    declare organization?: Organization

    @ForeignKey(() => Organization)
    @Column({
        allowNull: true,
        defaultValue: null,
    })
    declare organizationId?: number

    @Column
    declare location: string

    @Column
    declare acquiredAt: Date
}