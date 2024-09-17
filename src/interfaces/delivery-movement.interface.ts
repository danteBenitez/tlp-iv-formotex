import Movement from "../models/movements/movement.model";
import { IOrganization } from "./organization.interface";

export interface IDeliveryMovement {
    deliveryMovementId: number,
    organizationId: number,
    organization?: IOrganization,
    movement?: Movement
}