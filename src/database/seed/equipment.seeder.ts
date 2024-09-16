import { readFile } from "fs/promises";
import path from "path";
import EquipmentType from "../../models/equipment-type.model";
import Equipment from "../../models/equipment.model";
import Make from "../../models/make.model";


export async function seedEquipment() {
    /** Archivo de datos extraído de https://github.com/alexsh882/tlp4-formotex-backend/tree/dev/src/database/seeders/mock */
    const EQUIPMENT_DATA = JSON.parse(await readFile(path.resolve('src/database/seed/mock/equipment.json'), 'utf-8'));

    await Promise.all(EQUIPMENT_DATA.map(async (equipment: Record<string, string>) => {

        const make = await Make.findOrCreate({
            where: {
                name: equipment.marca
            },
            defaults: {
                name: equipment.marca,
                description: equipment.type
            }
        });

        const equipmentType = await EquipmentType.findOrCreate({
            where: {
                name: equipment.type
            },
            defaults: {
                name: equipment.type,
                description: equipment.type
            }
        });

        const equipmentEntity = await Equipment.findOrCreate({
            where: {
                name: equipment.modelo
            },
            defaults: {
                name: equipment.modelo,
                description: equipment.characteristics,
                makeId: make[0].makeId,
                typeId: equipmentType[0].equipmentTypeId
            }
        });

        return equipmentEntity;
    }));

}