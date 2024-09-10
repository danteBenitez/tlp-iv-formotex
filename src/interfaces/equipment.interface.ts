import { IEquipmentType } from "./equipment-type.interface";
import { IOrganization } from "./organization.interface";

export interface IEquipment {
    equipmentId: string,
    name: string,
    description: string,
    serialNumber: number,
    type?: IEquipmentType,
    organizationId?: number,
    organization?: IOrganization,
    typeId: number,
    location: string,
    make: string,
}