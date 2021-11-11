import { Car } from "@modules/cars/infra/typeorm/entities/Car";
import { ICarsRepository } from "../ICarsRepository";
import { ICreateCategoryDTO } from "../ICategoriesRepository";

class CarsRepositoryInMemory implements ICarsRepository {
  cars: Car[] = [];

  async create(data: ICreateCategoryDTO): Promise<Car> {
    const car = new Car();

    Object.assign(car, {
      ...data
    })

    this.cars.push(car);
    return car
  }

  async findByLicensePlate(license_plate): Promise<Car> {
    return this.cars.find(car => car.license_plate === license_plate)
  }
}

export { CarsRepositoryInMemory };