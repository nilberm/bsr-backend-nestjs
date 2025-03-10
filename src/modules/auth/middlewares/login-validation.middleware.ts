import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { LoginRequestBody } from '../models/LoginRequestBody';
import { validate } from 'class-validator';

@Injectable()
export class LoginValidationMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body as LoginRequestBody;

    if (!email || !password) {
      throw new BadRequestException('Email and password are required.');
    }

    const loginRequestBody = new LoginRequestBody();
    loginRequestBody.email = email;
    loginRequestBody.password = password;

    const validations = await validate(loginRequestBody);

    if (validations.length) {
      throw new BadRequestException(
        validations.reduce((acc, curr) => {
          return curr.constraints
            ? [...acc, ...Object.values(curr.constraints)]
            : acc;
        }, []),
      );
    }

    next();
  }
}
