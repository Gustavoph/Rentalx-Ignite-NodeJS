import { CreateSpecificationsController } from './CreateSpecificationsController';
import { CreateSpecificationUseCase } from './CreateSpecificationsUseCase';
import { SpecificationsRepository } from '../../repositories/implementations/SpecificationsRepository';

const specificationsRepository = new SpecificationsRepository();
const createSpecificationUseCase = new CreateSpecificationUseCase(
  specificationsRepository
);
const createSpecificationsController = new CreateSpecificationsController(
  createSpecificationUseCase
);

export { createSpecificationsController };
