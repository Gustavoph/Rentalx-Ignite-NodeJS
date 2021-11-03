import { container } from 'tsyringe';
import { Request, Response } from 'express';

import { AuthenticateUserUseCase } from './authenticateUserUseCase'

class AuthenticateUserController {
  async handle(request: Request, response: Response): Promise<Response>{
    const { email, password } = request.body;

    const authenticateUserUseCase = container.resolve(AuthenticateUserUseCase);

    const token = await authenticateUserUseCase.execute({ email, password });

    return response.json(token)
  }
}

export { AuthenticateUserController }