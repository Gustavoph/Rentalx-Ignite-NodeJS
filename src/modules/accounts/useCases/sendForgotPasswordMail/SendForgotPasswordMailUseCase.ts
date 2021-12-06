import { v4 as uuid } from 'uuid';
import { inject, injectable } from "tsyringe"

import { AppError } from "@shared/errors/AppError";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository"
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { IUsersTokenRepository } from "@modules/accounts/repositories/IUsersTokenRepository"

@injectable()
class SendForgotPasswordMailUseCase {
  constructor(
    @inject('UsersRepository') private usersRepository: IUsersRepository,
    @inject('DayjsDateProvider') private dayjsDateProvider: IDateProvider,
    @inject('UsersTokenRepository') private usersTokenRepository: IUsersTokenRepository
  ) {}

  async execute(email: string) {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) throw new AppError('User does not exits!');

    const token = uuid();

    await this.usersTokenRepository.create({
      refresh_token: token,
      user_id: user.id,
      expires_date: this.dayjsDateProvider.addHours(3)
    })
  }
}

export { SendForgotPasswordMailUseCase }