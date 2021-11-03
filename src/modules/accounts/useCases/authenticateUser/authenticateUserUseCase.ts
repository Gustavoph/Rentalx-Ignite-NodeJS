import { compare } from 'bcrypt';
import { inject, injectable } from 'tsyringe';
import { sign } from 'jsonwebtoken'

import { AppError } from '@shared/errors/AppError';
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: {
    name: string,
    email: string
  },
  token: string;
}

@injectable()
class AuthenticateUserUseCase {
  constructor(@inject('UsersRepository') private usersRepository: IUsersRepository){}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if(!user) throw new AppError("Email or password incorrect");

    const passwordMath = compare(password, user.password);

    if (!passwordMath) throw new AppError("Email or password incorrect");

    const token = sign({}, "cc3a0280e4fc1415930899896574e118", {
      subject: user.id,
      expiresIn: '1d'
    })

    const tokenReturn: IResponse  = {
      user: {
        name: user.name,
        email: user.email
      },
      token
    }

    return tokenReturn

  }
}

export { AuthenticateUserUseCase }