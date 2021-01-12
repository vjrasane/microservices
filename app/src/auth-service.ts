import { Request } from 'express';
import jwt from 'jsonwebtoken';
import fs from 'fs';

type AuthService = {
  verifyRequestToken: (req: Request) => string | object
}

type AuthConfig = {
  publicKeyPath: string
}

const createAuthService = (config: AuthConfig): AuthService => {
  const { publicKeyPath } = config;

  const publicKey = fs.readFileSync(publicKeyPath, 'utf-8');

  const verifyJwt = (token: string) => jwt.verify(token, publicKey, { algorithms: ['RS256'] });

  const verifyRequestToken = (req: Request): string | object => {
    const [method, token] = req.headers.authorization?.split(' ') || [];
    if (method !== 'Bearer' || !token) {
      throw new Error('no brearer authorization token');
    }
    return verifyJwt(token);
  };

  return {
    verifyRequestToken
  };
};

export { createAuthService, AuthService };
