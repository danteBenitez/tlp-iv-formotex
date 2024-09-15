import { MovementType } from "../consts/movement-type";

/**
 * Un servicio que permite el registro de movimientos dentro de los inventarios.
 */
export class MovementService {

    async findAll(type: MovementType) { }

    async createTransportMovement() { }

    async createDeliveryMovement() { }

    async createMaintenanceMovement() { }
}