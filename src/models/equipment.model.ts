import { Optional } from "sequelize";
import { AutoIncrement, BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { IEquipment } from "../interfaces/equipment.interface.js";
import EquipmentType from "./equipment-type.model.js";
import Organization from "./organization.model.js";

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

    @Column
    declare description: string

    @Column
    declare series_number: string

    @BelongsTo(() => EquipmentType)
    declare type: EquipmentType

    @ForeignKey(() => EquipmentType)
    declare typeId: number

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
    declare make: string

    @Column
    declare acquiredAt: Date

}