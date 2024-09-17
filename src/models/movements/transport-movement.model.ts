import { Optional } from "sequelize";
import { AutoIncrement, Column, Model, PrimaryKey, Table } from "sequelize-typescript";
import { MOVEMENT_TYPES, MOVEMENT_TYPES_TABLE_NAMES } from "../../consts/movement-type";
import { ITransportMovement } from "../../interfaces/transport-movement.interface";

interface TransportMovementCreationAttributes extends Optional<ITransportMovement, "transportMovementId"> { }

@Table({
    timestamps: true,
    paranoid: true,
    tableName: MOVEMENT_TYPES_TABLE_NAMES[MOVEMENT_TYPES.TRANSPORT],
    underscored: true
})
export default class TransportMovement extends Model<ITransportMovement, TransportMovementCreationAttributes> {

    @PrimaryKey
    @AutoIncrement
    @Column
    declare transportMovementId: number;

    @Column
    declare originLocation: string;

    @Column
    declare targetLocation: string
}