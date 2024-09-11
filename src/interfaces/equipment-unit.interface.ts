import { IEquipment } from "./equipment.interface";

export interface IEquipmentUnit {
    equipmentUnitId: number,
    serialNumber: number,
    equipment?: IEquipment,
    equipmentId: number
}