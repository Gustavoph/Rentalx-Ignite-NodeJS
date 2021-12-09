import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./authenticateUserUseCase"
import { UsersRepositoryInMemory } from "../../repositories/in-memory/UsersRepositoryInMemory";
import { ICreateUserDTO } from "../../dtos/ICreateUserDTO";
import { AppError } from "@shared/errors/AppError";
import { UsersTokenRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersTokenRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";

let dateProvider: DayjsDateProvider;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let usersTokenRepositoryInMemory: UsersTokenRepositoryInMemory;
const user: ICreateUserDTO = {
  driver_license: '000123',
  email: 'test@test.com',
  password: '123456',
  name: 'User Test'
};

describe('Authenticate User', () => {
  beforeEach(() => {
    dateProvider = new DayjsDateProvider();
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    usersTokenRepositoryInMemory = new UsersTokenRepositoryInMemory();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory,
      dateProvider,
      usersTokenRepositoryInMemory,
    );
  })

  it('Should be able to authenticate an user', async () => {
    await createUserUseCase.execute(user);
    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    })
    expect(result).toHaveProperty('token');
  })

  it('Should not be able to authenticate an nonexitent user', async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: 'userNotFound',
        password: '123456',
      })
    ).rejects.toEqual(new AppError('Email or password incorrect'));
  })

  it('Should not be able to authenticate with incorrect password', async () => {
    await createUserUseCase.execute(user);
    await expect(
      authenticateUserUseCase.execute({
        email: 'user.email',
        password: 'incorrectPassword'
      })
    ).rejects.toEqual(new AppError('Email or password incorrect'));
  })

})