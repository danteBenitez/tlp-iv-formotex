import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../database/connection.js";
import { Role } from "./role.model.js";
import { User } from "./user.model.js";

export class UserRole extends Model<InferAttributes<UserRole>, InferCreationAttributes<UserRole>> {
    declare user_role_id: CreationOptional<number>;
    declare role_id: number;
    declare user_id: number;
}

UserRole.init({
    user_role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Role,
            key: "role_id"
        }
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: "user_id"
        }
    }
}, {
    sequelize
});