import { DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../database/connection.js";

export class Role extends Model<InferAttributes<Role>, InferCreationAttributes<Role>> {
    declare role_id: number;
    declare name: string;
}

Role.init(
    {
        role_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        timestamps: true,
        paranoid: true,
        sequelize
    }
)