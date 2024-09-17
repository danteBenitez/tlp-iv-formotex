import { Optional } from "sequelize";
import { AutoIncrement, BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { MOVEMENT_TYPES, MOVEMENT_TYPES_TABLE_NAMES } from "../../consts/movement-type";
import { IDeliveryMovement } from "../../interfaces/delivery-movement.interface";
import Organization from "../organization.model";

interface DeliveryMovementCreationAttributes extends Optional<IDeliveryMovement, "deliveryMovementId"> { }

@Table({
    timestamps: true,
    paranoid: true,
    tableName: MOVEMENT_TYPES_TABLE_NAMES[MOVEMENT_TYPES.DELIVERY],
    underscored: true
})
export default class DeliveryMovement extends Model<IDeliveryMovement, DeliveryMovementCreationAttributes> {

    @PrimaryKey
    @AutoIncrement
    @Column
    declare deliveryMovementId: number;

    @BelongsTo(() => Organization)
    declare organization?: Organization

    @ForeignKey(() => Organization)
    declare organizationId: number
}