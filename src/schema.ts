import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { DateScalar } from './scalars/DateScalar'; // Ajuste o caminho conforme necessário
import {
  Autenticacao,
  Avaliacao,
  Produto,
  Usuario,
  Venda,
  Loja,
  Linha,
  Marca,
  Meta,
  StockDiaTrabalhadoFuncionario,
  StockFuncionario
} from './resolvers';

export const createSchema = async () => {
  return buildSchema({
    resolvers: [
      Autenticacao,
      Avaliacao,
      Produto,
      Usuario,
      Venda,
      Loja,
      Linha,
      Marca,
      Meta,
      StockDiaTrabalhadoFuncionario,
      StockFuncionario
    ],
    scalarsMap: [
      { type: Date, scalar: DateScalar },
    ],
  });
};
