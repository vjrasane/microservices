declare global {
    namespace Express {
        interface Request {
            token?: object
        }
    }
}

export {};
