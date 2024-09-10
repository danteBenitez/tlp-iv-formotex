import { IEquipmentType } from "./equipment-type.interface";

export interface IEquipment {
    equipmentId: string,
    name: string,
    description: string,
    series_number: string,
    stock: number,
    type: IEquipmentType,
    location: string,
    make: string,
}