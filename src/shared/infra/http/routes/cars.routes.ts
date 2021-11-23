import uploadConfig from '../../../../config/upload';
import { CreateCarController } from '@modules/cars/useCases/createCar/CreateCarController';
import { ListAvailableCarsController } from '@modules/cars/useCases/listAvailableCars/ListAvailableCars';
import { UploadCarImagesController } from '@modules/cars/useCases/uploadCarImage/UploadCarImageController';
import { CreateCarSpecificationController } from '@modules/cars/useCases/createCarSpecification/CreateCarSpecificationController';
import { Router } from 'express';

import { ensureAdmin } from '../middlewares/ensureAdmin';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import multer from 'multer';

const carsRoutes = Router();
const uploadAvatar = multer(uploadConfig.upload('./tmp/cars'))

let createCarController =  new CreateCarController()
let uploadCarImagesController = new UploadCarImagesController();
let listAvailableCarsController = new ListAvailableCarsController();
let createCarSpecificationController = new CreateCarSpecificationController();

carsRoutes.post('/', ensureAuthenticated, ensureAdmin, createCarController.handle);
carsRoutes.get('/available', listAvailableCarsController.handle);
carsRoutes.post('/specifications/:id', ensureAuthenticated, ensureAdmin, createCarSpecificationController.handle)
carsRoutes.post('/images/:id', ensureAuthenticated, ensureAdmin, uploadAvatar.array("images"), uploadCarImagesController.handle)

export { carsRoutes };