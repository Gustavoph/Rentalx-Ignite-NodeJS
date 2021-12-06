import { verify } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express'

import auth from '@config/auth';
import { AppError } from '@shared/errors/AppError';
import { UsersRepository } from '@modules/accounts/infra/typeorm/repositories/UsersRepository';
import { UsersTokenRepository } from '@modules/accounts/infra/typeorm/repositories/UsersTokenRepository';


interface IPayload {
  sub: string;
}

export async function ensureAuthenticated(request: Request, response: Response, next: NextFunction): Promise<void> {
  const authHeader = request.headers.authorization;
  const usersTokenRepository = new UsersTokenRepository();

  if (!authHeader) throw new AppError("Token missing", 401);

  const token = authHeader.split(' ')[1]

  try {
    const { sub: user_id } = verify(token, auth.secret_refresh_token) as IPayload;

    const usersRepository = new UsersRepository();

    const user = await usersTokenRepository.findByUserIdAndRefreshToken(user_id, token);

    if(!user) throw new AppError('User does not exists!', 401)

    request.user = {
      id: user_id
    }

    next();

  } catch(e) {
    throw new AppError('Invalid token!', 401);

  }
}