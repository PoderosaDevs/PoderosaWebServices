import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { DateScalar } from "./scalars/DateScalar"; // Ajuste o caminho conforme necessário
import {
  Autenticacao,
  Produto,
  Usuario,
  Linha,
  Loja,
  Marca,
  Meta,
  Venda,
} from "./resolvers";

export const createSchema = async () => {
  return buildSchema({
    resolvers: [
      Autenticacao,
      Produto,
      Usuario,
      Linha,
      Loja,
      Marca,
      Meta,
      Venda
    ],
    scalarsMap: [{ type: Date, scalar: DateScalar }],
  });
};
