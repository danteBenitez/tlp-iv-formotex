import { Optional } from "sequelize";
import { AutoIncrement, Column, Model, PrimaryKey, Table } from "sequelize-typescript";
import { IMovementType } from "../../interfaces/movement-type.interface";

interface MovementTyepCreationAttributes extends Optional<IMovementType, "movementTypeId"> { }

@Table({
    timestamps: true,
    paranoid: true,
    tableName: "movement_type",
    underscored: true
})
export default class MovementType extends Model<IMovementType, MovementTyepCreationAttributes> {

    @PrimaryKey
    @AutoIncrement
    @Column
    declare movementTypeId: number;

    @Column
    declare name: string

    @Column
    declare description: string

    @Column
    declare tableName: string
}