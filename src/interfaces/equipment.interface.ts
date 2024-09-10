import { IEquipmentType } from "./equipment-type.interface";

export interface IEquipment {
    equipmentId: string,
    name: string,
    description: string,
    serialNumber: number,
    type?: IEquipmentType,
    typeId: number,
    location: string,
    make: string,
}