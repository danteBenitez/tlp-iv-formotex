import { Router } from "express";
import { ROLES } from "../consts/roles";
import { EquipmentTypeController } from "../controllers/equipment-types.controller";
import { roleMiddleware } from "../middleware/role.middleware";
import { equipmentTypeService } from "../services/equipment-types.service";

const router = Router();

const controller = new EquipmentTypeController(equipmentTypeService);

router.get('/', (req, res) => controller.findAll(req, res));

router.get('/:equipmentTypeId', (req, res) => controller.findOne(req, res));

router.use([...roleMiddleware(ROLES.ADMIN)]);

router.post('/', (req, res) => controller.create(req, res));

router.patch('/:equipmentTypeId', (req, res) => controller.update(req, res));

router.delete('/:equipmentTypeId', (req, res) => controller.delete(req, res));

export default router;