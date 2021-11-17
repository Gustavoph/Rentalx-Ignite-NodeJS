import { Car } from "@modules/cars/infra/typeorm/entities/Car";
import { Specification } from "@modules/cars/infra/typeorm/entities/Specification";
import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IRequest {
  name: string;
  description: string;
  daily_rate: number;
  license_plate: string;
  fine_amount: number;
  brand: string;
  category_id: string;
  specifications?: Specification[];
}

@injectable()
class CreateCarUseCase {
  constructor(
    @inject('CarsRepository')
    private carsrepository: ICarsRepository){}

  async execute({
    name, description, daily_rate, license_plate, fine_amount, brand, category_id, specifications
  }: IRequest): Promise<Car> {
    const carExists = await this.carsrepository.findByLicensePlate(license_plate);

    if(carExists) {
      throw new AppError('Car already exists');
    }

    const car = await this.carsrepository.create({
      name,
      description,
      daily_rate,
      license_plate,
      fine_amount,
      brand,
      category_id,
      specifications
    })

    return car;
  }
}

export { CreateCarUseCase }