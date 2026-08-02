import { Sequelize } from "sequelize";
import { env } from "./env";
import { logger } from "../utils/logger";

// Conecta ao MESMO banco Postgres ja existente. Nenhuma migration/sync roda
// contra esse banco: os models abaixo apenas mapeiam tabelas/colunas que ja
// existem, para nao arriscar alterar dados de producao.
export const sequelize = new Sequelize(env.databaseUrl, {
  dialect: "postgres",
  logging: env.isProduction ? false : (sql) => logger.debug(sql),
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  define: {
    timestamps: false,
    freezeTableName: true,
  },
});

export async function connectDatabase(): Promise<void> {
  await sequelize.authenticate();
  logger.info("Conexao com o banco de dados estabelecida com sucesso.");
}
