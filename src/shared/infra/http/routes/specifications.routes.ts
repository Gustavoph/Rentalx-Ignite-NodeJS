import { Router } from 'express';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { CreateSpecificationsController } from '@modules/cars/useCases/createSpecification/CreateSpecificationsController';
import { ensureAdmin } from '../middlewares/ensureAdmin';


const specificationsRoutes = Router();

const createSpecificationController = new CreateSpecificationsController();

specificationsRoutes.use(ensureAuthenticated);
specificationsRoutes.post('/', ensureAdmin, createSpecificationController.handle);

export { specificationsRoutes };
