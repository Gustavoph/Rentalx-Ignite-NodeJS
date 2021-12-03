import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken'
import { inject, injectable } from 'tsyringe';

import auth from '@config/auth';
import { AppError } from '@shared/errors/AppError';
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository';
import { IUsersTokenRepository } from '@modules/accounts/repositories/IUsersTokenRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';

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
  refresh_token: string;
}

@injectable()
class AuthenticateUserUseCase {
  constructor(
    @inject('UsersRepository') private usersRepository: IUsersRepository,
    @inject('DayjsDateProvider') private dayjsDateProvider: IDateProvider,
    @inject('UsersTokenRepository') private usersTokenRepository: IUsersTokenRepository,
  ){}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if(!user) throw new AppError("Email or password incorrect");

    const passwordMath = compare(password, user.password);

    if (!passwordMath) throw new AppError("Email or password incorrect");

    const token = sign({}, auth.secret_token, {
      subject: user.id,
      expiresIn: auth.expires_in_token
    })

    const refresh_token = sign({ email }, auth.secret_refresh_token, {
      subject: user.id,
      expiresIn: auth.expires_in_refresh_token
    })

    const refresh_token_expires_date = this.dayjsDateProvider.addDays(30)

    await this.usersTokenRepository.create({
      user_id: user.id,
      refresh_token,
      expires_date: refresh_token_expires_date
    })

    const tokenReturn: IResponse  = {
      user: {
        name: user.name,
        email: user.email
      },
      token,
      refresh_token
    }

    return tokenReturn

  }
}

export { AuthenticateUserUseCase }