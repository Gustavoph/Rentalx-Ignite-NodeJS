import { AppError } from '@shared/errors/AppError';
import { UsersRepository } from '@modules/accounts/infra/typeorm/repositories/UsersRepository';
import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken';


interface IPayload {
  sub: string;
}

export async function ensureAuthenticated(request: Request, response: Response, next: NextFunction): Promise<void> {
  const authHeader = request.headers.authorization;

  if (!authHeader) throw new AppError("Token missing", 401);

  const token = authHeader.split(' ')[1]

  try {
    const { sub: user_id } = verify(token, 'cc3a0280e4fc1415930899896574e118') as IPayload;

    const usersRepository = new UsersRepository();

    const user = await usersRepository.findById(user_id);

    if(!user) throw new AppError('User does not exists!', 401)

    request.user = {
      id: user_id
    }

    next();

  } catch(e) {
    throw new AppError('Invalid token!', 401);

  }
}