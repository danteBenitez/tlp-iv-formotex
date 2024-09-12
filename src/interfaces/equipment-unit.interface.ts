import { EquipmentState } from "../consts/equipment-states";
import { IEquipment } from "./equipment.interface";
import { IOrganization } from "./organization.interface";
export interface IEquipmentUnit {
    equipmentUnitId: number,
    serialNumber: number,
    equipment?: IEquipment,
    equipmentId: number,
    state: EquipmentState
    acquiredAt: Date,
    organizationId: number,
    organization?: IOrganization,
    location: string,
}