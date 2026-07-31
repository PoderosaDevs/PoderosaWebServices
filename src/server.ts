import * as dotenv from "dotenv";
dotenv.config(); // Carrega variáveis de ambiente do arquivo .env

import express from "express";
import { ApolloServer } from "apollo-server-express";
import { createSchema } from "./schema"; // Ajuste o caminho conforme necessário
import { prisma } from "./database";
import cors from "cors"; // Importa o CORS
import { sendErrorAlert } from "./services/mailService";

const app = express();

// Configuração do CORS
app.use(
  cors({
    origin: "*", // Permitir todos os domínios (ajuste conforme necessário)
    credentials: true,
  })
);

// Rota para receber erros reportados pelo frontend (Error Boundary / window listeners)
app.post("/error-report", express.json(), async (req, res) => {
  const { message, stack, url } = req.body;
  const userAgent = req.headers["user-agent"];

  try {
    await sendErrorAlert({ message, stack, url, userAgent });
  } catch (err) {
    console.error("Falha ao enviar email de erro (frontend):", err);
  }

  res.status(202).json({ received: true });
});

const startServer = async () => {
  try {
    // Tente se conectar ao banco de dados
    try {
      await prisma.$connect();
      console.log("Conexão com o banco de dados estabelecida com sucesso.");


    } catch (dbError) {
      console.error(
        "Erro ao tentar estabelecer conexão com o banco de dados:",
        dbError
      );
      // Encerrar o processo se a conexão falhar
      process.exit(1);
    }

    // Crie o schema e o servidor Apollo
    const schema = await createSchema();
    const server = new ApolloServer({
      schema,
      persistedQueries: false, // Para evitar ataques de negação de serviço
      cache: "bounded", // Define cache limitado para maior segurança
      formatError: (error) => {
        // Envia alerta por email para erros vindos dos resolvers (GraphQL)
        sendErrorAlert({
          message: error.message,
          stack:
            (error.extensions?.exception?.stacktrace as string[] | undefined)?.join("\n") ??
            error.stack,
          path: error.path?.join("."),
        }).catch((err) =>
          console.error("Falha ao enviar email de erro (GraphQL):", err)
        );

        // Em produção, não expõe stack trace/detalhes internos pro client
        if (process.env.NODE_ENV === "production") {
          return { message: error.message, path: error.path } as typeof error;
        }
        return error;
      },
    });

    // Aguarde o servidor Apollo ser iniciado
    await server.start();

    // Aplica o middleware do Apollo Server
    server.applyMiddleware({ app });

    // Use a porta da variável de ambiente ou 4000 como padrão
    const port = process.env.PORT || 4000;

    // Inicie o servidor Express
    app.listen(port, () => {
      console.log(
        `Servidor pronto em http://localhost:${port}${server.graphqlPath}`
      );
    });
  } catch (error) {
    // Captura e exibe erros gerais de inicialização
    console.error("Erro ao tentar iniciar o servidor:", error);
    // Encerrar o processo se houver erro na inicialização
    process.exit(1);
  }
};

startServer();