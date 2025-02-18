import * as dotenv from 'dotenv';
dotenv.config(); // Carrega variáveis de ambiente do arquivo .env

import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { createSchema } from './schema'; // Ajuste o caminho conforme necessário
import { prisma } from './database';
import cors from 'cors'; // Importa o CORS

const app = express();

// Configuração do CORS
app.use(cors({
  origin: '*', // Permitir todos os domínios (ajuste conforme necessário)
  credentials: true
}));

const startServer = async () => {
  try {
    // Tente se conectar ao banco de dados
    try {
      await prisma.$connect();
      console.log('Conexão com o banco de dados estabelecida com sucesso.');
    } catch (dbError) {
      console.error('Erro ao tentar estabelecer conexão com o banco de dados:', dbError);
      // Encerrar o processo se a conexão falhar
      process.exit(1);
    }

    // Crie o schema e o servidor Apollo
    const schema = await createSchema();
    const server = new ApolloServer({
      schema,
      persistedQueries: false, // Para evitar ataques de negação de serviço
      cache: 'bounded', // Define cache limitado para maior segurança
    });

    // Aguarde o servidor Apollo ser iniciado
    await server.start();

    // Aplica o middleware do Apollo Server
    server.applyMiddleware({ app });

    // Use a porta da variável de ambiente ou 4000 como padrão
    const port = process.env.PORT || 4000;

    // Inicie o servidor Express
    app.listen(port, () => {
      console.log(`Servidor pronto em http://localhost:${port}${server.graphqlPath}`);
    });
  } catch (error) {
    // Captura e exibe erros gerais de inicialização
    console.error('Erro ao tentar iniciar o servidor:', error);
    // Encerrar o processo se houver erro na inicialização
    process.exit(1);
  }
};

startServer();
