import * as dotenv from 'dotenv';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { createSchema } from './schema'; // Ajuste o caminho conforme necessário
import { prisma } from './database';
import cors from 'cors';

dotenv.config(); // Carrega variáveis de ambiente do arquivo .env

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
      introspection: true,  // Permitir introspecção em produção
      // O playground foi removido nas versões mais recentes
    });

    // Aguarde o servidor Apollo ser iniciado
    await server.start();
    server.applyMiddleware({ app });

    // Habilitar CORS
    app.use(cors({
      origin: '*',  // Ajuste conforme necessário para segurança
      credentials: true
    }));

    // Use a porta da variável de ambiente ou 4000 como padrão
    const port = process.env.PORT || 4000;

    // Crie a URL pública
    const publicUrl = `https://${process.env.RENDER_EXTERNAL_URL}${server.graphqlPath}`;

    // Inicie o servidor Express
    app.listen({ port }, () => {
      console.log(`Server ready at ${publicUrl}`);
    });
  } catch (error) {
    // Captura e exibe erros gerais de inicialização
    console.error('Erro ao tentar iniciar o servidor:', error);
    // Encerrar o processo se houver erro na inicialização
    process.exit(1);
  }
};

startServer();
