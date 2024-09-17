import { Router } from "express";
import { ROLES } from "../consts/roles";
import { EquipmentUnitController } from "../controllers/equipment-unit.controller";
import { roleMiddleware } from "../middleware/role.middleware";
import { equipmentUnitService } from "../services/equipment-unit.service";

const router = Router();
const controller = new EquipmentUnitController(equipmentUnitService);

router.use([...roleMiddleware(ROLES.USER)]);

router.get('/', (req, res) => controller.findAll(req, res));

router.get('/:equipmentUnitId', (req, res) => controller.findOne(req, res));

router.post('/', (req, res) => controller.create(req, res));

router.post('/:equipmentUnitId/deliver', (req, res) => controller.registerDeliver(req, res))

router.post('/:equipmentUnitId/maintenance', (req, res) => controller.registerMaintenance(req, res))

router.patch('/:equipmentUnitId', (req, res) => controller.update(req, res));

router.delete('/:equipmentUnitId', (req, res) => controller.delete(req, res));

export default router;