import { MOVEMENT_TYPES, MOVEMENT_TYPES_TABLE_NAMES, MOVEMENT_TYPES_TO_DESCRIPTION } from "../../consts/movement-type";
import MovementType from "../../models/movements/movement-type.model";

export async function seedMovementTypes() {
    await Promise.all(Object.values(MOVEMENT_TYPES).map(async type => {
        await MovementType.findOrCreate({
            where: {
                name: type,
            },
            defaults: {
                name: type,
                description: MOVEMENT_TYPES_TO_DESCRIPTION[type],
                tableName: MOVEMENT_TYPES_TABLE_NAMES[type],
            }
        });
    }));
}