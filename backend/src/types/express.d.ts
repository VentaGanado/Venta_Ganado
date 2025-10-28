declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        nombre: string;
      };
      usuario?: {
        id: number;
        email: string;
        nombre: string;
      };
    }
  }
}

export {};