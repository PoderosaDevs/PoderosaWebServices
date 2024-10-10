// src/models/venda/VendaDetalhe.ts

import { ObjectType, Field, Int, Float } from 'type-graphql';
import { ProdutoModel } from '../Produto';

@ObjectType()
export class VendaDetalhe {
  @Field(() => Int)
  id!: number;

  @Field(() => Int) // Corrigido para String
  produto_id!: number;

  @Field(() => Int)
  quantidade!: number;

  @Field(() => Int)
  pontos!: number;

  @Field(() => ProdutoModel)
  produto!: ProdutoModel;
}
