import { hash } from 'bcrypt';
import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/AppError";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IUsersTokenRepository } from "@modules/accounts/repositories/IUsersTokenRepository";

@injectable()
class ResetPasswordUseCase {
  constructor(
    @inject('UsersRepository') private usersRepository: IUsersRepository ,
    @inject('DayjsDateProvider') private dayjsDateProvider: IDateProvider,
    @inject('UsersTokenRepository') private usersTokenRepository: IUsersTokenRepository
  ) {}

  async execute(token: string, password: string){
    const userToken = await this.usersTokenRepository.findByRefreshToken(token);

    if (!userToken) throw new AppError('Token Invalid');

    if(this.dayjsDateProvider.compareIfBefore(userToken.expires_date, this.dayjsDateProvider.dateNow()))
    throw new AppError('Token Invalid');

    const user = await this.usersRepository.findById(userToken.user_id)

    user.password = await hash(password, 8);

    await this.usersRepository.create(user);

    await this.usersTokenRepository.deleteById(userToken.id);
  }
}

export { ResetPasswordUseCase };