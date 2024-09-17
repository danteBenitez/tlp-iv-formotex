import { Optional } from "sequelize";
import { AutoIncrement, Column, Model, PrimaryKey, Table } from "sequelize-typescript";
import { MOVEMENT_TYPES, MOVEMENT_TYPES_TABLE_NAMES } from "../../consts/movement-type";
import { IEntryMovement } from "../../interfaces/entry-movement.interface";

interface EntryMovementCreationAttributes extends Optional<IEntryMovement, "entryMovementId"> { }

@Table({
    timestamps: true,
    paranoid: true,
    tableName: MOVEMENT_TYPES_TABLE_NAMES[MOVEMENT_TYPES.ENTRY],
    underscored: true
})
export default class EntryMovement extends Model<IEntryMovement, EntryMovementCreationAttributes> {
    @PrimaryKey
    @AutoIncrement
    @Column
    declare entryMovementId: number;
}