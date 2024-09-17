import { Router } from "express";
import { MovementController } from "../controllers/movement-controller";
import { movementService } from "../services/movement.service";

const router = Router()
const controller = new MovementController(movementService);

router.get('/', (req, res) => controller.findAll(req, res));

export default router;