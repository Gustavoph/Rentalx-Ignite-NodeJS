import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { ListCarsUseCase } from "./ListCarsUseCase"

let carsRepositoryInMemory: CarsRepositoryInMemory;
let listCarsUseCase: ListCarsUseCase;

describe('List Cars', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    listCarsUseCase = new ListCarsUseCase(carsRepositoryInMemory);
  })

  it('Should be able to list all available cars', async () => {
    let car = await carsRepositoryInMemory.create({
      name: "Audi A1",
      description: "Carro com espaço",
      daily_rate: 140.00,
      license_plate: "DEF-1311",
      fine_amount: 100,
      brand: "BMW",
      category_id: "afb757cc-0a1d-4685-9e5b-08bf51490588"
    })

    const cars = await listCarsUseCase.execute({});

    expect(cars).toEqual([car])
  })

  it('Should be able to list all available cars by name', async () => {
    let car = await carsRepositoryInMemory.create({
      name: "Audi A1",
      description: "Carro com espaço",
      daily_rate: 140.00,
      license_plate: "DEF-1311",
      fine_amount: 100,
      brand: "BMW",
      category_id: "afb757cc-0a1d-4685-9e5b-08bf51490588"
    })

    const cars = await listCarsUseCase.execute({});

    expect(cars).toEqual([car])
  })
})