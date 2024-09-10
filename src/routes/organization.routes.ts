import { Router } from "express";
import { ROLES } from "../consts/roles";
import { OrganizationController } from "../controllers/organization.controller";
import { roleMiddleware } from "../middleware/role.middleware";
import { organizationService } from "../services/organization.service";

const router = Router();
const controller = new OrganizationController(organizationService);

router.use([...roleMiddleware(ROLES.ADMIN)]);

router.get('/', (req, res) => controller.findAll(req, res));

router.get('/:organizationId', (req, res) => controller.findById(req, res));

router.post('/', (req, res) => controller.create(req, res));

router.patch('/:organizationId', (req, res) => controller.update(req, res));

router.delete('/:organizationId', (req, res) => controller.delete(req, res));

export default router;