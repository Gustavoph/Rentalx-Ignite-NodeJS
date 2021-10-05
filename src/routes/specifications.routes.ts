import { Router } from 'express';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

import { CreateSpecificationsController } from '../modules/cars/useCases/createSpecification/CreateSpecificationsController';

const specificationsRoutes = Router();

const createSpecificationController = new CreateSpecificationsController();

specificationsRoutes.use(ensureAuthenticated);
specificationsRoutes.post('/', createSpecificationController.handle);

export { specificationsRoutes };
