import { env } from "./config/env";
import { connectDatabase } from "./config/database";
import { resolveJunctionTables } from "./config/junctionTables";
import { associateModels } from "./database/models";
import { createApp } from "./app";
import { logger } from "./utils/logger";

async function bootstrap(): Promise<void> {
  try {
    await connectDatabase();

    const junctions = await resolveJunctionTables();
    associateModels(junctions);

    const app = createApp();

    app.listen(env.port, () => {
      logger.info(`Servidor pronto em http://localhost:${env.port}/api/v1`);
    });
  } catch (error) {
    logger.error("Erro ao tentar iniciar o servidor:", error);
    process.exit(1);
  }
}

bootstrap();
