import { Router } from "express";
import { ROLES } from "../consts/roles";
import { EquipmentTypeController } from "../controllers/equipment-types.controller";
import { roleMiddleware } from "../middleware/role.middleware";
import { equipmentTypeService } from "../services/equipment-types.service";

const router = Router();

const controller = new EquipmentTypeController(equipmentTypeService);

router.get('/types', (req, res) => controller.findAll(req, res));

router.get('/types/:equipmentTypeId', (req, res) => controller.findOne(req, res));

router.use([...roleMiddleware(ROLES.ADMIN)]);

router.post('/types', (req, res) => controller.create(req, res));

router.patch('/types/:equipmentTypeId', (req, res) => controller.update(req, res));

router.delete('/types/:equipmentTypeId', (req, res) => controller.delete(req, res));

export default router;