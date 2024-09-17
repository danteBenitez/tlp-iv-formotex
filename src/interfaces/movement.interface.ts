import { IMovementType } from "./movement-type.interface";
import { IUser } from "./user.interface";

export interface IMovement {
    movementId: number,
    equipmentUnitId: number,
    movementType?: IMovementType,
    movementTypeId: number,
    movementDetailId: number,
    author?: IUser,
    authorId: number
}