import * as dotenv from 'dotenv';
dotenv.config(); // Carrega variáveis de ambiente do arquivo .env

import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { createSchema } from './schema'; // Ajuste o caminho conforme necessário
import { prisma } from './database';

const app = express();

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
    });

    // Aguarde o servidor Apollo ser iniciado
    await server.start();
    server.applyMiddleware({ app });

    // Inicie o servidor Express
    app.listen({ port: 4000 }, () => {
      console.log(`Server ready at http://localhost:4000${server.graphqlPath}`);
    });
  } catch (error) {
    // Captura e exibe erros gerais de inicialização
    console.error('Erro ao tentar iniciar o servidor:', error);
    // Encerrar o processo se houver erro na inicialização
    process.exit(1);
  }
};

startServer();
