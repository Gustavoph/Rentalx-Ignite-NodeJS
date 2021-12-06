import { sign, verify } from 'jsonwebtoken';
import { inject, injectable } from "tsyringe";

import auth from '@config/auth';
import { AppError } from '@shared/errors/AppError';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { IUsersTokenRepository } from '@modules/accounts/repositories/IUsersTokenRepository';

interface IPayload {
  sub: string;
  email: string;
}

@injectable()
class RefreshTokenUseCase {
  constructor(
    @inject('DayjsDateProvider') private dayjsDateProvider: IDateProvider,
    @inject('UsersTokenRepository') private usersTokenRepository: IUsersTokenRepository
  ) {}

  async execute(token: string) {
    const { sub, email } = verify(token, auth.secret_refresh_token) as IPayload;
    const user_id = sub;

    const userTokens = await this.usersTokenRepository.findByUserIdAndRefreshToken(user_id, token);

    if (!userTokens) throw new AppError('Refresh Token does not exists!');

    await this.usersTokenRepository.deleteById(userTokens.id);

    const refresh_token = sign({ email }, auth.secret_refresh_token, {
      subject: sub,
      expiresIn: auth.expires_in_refresh_token
    })

    const refresh_token_expires_date = this.dayjsDateProvider.addDays(30)

    await this.usersTokenRepository.create({
      user_id: sub,
      refresh_token,
      expires_date: refresh_token_expires_date
    })

    return refresh_token;
  }
}

export { RefreshTokenUseCase }