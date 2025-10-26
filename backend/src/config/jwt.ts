import * as jwt from "jsonwebtoken";

export const JWT_SECRET: string =
  process.env.JWT_SECRET ?? "change_this_secret_in_production";
export const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN ?? "15m";
export const JWT_REFRESH_SECRET: string =
  process.env.JWT_REFRESH_SECRET ?? "change_refresh_secret";
export const JWT_REFRESH_EXPIRES_IN: string =
  process.env.JWT_REFRESH_EXPIRES_IN ?? "7d";

export type JWTPayload = {
  sub?: string;
  email?: string;
  role?: string;
  [key: string]: any;
};

// Helper casts to avoid repetir los as everywhere
const accessSecret = JWT_SECRET as jwt.Secret;
const refreshSecret = JWT_REFRESH_SECRET as jwt.Secret;
const accessSignOptions = { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions;
const refreshSignOptions = {
  expiresIn: JWT_REFRESH_EXPIRES_IN,
} as jwt.SignOptions;

export const generateAccessToken = (payload: JWTPayload): string => {
  return jwt.sign(
    payload as string | jwt.JwtPayload,
    accessSecret,
    accessSignOptions
  );
};

export const generateRefreshToken = (payload: JWTPayload): string => {
  return jwt.sign(
    payload as string | jwt.JwtPayload,
    refreshSecret,
    refreshSignOptions
  );
};

export const verifyAccessToken = <T = jwt.JwtPayload | JWTPayload>(
  token: string
): T => {
  return jwt.verify(token, accessSecret) as T;
};

export const verifyRefreshToken = <T = jwt.JwtPayload | JWTPayload>(
  token: string
): T => {
  return jwt.verify(token, refreshSecret) as T;
};

/**
 * Opcional: funciones seguras que envuelven verify con try/catch y devuelven null si inválido
 */
export const safeVerifyAccessToken = <T = jwt.JwtPayload | JWTPayload>(
  token: string
): T | null => {
  try {
    return verifyAccessToken<T>(token);
  } catch (err) {
    return null;
  }
};

export const safeVerifyRefreshToken = <T = jwt.JwtPayload | JWTPayload>(
  token: string
): T | null => {
  try {
    return verifyRefreshToken<T>(token);
  } catch (err) {
    return null;
  }
};
