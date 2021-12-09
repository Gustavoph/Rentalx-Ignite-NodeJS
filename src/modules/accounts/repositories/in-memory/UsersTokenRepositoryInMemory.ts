import { IUsersTokenRepository } from "../IUsersTokenRepository";
import { UserToken } from "@modules/accounts/infra/typeorm/entities/UserToken";
import { ICreateUserTokenDTO } from "@modules/accounts/dtos/ICreateUserTokenDTO";


class UsersTokenRepositoryInMemory implements IUsersTokenRepository{
  usersToken: UserToken[] = [];

  constructor() {

  }
  async create({ user_id, expires_date, refresh_token }: ICreateUserTokenDTO): Promise<UserToken> {
    const userToken = new UserToken();
    Object.assign(userToken, {
      user_id,
      expires_date,
      refresh_token
    });

    this.usersToken.push(userToken);

    return userToken;
  }
  async findByUserIdAndRefreshToken(user_id: string, refresh_token: string): Promise<UserToken> {
    const userToken = this.usersToken.find(ut => ut.user_id === user_id && ut.refresh_token === refresh_token);
    return userToken;
  }
  async deleteById(id: string): Promise<void> {
    const userToken = this.usersToken.find(ut => ut.id === id);
    this.usersToken.slice(this.usersToken.indexOf(userToken));
  }
  async findByRefreshToken(token: string): Promise<UserToken> {
    const userToken = this.usersToken.find(ut => ut.refresh_token === token);
    return userToken;
  }
}

export { UsersTokenRepositoryInMemory }