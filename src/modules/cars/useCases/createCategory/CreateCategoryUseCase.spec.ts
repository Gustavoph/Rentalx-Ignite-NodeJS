import { AppError } from "@shared/errors/AppError";
import { CategoryRepositoryInMemory } from "@modules/cars/repositories/in-memory/CategoryRepositoryInMemory";
import { CreateCategoryUseCase } from "./CreateCategoryUseCase";

let createCategoryUseCase: CreateCategoryUseCase;
let categoriesRepository: CategoryRepositoryInMemory;

describe('Create Category', () => {
  beforeEach(() => {
    categoriesRepository = new CategoryRepositoryInMemory();
    createCategoryUseCase = new CreateCategoryUseCase(categoriesRepository);
  })

  it('should be able to a new category', async () => {
    const category = {
      name: 'Category Test',
      description: 'Category description Test'
    }

    await createCategoryUseCase.execute(category)

    const result = await categoriesRepository.findByName(category.name)

    expect(result).toHaveProperty('id');
  })

  it('should not be able to a new category with name exists', async () => {
    const category = {
      name: 'Category Test',
      description: 'Category description Test'
    }
    await createCategoryUseCase.execute(category)
    await expect(createCategoryUseCase.execute(category)
    ).rejects.toEqual(new AppError('Category Already Exists'))
  })

})