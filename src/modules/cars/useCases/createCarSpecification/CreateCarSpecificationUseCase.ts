import { Car } from "@modules/cars/infra/typeorm/entities/Car";
import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository"
import { ISpecificationsRepository } from "@modules/cars/repositories/ISpecificationsRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IRequest {
  car_id: string;
  specifications_id: string[];
}

@injectable()
class CreateCarSpecificationUseCase {
  constructor(
    @inject('CarsRepository') private carsRepository: ICarsRepository,
    @inject('SpecificationsRepository') private specificationsRepository: ISpecificationsRepository
  ){}

  async execute({ car_id, specifications_id }: IRequest): Promise<Car> {
    const carsExists = await this.carsRepository.findById(car_id);
    console.log('1: ', carsExists)

    if(!carsExists) {
      throw new AppError('Cars does not exits!');
    }

    const specifications = await this.specificationsRepository.findByIds(specifications_id)
    console.log('2: ', specifications)

    carsExists.specifications = specifications;

    const a = await this.carsRepository.create(carsExists);
    console.log('A: ', a);
    console.log('Aqui:', carsExists)

    return carsExists;
  }
}

export { CreateCarSpecificationUseCase }