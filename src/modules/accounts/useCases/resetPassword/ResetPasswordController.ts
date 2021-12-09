import { container } from "tsyringe";
import { Request, Response } from "express";
import { ResetPasswordUseCase } from "./ResetPasswordUseCase";

class ResetPasswordController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { token } = request.query;
    const { password } = request.body;

    const resetPasswordUseCase = container.resolve(ResetPasswordUseCase)

    await resetPasswordUseCase.execute(String(token), password)

    return response.json();
  }
}

export { ResetPasswordController };