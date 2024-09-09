import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../database/connection.js";

export class User extends Model<
    InferAttributes<User>,
    InferCreationAttributes<User>
> {
    declare user_id: CreationOptional<number>;
    declare username: string;
    declare password: string;
    declare email: string;
}

User.init(
    {
        user_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        timestamps: true,
        paranoid: true,
        sequelize
    }
);