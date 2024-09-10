import { Router } from "express";
import { ROLES } from "../consts/roles";
import { EquipmentController } from "../controllers/equipment.controller";
import { roleMiddleware } from "../middleware/role.middleware";
import { equipmentService } from "../services/equipment.service";

const router = Router();
const controller = new EquipmentController(equipmentService);

router.use([...roleMiddleware(ROLES.USER)]);

router.get('/', (req, res) => controller.findAll(req, res));

router.get('/:equipmentId', (req, res) => controller.findById(req, res));

router.post('/', (req, res) => controller.create(req, res));

router.patch('/:equipmentId', (req, res) => controller.update(req, res));

export default router;