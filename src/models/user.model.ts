import { Optional } from "sequelize";
import { AutoIncrement, BelongsToMany, Column, Model, PrimaryKey, Table } from "sequelize-typescript";
import { IUser } from "../interfaces/user.interface.js";
import Role from "./role.model.js";
import UserRole from "./user-roles.model.js";

interface UserCreationAttributes extends Optional<IUser, 'userId'> { }

@Table({
    timestamps: true,
    paranoid: true,
    tableName: 'users'
})
export default class User extends Model<IUser, UserCreationAttributes> {

    @PrimaryKey
    @AutoIncrement
    @Column({
        field: "user_id"
    })
    userId: number;

    @Column
    username: string;

    @Column
    password: string;

    @Column
    email: string;

    @BelongsToMany(() => Role, () => UserRole)
    roles: Role[]
}