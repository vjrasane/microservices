import jwt from 'jsonwebtoken';

import fs from 'fs';

type JWTPayload = {
  id: string
  username: string
}

type AuthService = {
  generateJwt: (payload: JWTPayload) => string,
  verifyJwt: (token: string) => string | object
}

type AuthConfig = {
  certFilePath: string,
  publicKeyPath: string,
}

const createAuthService = (config: AuthConfig): AuthService => {
  const { certFilePath, publicKeyPath } = config;
  const certificate = fs.readFileSync(certFilePath, 'utf-8');
  const publicKey = fs.readFileSync(publicKeyPath, 'utf-8');

  const generateJwt = (payload: JWTPayload): string => {
    const token = jwt.sign(payload, certificate, { algorithm: 'RS256' });
    return token;
  };

  const verifyJwt = (token: string) => jwt.verify(token, publicKey, { algorithms: ['RS256'] });

  return {
    generateJwt,
    verifyJwt
  };
};

export { createAuthService, AuthService, JWTPayload };
