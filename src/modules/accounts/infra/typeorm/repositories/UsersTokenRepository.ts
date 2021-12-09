import { ICreateUserTokenDTO } from "@modules/accounts/dtos/ICreateUserTokenDTO";
import { IUsersTokenRepository } from "@modules/accounts/repositories/IUsersTokenRepository";
import { getRepository, Repository } from "typeorm";
import { UserToken } from "../entities/UserToken";

class UsersTokenRepository implements IUsersTokenRepository {
  private repository: Repository<UserToken>

  constructor() {
    this.repository = getRepository(UserToken);
  }

  async create({ user_id, expires_date, refresh_token }: ICreateUserTokenDTO): Promise<UserToken> {
    const userToken = this.repository.create({
      user_id,
      expires_date,
      refresh_token
    });

    await this.repository.save(userToken);

    return userToken;
  }

  async findByUserIdAndRefreshToken(user_id: string, refresh_token: string): Promise<UserToken> {
    const userTokens = await this.repository.findOne({ user_id, refresh_token });
    return userTokens;
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findByRefreshToken(token: string): Promise<UserToken> {
    const userToken = await this.repository.findOne({ refresh_token: token });
    return userToken;
  }
}

export { UsersTokenRepository };