import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ApiError } from "../utils/apiError";
import { env } from "../config/env";
import { logger } from "../utils/logger";
import { sendErrorAlert } from "../services/MailService";

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({ message: `Rota nao encontrada: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      message: "Dados invalidos.",
      details: err.flatten(),
    });
    return;
  }

  if (err instanceof ApiError) {
    if (err.status >= 500) {
      logger.error(err.message, err.details);
      sendErrorAlert({
        message: err.message,
        stack: err.stack,
        path: req.originalUrl,
      }).catch(() => undefined);
    }
    res.status(err.status).json({ message: err.message, details: err.details });
    return;
  }

  const error = err instanceof Error ? err : new Error("Erro desconhecido.");
  logger.error(error.message, error.stack);

  sendErrorAlert({
    message: error.message,
    stack: error.stack,
    path: req.originalUrl,
  }).catch(() => undefined);

  res.status(500).json({
    message: env.isProduction ? "Erro interno do servidor." : error.message,
    ...(env.isProduction ? {} : { stack: error.stack }),
  });
}
