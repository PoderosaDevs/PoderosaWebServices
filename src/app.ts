import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { env } from "./config/env";
import routes from "./routes";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler";
import { asyncHandler } from "./utils/asyncHandler";
import { sendErrorAlert } from "./services/MailService";

export function createApp(): Express {
  const app = express();

  app.set("trust proxy", 1);
  app.use(helmet());
  app.use(
    cors({
      origin: env.corsOrigins.includes("*") ? true : env.corsOrigins,
      credentials: true,
    })
  );
  app.use(compression());
  app.use(express.json({ limit: "2mb" }));

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 600,
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use(limiter);

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", uptime: process.uptime() });
  });

  // Endpoint usado pelo front (Error Boundary / listeners globais) para
  // reportar erros de runtime do cliente. Publico, sem autenticacao.
  app.post(
    "/error-report",
    asyncHandler(async (req, res) => {
      const { message, stack, url } = req.body ?? {};
      const userAgent = req.headers["user-agent"];

      if (message) {
        await sendErrorAlert({ message, stack, url, userAgent }).catch(() => undefined);
      }

      res.status(202).json({ received: true });
    })
  );

  app.use("/api/v1", routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
