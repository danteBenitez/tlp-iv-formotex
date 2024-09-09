import { Optional } from "sequelize";
import { AutoIncrement, Column, Model, PrimaryKey, Table } from "sequelize-typescript";
import { IRole } from "../interfaces/role.interface.js";

interface RoleCreationAttributes extends Optional<IRole, "roleId"> { }

@Table({
    timestamps: true,
    paranoid: true,
    tableName: 'roles',
    underscored: true
})
export default class Role extends Model<IRole, RoleCreationAttributes> {

    @PrimaryKey
    @AutoIncrement
    @Column
    roleId: number;

    @Column
    name: string;
}