import { Pool } from 'pg';
import { basename, join } from 'path';
import {
  guard, object, string, number
} from 'decoders';
import { Router } from 'express';
import { createLogger } from '../common/logger';
import { withDefault, stringToFilePath, stringToInt } from '../common/decoders';
import { createServer } from '../common/server';
import { initRoutes } from './src/routes';
import { AuthService, createAuthService } from './src/auth-service';
import { createAuthMiddleware } from './src/middleware';
import { createDataService, DataService } from './src/data-service';

const logger = createLogger(basename(__filename));

const envDecoder = object({
  JWT_CERT_DIR: withDefault(stringToFilePath, './certs'),
  HTTP_PORT: withDefault(stringToInt, 3000),
  DB_HOST: string,
  DB_NAME: withDefault(string, 'db'),
  DB_USER: string,
  DB_PASSWORD: string,
  DB_PORT: withDefault(number, 5432)
});

const {
  JWT_CERT_DIR, HTTP_PORT,
  DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_PORT
} = guard(envDecoder)(process.env);

const publicKeyPath = join(JWT_CERT_DIR, 'jwt.pub');

const dbPool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_NAME,
  password: DB_PASSWORD,
  port: DB_PORT
});

type Services = {
  authService: AuthService,
  dataService: DataService
}

const createServices = (): Services => {
  const authService: AuthService = createAuthService({
    publicKeyPath
  });
  const dataService: DataService = createDataService({
    dbPool
  });
  return {
    authService,
    dataService
  };
};

const createRouter = (services: Services): Router => {
  const { authService } = services;
  const authMiddleware = createAuthMiddleware(authService);
  const router = Router();
  router.use(authMiddleware);

  initRoutes(router, services);

  return router;
};

const init = () => {
  const { app, httpServer } = createServer(HTTP_PORT);

  const services = createServices();
  const router = createRouter(services);

  app.use(router);

  httpServer.listen(HTTP_PORT);
  logger.info(`server running in port ${HTTP_PORT}`);
};

init();
