import { IEquipmentType } from "./equipment-type.interface";
import { IMake } from "./make.interface";

export interface IEquipment {
    equipmentId: string,
    name: string,
    description: string,
    type?: IEquipmentType,
    typeId: number,
    make?: IMake,
    makeId: number
}