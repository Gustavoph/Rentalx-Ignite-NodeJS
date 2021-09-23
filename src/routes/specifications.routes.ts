import { Router } from 'express';

import { CreateSpecificationsController } from '../modules/cars/useCases/createSpecification/CreateSpecificationsController';

const specificationsRoutes = Router();

const createSpecificationController = new CreateSpecificationsController();

specificationsRoutes.post('/', createSpecificationController.handle);

export { specificationsRoutes };
