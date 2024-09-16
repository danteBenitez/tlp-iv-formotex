import { Router } from "express";
import { ROLES } from "../consts/roles";
import { MakeController } from "../controllers/make.controller";
import { roleMiddleware } from "../middleware/role.middleware";
import { makeService } from "../services/make.service";

const router = Router();
const controller = new MakeController(makeService);

router.use([...roleMiddleware(ROLES.USER)]);

router.get('/', (req, res) => controller.findAll(req, res));

router.get('/:makeId', (req, res) => controller.findById(req, res));

router.post('/', (req, res) => controller.create(req, res));

router.patch('/:makeId', (req, res) => controller.update(req, res));

router.delete('/:makeId', (req, res) => controller.delete(req, res));

export default router;