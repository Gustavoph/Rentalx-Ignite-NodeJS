import { Car } from "@modules/cars/infra/typeorm/entities/Car";
import { ICarsRepository } from "../ICarsRepository";
import { ICreateCategoryDTO } from "../ICategoriesRepository";

class CarsRepositoryInMemory implements ICarsRepository {
  cars: Car[] = [];

  async create(data: ICreateCategoryDTO): Promise<void> {
    const car = new Car();

    Object.assign(car, {
      ...data
    })

    this.cars.push(car);
  }

}

export { CarsRepositoryInMemory };