import { Optional } from "sequelize";
import { AutoIncrement, Column, Model, PrimaryKey, Table } from "sequelize-typescript";
import { IOrganization } from "../interfaces/organization.interface.js";

interface OrganizationCreationAttributes extends Optional<IOrganization, "organizationId"> { }

@Table({
    timestamps: true,
    paranoid: true,
    tableName: 'organization',
    underscored: true
})
export default class Organization extends Model<IOrganization, OrganizationCreationAttributes> {
    @PrimaryKey
    @AutoIncrement
    @Column
    declare organizationId: number;

    @Column
    declare name: string

    @Column
    declare location: string
}