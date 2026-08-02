import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AuthPayload } from "../types/express";

const EXPIRES_IN = "2d";

export function signToken(payload: AuthPayload): string {
  return jwt.sign(payload, env.authSecret, { expiresIn: EXPIRES_IN });
}

export function verifyToken(token: string): AuthPayload {
  return jwt.verify(token, env.authSecret) as AuthPayload;
}
