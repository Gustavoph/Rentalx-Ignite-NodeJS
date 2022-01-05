import 'reflect-metadata';
import 'dotenv/config'

import express, { NextFunction, Request, Response } from 'express';
import "express-async-errors"
import swaggerUi from 'swagger-ui-express';
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";

import createConnection from '@shared/infra/typeorm';

import rateLimiter from '@shared/infra/http/middlewares/rateLimiter'
import { router } from '@shared/infra/http/routes';
import swaggerFile from '../../../swagger.json';

import '@shared/container';
import { AppError } from '@shared/errors/AppError';
import upload from '@config/upload';

createConnection();
const app = express();


app.use(rateLimiter)

Sentry.init({
  dsn: "https://8b06111772274467b1d979847d1d45c8@o1108361.ingest.sentry.io/6135979",
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app }),
  ],
  tracesSampleRate: 1.0,
});
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.use(express.json());


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use('/avatar', express.static(`${upload.tmpFolder}/avatar`))
app.use('/avatar', express.static(`${upload.tmpFolder}/cars`))

app.use(router);

app.use(Sentry.Handlers.errorHandler())

app.use((err: Error, request: Request, response: Response, next: NextFunction) => {
  if(err instanceof AppError) {
    return response.status(err.statusCode).json( { message: err.message})
  }

  return response.status(500).json({
    status: 'Error',
    message: `Internal server error - ${err.message}`
  })
})

export { app };