import express from 'express';
import http from 'http';
import morgan from 'morgan';
import { basename, join } from 'path';
import {
  guard, object, string
} from 'decoders';
import { AuthService, createAuthService } from './src/auth-service';
import { UserService, createUserService } from './src/user-service';

import initEndpoints from './src/endpoints';
import { createLogger } from '../common/logger';
import { withDefault, stringToFilePath, stringToInt } from '../common/decoders';

const logger = createLogger(basename(__filename));

const envDecoder = object({
  JWT_CERT_DIR: withDefault(stringToFilePath, './certs'),
  HTTP_PORT: withDefault(stringToInt, 3000),
  DB_HOST: string,
  DB_NAME: withDefault(string, 'db'),
  DB_USER: string,
  DB_PASSWORD: string
});

const {
  JWT_CERT_DIR, HTTP_PORT,
  DB_USER, DB_PASSWORD, DB_HOST, DB_NAME
} = guard(envDecoder)(process.env);

const certFilePath = join(JWT_CERT_DIR, 'jwt.crt');
const publicKeyPath = join(JWT_CERT_DIR, 'jwt.pub');
const createServices = async () => {
  const authService: AuthService = createAuthService({
    certFilePath,
    publicKeyPath
  });
  const userService: UserService = await createUserService({
    dbHost: DB_HOST,
    dbName: DB_NAME,
    dbUser: DB_USER,
    dbPassword: DB_PASSWORD
  });
  return {
    authService,
    userService
  };
};

const createServer = () => {
  const app = express();
  app.use(express.json());
  app.use(morgan(
    ':date[iso] :method :url :status :response-time ms - :res[content-length]'
  ));

  app.set('port', HTTP_PORT);

  const httpServer: http.Server = http.createServer(app);
  return {
    app,
    httpServer
  };
};

const init = async () => {
  const { app, httpServer } = createServer();
  const services = await createServices();

  initEndpoints(app, services);

  httpServer.listen(HTTP_PORT);
  logger.info(`server running in port ${HTTP_PORT}`);
};

init();
