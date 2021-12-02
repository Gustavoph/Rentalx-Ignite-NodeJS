import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { SpecificationInMemory } from "@modules/cars/repositories/in-memory/SpecificationInMemory";
import { AppError } from "@shared/errors/AppError";
import { CreateCarSpecificationUseCase } from "./CreateCarSpecificationUseCase"

let createCarSpecificationUseCase: CreateCarSpecificationUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let specificationsRepositoryInMemory: SpecificationInMemory;

describe('Create Car Specification', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    specificationsRepositoryInMemory = new SpecificationInMemory();
    createCarSpecificationUseCase = new CreateCarSpecificationUseCase(carsRepositoryInMemory, specificationsRepositoryInMemory);
  })

  it('Should be able to add a new specification to the car', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Name Car',
      description: 'Description Car',
      daily_rate: 100,
      license_plate: 'ABC-123',
      fine_amount: 60,
      brand: 'BRAND',
      category_id: 'category'
    })

    const specification = await specificationsRepositoryInMemory.create({
      name: "Test",
      description: "Test"
    })

    const specifications_id = [specification.id];

    const specificationsCar = await createCarSpecificationUseCase.execute({ car_id: car.id, specifications_id });
    expect(specificationsCar).toHaveProperty('specifications')
    expect(specificationsCar.specifications.length).toBe(1)
  })

  it('Should not be able to add a new specification to a now existent car', async () => {
    const car_id =  "1234";
    const specifications_id = ["54321"];
    await expect(createCarSpecificationUseCase.execute({ car_id, specifications_id })
    ).rejects.toEqual(new AppError('Cars does not exits!'))
  })
})