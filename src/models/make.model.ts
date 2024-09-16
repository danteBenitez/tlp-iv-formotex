import { Optional } from "sequelize";
import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";
import { IMake } from "../interfaces/make.interface.js";

interface MakeCreationAttributes extends Optional<IMake, "makeId"> { }

@Table({
    timestamps: true,
    paranoid: true,
    tableName: 'makes',
    underscored: true
})
export default class Make extends Model<IMake, MakeCreationAttributes> {

    @PrimaryKey
    @AutoIncrement
    @Column
    declare makeId: number;

    @Column
    declare name: string

    @Column(DataType.TEXT)
    declare description: string
}