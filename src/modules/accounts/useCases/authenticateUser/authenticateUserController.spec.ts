import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./authenticateUserUseCase"
import { UsersRepositoryInMemory } from "../../repositories/in-memory/UsersRepositoryInMemory";
import { ICreateUserDTO } from "../../dtos/ICreateUserDTO";
import { AppError } from "@shared/errors/AppError";

let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
const user: ICreateUserDTO = {
  driver_license: '000123',
  email: 'test@test.com',
  password: '123456',
  name: 'User Test'
};

describe('Authenticate User', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  })

  it('Should be able to authenticate an user', async () => {
    await createUserUseCase.execute(user);
    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    })
    expect(result).toHaveProperty('token');
  })

  it('Should not be able to authenticate an nonexitent user', () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: 'test@test.com',
        password: '123456',
      })
    }).rejects.toBeInstanceOf(AppError);
  })

  it('Should not be able to authenticate with incorrect password', () => {
    expect(async () => {
      await createUserUseCase.execute(user);
      await authenticateUserUseCase.execute({
        email: user.email,
        password: 'incorrectPassword'
      })
    }).rejects.toBeInstanceOf(AppError);
  })

})