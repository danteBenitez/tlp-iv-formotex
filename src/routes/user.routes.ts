import { Router } from "express";
import { ROLES } from "../consts/roles";
import { UserController } from "../controllers/user.controller";
import { roleMiddleware } from "../middleware/role.middleware";
import { usersService } from "../services/user.service";

const router = Router();
const controller = new UserController(usersService);

router.use([...roleMiddleware(ROLES.ADMIN)]);

router.get('/', (req, res) => controller.findAllUsers(req, res));

router.get('/:userId', (req, res) => controller.findById(req, res));

router.post('/', (req, res) => controller.create(req, res));

router.patch('/:userId', (req, res) => controller.updateUserById(req, res));

export default router;