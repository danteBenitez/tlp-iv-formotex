import { IEquipmentType } from "./equipment-type.interface";

export interface IEquipment {
    equipmentId: string,
    name: string,
    description: string,
    type?: IEquipmentType,
    typeId: number,
    make: string,
}