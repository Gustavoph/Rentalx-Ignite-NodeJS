import { ICreateCarDTO } from "@modules/cars/dtos/ICreateCarDTO";
import { Car } from "@modules/cars/infra/typeorm/entities/Car";
import { ICarsRepository } from "../ICarsRepository";

class CarsRepositoryInMemory implements ICarsRepository {
  cars: Car[] = [];

  async findAvailable(
    category_id?: string,
    name?: string,
    brand?: string
    ): Promise<Car[]> {
    return this.cars
      .filter(car => {
        if(
          car.available === true
          || ((brand && car.brand === brand)
          || (category_id && car.category_id === category_id)
          || (name && car.name === name))) {
          return car
        }
        return null
      })
  }

  async create(data: ICreateCarDTO): Promise<Car> {
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

  async findById(id): Promise<Car> {
    const car = await this.cars.find(car => car.id === id);
    return car;
  }

  async updateAvailable(id: string, available: boolean): Promise<void> {
    const findIndex = this.cars.findIndex(car => car.id === id);
    this.cars[findIndex].available =available;
  }
}

export { CarsRepositoryInMemory };